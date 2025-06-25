import { SlashCommandBuilder } from 'discord.js';
import { readMoods, writeMoods } from '../utils/moods.js'; // yukarıdaki fonksiyonları bu dosyaya koy

export default {
  data: new SlashCommandBuilder()
    .setName('mood')
    .setDescription('Şu anki ruh halini seç.')
    .addStringOption(option =>
      option.setName('durum')
        .setDescription('Ruh halini seç')
        .setRequired(true)
        .addChoices(
          { name: 'Neşeli', value: 'happy' },
          { name: 'Üzgün', value: 'sad' },
          { name: 'Sinirli', value: 'angry' },
          { name: 'Heyecanlı', value: 'excited' },
          { name: 'Sakin', value: 'calm' },
        )
    ),

  async execute(interaction) {
    const mood = interaction.options.getString('durum');
    const guildId = interaction.guildId;
    const userId = interaction.user.id;

    const moods = readMoods();

    if (!moods[guildId]) moods[guildId] = {};
    moods[guildId][userId] = mood;

    writeMoods(moods);

    await interaction.reply(`🌀 Ruh halin '${mood}' olarak kaydedildi!`);
  }
};
