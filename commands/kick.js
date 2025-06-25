import { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Bir kullanıcıyı kicklemek için onay alır.')
    .addUserOption(option => option.setName('kullanici').setDescription('Kicklenecek kullanıcı').setRequired(true))
    .addStringOption(option => option.setName('sebep').setDescription('Kick sebebi').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction, client) {
    const user = interaction.options.getUser('kullanici');
    const sebep = interaction.options.getString('sebep') || 'Sebep belirtilmedi';

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'Bu kullanıcı sunucuda değil.', ephemeral: true });

    if (!member.kickable) return interaction.reply({ content: 'Bu kullanıcıyı kickleyemem.', ephemeral: true });

    // Kick onay butonları
    const evetBtn = new ButtonBuilder()
      .setCustomId(`kickOnay_${user.id}_${interaction.user.id}`)
      .setLabel('Onayla')
      .setStyle(ButtonStyle.Success);

    const hayirBtn = new ButtonBuilder()
      .setCustomId(`kickRed_${user.id}_${interaction.user.id}`)
      .setLabel('Reddet')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(evetBtn, hayirBtn);

    await interaction.reply({ content: `${user.tag} kullanıcısını kicklemek için onay bekleniyor. Sebep: ${sebep}`, components: [row], ephemeral: true });

    const logChannel = interaction.guild.channels.cache.get(client.guardLogChannelId);
    if (!logChannel) return interaction.followUp({ content: 'Log kanalı bulunamadı.', ephemeral: true });

    const onayMesaji = await logChannel.send({
      content: `⚠️ ${interaction.user.tag} kullanıcısı ${user.tag} adlı kullanıcıyı kicklemek istiyor.\nSebep: ${sebep}`,
      components: [row],
    });

    // Collector filtresi
    const filter = i => {
      if (!i.isButton()) return false;
      if (!i.member.permissions.has(PermissionFlagsBits.KickMembers)) return false;
      return ['kickOnay', 'kickRed'].some(prefix => i.customId.startsWith(prefix)) && i.customId.endsWith(interaction.user.id);
    };

    const collector = onayMesaji.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
      if (i.customId.startsWith('kickOnay_')) {
        await member.kick(sebep);
        await i.update({ content: `${user.tag} kicklendi!`, components: [] });
        await interaction.editReply({ content: `${user.tag} kicklendi!`, components: [] });
        collector.stop();
      } else if (i.customId.startsWith('kickRed_')) {
        await i.update({ content: 'Kick işlemi reddedildi.', components: [] });
        await interaction.editReply({ content: 'Kick işlemi reddedildi.', components: [] });
        collector.stop();
      }
    });

    collector.on('end', async collected => {
      if (collected.size === 0) {
        await onayMesaji.edit({ content: 'Kick onayı için süre doldu, işlem iptal edildi.', components: [] });
        await interaction.editReply({ content: 'Kick onayı için süre doldu, işlem iptal edildi.', components: [] });
      }
    });
  },
};
