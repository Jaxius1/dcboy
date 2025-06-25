import { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bir kullanıcıyı banlamak için onay alır.')
    .addUserOption(option => option.setName('kullanici').setDescription('Banlanacak kullanıcı').setRequired(true))
    .addStringOption(option => option.setName('sebep').setDescription('Ban sebebi').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction, client) {
    const user = interaction.options.getUser('kullanici');
    const sebep = interaction.options.getString('sebep') || 'Sebep belirtilmedi';

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'Bu kullanıcı sunucuda değil.', ephemeral: true });

    if (!member.bannable) return interaction.reply({ content: 'Bu kullanıcıyı banlayamam.', ephemeral: true });

    // Ban onay butonları
    const evetBtn = new ButtonBuilder()
      .setCustomId(`banOnay_${user.id}_${interaction.user.id}`)
      .setLabel('Onayla')
      .setStyle(ButtonStyle.Success);

    const hayirBtn = new ButtonBuilder()
      .setCustomId(`banRed_${user.id}_${interaction.user.id}`)
      .setLabel('Reddet')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(evetBtn, hayirBtn);

    await interaction.reply({ content: `${user.tag} kullanıcısını banlamak için onay bekleniyor. Sebep: ${sebep}`, components: [row], ephemeral: true });

    const logChannel = interaction.guild.channels.cache.get(client.guardLogChannelId);
    if (!logChannel) return interaction.followUp({ content: 'Log kanalı bulunamadı.', ephemeral: true });

    const onayMesaji = await logChannel.send({
      content: `⚠️ ${interaction.user.tag} kullanıcısı ${user.tag} adlı kullanıcıyı banlamak istiyor.\nSebep: ${sebep}`,
      components: [row],
    });

    // Collector filtresi: sadece ban yetkisi olanlar ve ilgili butonlar geçerli
    const filter = i => {
      if (!i.isButton()) return false;
      if (!i.member.permissions.has(PermissionFlagsBits.BanMembers)) return false;
      return ['banOnay', 'banRed'].some(prefix => i.customId.startsWith(prefix)) && i.customId.endsWith(interaction.user.id);
    };

    const collector = onayMesaji.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
      if (i.customId.startsWith('banOnay_')) {
        await member.ban({ reason: sebep });
        await i.update({ content: `${user.tag} banlandı!`, components: [] });
        await interaction.editReply({ content: `${user.tag} banlandı!`, components: [] });
        collector.stop();
      } else if (i.customId.startsWith('banRed_')) {
        await i.update({ content: 'Ban işlemi reddedildi.', components: [] });
        await interaction.editReply({ content: 'Ban işlemi reddedildi.', components: [] });
        collector.stop();
      }
    });

    collector.on('end', async collected => {
      if (collected.size === 0) {
        await onayMesaji.edit({ content: 'Ban onayı için süre doldu, işlem iptal edildi.', components: [] });
        await interaction.editReply({ content: 'Ban onayı için süre doldu, işlem iptal edildi.', components: [] });
      }
    });
  },
};

