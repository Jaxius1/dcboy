import { SlashCommandBuilder } from 'discord.js';
import { fetchAIResponse } from '../utils/ai.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ai')
    .setDescription('AI ile konuş')
    .addStringOption(option =>
      option.setName('mesaj')
        .setDescription('Sorunu yaz')
        .setRequired(true)
    ),
  async execute(interaction) {
    const mesaj = interaction.options.getString('mesaj');
    await interaction.deferReply(); // Yanıt gecikecekse defer iyi olur

    const yanit = await fetchAIResponse(mesaj);
    await interaction.editReply({ content: yanit.slice(0, 2000) }); // 2000 karakter limiti
  }
};
