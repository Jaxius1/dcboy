import { SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';

export default {
  data: new SlashCommandBuilder()
    .setName('doviz')
    .setDescription('Döviz kuru çevirici')
    .addStringOption(option =>
      option.setName('base')
        .setDescription('Çevirmek istediğin para birimi (örnek: USD)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('target')
        .setDescription('Hangi para birimine çevireceksin (örnek: TRY)')
        .setRequired(true)),
  
  async execute(interaction) {
    const apiKey = process.env.EXCHANGERATE_API_KEY;
    const base = interaction.options.getString('base').toUpperCase();
    const target = interaction.options.getString('target').toUpperCase();

    try {
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`);
      if (!response.ok) throw new Error('API hatası');
      const data = await response.json();

      if (data.result !== 'success') {
        await interaction.reply({ content: 'Geçersiz para birimi veya API hatası!', ephemeral: true });
        return;
      }

      const rate = data.conversion_rates[target];
      if (!rate) {
        await interaction.reply({ content: 'Hedef para birimi bulunamadı!', ephemeral: true });
        return;
      }

      await interaction.reply(`${base} → ${target} kuru: **${rate}**`);
    } catch (error) {
      console.error('Döviz API hatası:', error);
      await interaction.reply({ content: 'Döviz bilgisi alınırken bir hata oluştu.', ephemeral: true });
    }
  }
};
