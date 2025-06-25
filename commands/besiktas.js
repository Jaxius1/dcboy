import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getBesiktasMatches } from '../utils/apiFootball.js';

export default {
  data: new SlashCommandBuilder()
    .setName('besiktas')
    .setDescription('Beşiktaş’ın güncel maç fikstürü ve sonuçları.'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const matches = await getBesiktasMatches();

      const embed = new EmbedBuilder()
        .setTitle('Beşiktaş Maç Fikstürü ve Sonuçlar')
        .setColor('#000000')
        .setTimestamp();

      // Son 5 maçı gösterelim, tarih, rakip, skor vs.
      const recentMatches = matches
        .filter(m => m.league.id === 195) // sadece Süper Lig maçları
        .slice(0, 5);

      let description = '';

      recentMatches.forEach(match => {
        const date = new Date(match.fixture.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
        const vsTeam = match.teams.home.id === 2 ? match.teams.away.name : match.teams.home.name;
        const score = match.score.fulltime.home !== null
          ? `${match.score.fulltime.home} - ${match.score.fulltime.away}`
          : 'Henüz Oynanmadı';

        description += `**${date}** | Rakip: **${vsTeam}** | Sonuç: ${score}\n`;
      });

      embed.setDescription(description || 'Maç bilgisi bulunamadı.');

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply('Maç bilgileri alınırken hata oluştu.');
    }
  },
};
