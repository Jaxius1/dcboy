import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('enerjim')
    .setDescription('Kendi enerji puanını gösterir.'),

  async execute(interaction, client) {
    const energySystem = client.energySystem;
    if (!energySystem) {
      return interaction.reply({ content: 'Enerji sistemi bulunamadı.', ephemeral: true });
    }

    const userEnergyData = energySystem.getUserEnergy(interaction.user.id);
    const enerji = userEnergyData.energy;

    await interaction.reply({ content: `Senin enerji puanın: **${enerji}**` });
  },
};
