import { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import ms from 'ms';

export default {
  data: new SlashCommandBuilder()
    .setName('cekilis')
    .setDescription('🎉 Butonlu çekiliş başlatır.')
    .addStringOption(option =>
      option.setName('sure')
        .setDescription('Çekiliş süre')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('odul')
        .setDescription('Ödül')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const sure = interaction.options.getString('sure');
    const odul = interaction.options.getString('odul');
    const zaman = ms(sure);

    if (!zaman || zaman < 5000) {
      return interaction.reply({ content: '⛔ En az 5 saniyelik geçerli bir süre girin (1m, 2h)', ephemeral: true });
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('cekilis-katil')
        .setLabel('🎉 Katıl')
        .setStyle(ButtonStyle.Primary)
    );

    const embed = new EmbedBuilder()
      .setTitle('🎉 Çekiliş Başladı!')
      .setDescription(`🎁 Ödül: **${odul}**\n⏰ Süre: <t:${Math.floor((Date.now() + zaman) / 1000)}:R>`)
      .setFooter({ text: `Başlatılan: ${interaction.user.tag}` })
      .setColor(Math.floor(Math.random() * 16777215).toString(16)) 

    const mesaj = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

    const katilimcilar = new Set();

    const collector = mesaj.createMessageComponentCollector({
      time: zaman,
      filter: i => i.customId === 'cekilis-katil',
    });

    collector.on('collect', async i => {
      if (katilimcilar.has(i.user.id)) {
        return i.reply({ content: 'Zaten katıldın reis!', ephemeral: true });
      }

      katilimcilar.add(i.user.id);
      await i.reply({ content: '🎉 Katıldın!', ephemeral: true });
    });

    collector.on('end', async () => {
      if (katilimcilar.size === 0) {
        return mesaj.edit({ content: '❌ Katılım yok, çekiliş iptal.', components: [], embeds: [] });
      }

      const kazananId = [...katilimcilar][Math.floor(Math.random() * katilimcilar.size)];
      const kazanan = `<@${kazananId}>`;

      const kazananEmbed = new EmbedBuilder()
        .setTitle('🎉 Çekiliş Bitti!')
        .setDescription(`🎁 Ödül: **${odul}**\n🏆 Kazanan: ${kazanan}`)
        .setColor('Gold');

      await mesaj.edit({ embeds: [kazananEmbed], components: [] });
      await mesaj.channel.send(`🎊 Tebrikler ${kazanan}, **${odul}** kazandın!`);
    });
  },
};
