import { SlashCommandBuilder } from 'discord.js';
import zamanSystem from '../zamanSystem.js';

export default {
  data: new SlashCommandBuilder()
    .setName('zamanyolculugu')
    .setDescription('Zaman yolculuğu yaparsın, enerji ve parça gerektirir.'),

  async execute(interaction, client) {
    const userId = interaction.user.id;

    // Enerji durumu kontrolü
    const userEnergyData = client.energySystem.getUserEnergy(userId);
    if (userEnergyData.energy <= 0) {
      return interaction.reply({ content: '⚠️ Enerjin kalmamış, biraz dinlen!', ephemeral: true });
    }

    // Zaman parçası kontrolü
    const userParcaData = zamanSystem.getParca(userId);
    if (userParcaData.parcaSayisi < 1) {
      return interaction.reply({ content: '⚠️ Zaman parçan yok, daha fazla topla!', ephemeral: true });
    }

    // Enerji ve zaman parçası harca
    client.energySystem.consumeEnergy(userId);
    zamanSystem.spendParca(userId, 1);

    // Başarılı mesaj
    await interaction.reply({ content: '🕰️ Zaman yolculuğu başarılı! Enerji ve 1 zaman parçası harcandı.' });
  },
};
