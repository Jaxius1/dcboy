import { SlashCommandBuilder } from 'discord.js';
import zamanSystem from '../zamanSystem.js';

export default {
  data: new SlashCommandBuilder()
    .setName('zamanparcasi')
    .setDescription('Topladığın zaman parçalarını gösterir'),

  async execute(interaction) {
    const data = zamanSystem.getParca(interaction.user.id);
    await interaction.reply(`🕰️ ${interaction.user.username}, elinde **${data.parcaSayisi}** zaman parçası var.`);
  }
};
