import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { readMoods } from '../utils/moods.js';

export default {
  data: new SlashCommandBuilder()
    .setName('moodreport')
    .setDescription('Sunucudaki ruh hali dağılımını gösterir.'),

  async execute(interaction) {
    const guildId = interaction.guildId;
    const moods = readMoods();

    if (!moods[guildId]) {
      return interaction.reply('Sunucu için hiç ruh hali kaydı yok.');
    }

    // Sunucudaki ruh hali sayısını hesapla
    const counts = {};
    for (const mood of Object.values(moods[guildId])) {
      counts[mood] = (counts[mood] || 0) + 1;
    }

    const embed = new EmbedBuilder()
      .setTitle(`${interaction.guild.name} - Sunucu Ruh Hali`)
      .setColor('Purple');

    let description = '';
    for (const [mood, count] of Object.entries(counts)) {
      description += `**${mood}**: ${count} kişi\n`;
    }

    embed.setDescription(description);

    await interaction.reply({ embeds: [embed] });
  }
};
