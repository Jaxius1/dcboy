import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

export default {
  data: new SlashCommandBuilder()
    .setName('deprem')
    .setDescription('Türkiye’deki son 10 depremi listeler.'),

  async execute(interaction) {
    try {
      // AFAD API endpointi (örnek)
      const url = 'https://api.orhanaydogdu.com.tr/deprem/kandilli/live'; // Burayı kendi kullandığın API'ye göre değiştir

      const response = await fetch(url);
      if (!response.ok) throw new Error('API yanıtı alınamadı.');

      const data = await response.json();

      if (!data.result || data.result.length === 0) {
        await interaction.reply('Deprem bilgisi bulunamadı.');
        return;
      }

      // Son 10 depremi al
      const last10 = data.result.slice(0, 10);

      let description = '';
      last10.forEach((deprem, i) => {
        description += `\`${i + 1}.\` Bölge: **${deprem.title}** | Tarih: **${deprem.date}** | Büyüklük: **${deprem.mag}**\n`;
      });

      const embed = new EmbedBuilder()
        .setTitle('Türkiye Son 10 Deprem Bilgisi')
        .setDescription(description)
        .setFooter({ text: 'Developer: Jaxius' })
        .setColor('Red')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Deprem bilgisi alınırken hata oluştu:', error);
      await interaction.reply('[❌ HATA] Deprem bilgisi alınırken hata oluştu.');
    }
  },
};
