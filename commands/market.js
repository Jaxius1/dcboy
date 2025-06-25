import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const marketItems = [
  { name: 'Kılıç', price: 50, description: 'Temel saldırı aracı' },
  { name: 'Kalkan', price: 40, description: 'Savunmanı artırır' },
  { name: 'Büyü Kitabı', price: 60, description: 'Zeka arttırır' },
];

export default {
  data: new SlashCommandBuilder()
    .setName('market')
    .setDescription('Markette satılan eşyaları listeler'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Market Eşyaları')
      .setColor('Blue')
      .setDescription(marketItems.map(i => `**${i.name}** - ${i.price} Gold\n${i.description}`).join('\n\n'));

    await interaction.reply({ embeds: [embed] });
  }
};
