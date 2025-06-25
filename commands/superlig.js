import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getSuperLigTable } from '../utils/apiFootball.js';

export default {
  data: new SlashCommandBuilder()
    .setName('superlig')
    .setDescription('Türkiye Süper Lig puan durumunu gösterir.'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const standings = await getSuperLigTable();

      const embed = new EmbedBuilder()
        .setTitle('Türkiye Süper Lig Puan Durumu')
        .setColor('Red')
        .setTimestamp();

      let description = '';
      standings.forEach((team, index) => {
        description += `\`${index + 1}.\` **${team.team.name}** - ${team.points} puan, ${team.all.played} maç, ${team.all.win} galibiyet, ${team.all.draw} beraberlik, ${team.all.lose} mağlubiyet\n`;
      });

      embed.setDescription(description);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply('Puan durumu alınırken hata oluştu.');
    }
  },
};
