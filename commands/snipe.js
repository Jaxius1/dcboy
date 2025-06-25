// snipe.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('snipe')
    .setDescription('🕵️ Son silinen mesajı gösterir.'),
  async execute(interaction) {
    const snipe = interaction.client.snipe;

    if (!snipe) {
      return interaction.reply({ content: '⛔ Henüz silinmiş bir mesaj yok!', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('💬 Son Silinen Mesaj')
      .addFields(
        { name: '👤 Yazar', value: snipe.yazar },
        { name: '📺 Kanal', value: snipe.kanal },
        { name: '🕒 Zaman', value: snipe.zaman },
        { name: '💬 Mesaj', value: snipe.içerik || 'Mesaj boştu veya sadece embed içeriyordu.' },
      )
      .setColor('Red');


    await interaction.reply({ embeds: [embed] });
  },
};
