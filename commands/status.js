import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const statusFile = path.join(__dirname, 'status.json');

export default {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Botun durumunu değiştirir')
    .addStringOption(option =>
      option.setName('durum')
        .setDescription('Botun yeni durumu (örn: oynuyor, izliyor, dinliyor)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('mesaj')
        .setDescription('Durum mesajı (örn: Beşiktaş maçını izle)')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const durum = interaction.options.getString('durum').toLowerCase();
    const mesaj = interaction.options.getString('mesaj');

    let aktiviteTip;

    if (durum === 'oynuyor') aktiviteTip = 0;
    else if (durum === 'izliyor') aktiviteTip = 2;
    else if (durum === 'dinliyor') aktiviteTip = 3;
    else {
      return interaction.reply({ content: 'Geçersiz durum türü! (oynuyor, izliyor, dinliyor)', ephemeral: true });
    }

    try {
      // Durumu değiştir
      await interaction.client.user.setActivity(mesaj, { type: aktiviteTip });

      // Durumu json dosyasına kaydet
      const data = { type: aktiviteTip, message: mesaj };
      fs.writeFileSync(statusFile, JSON.stringify(data, null, 2));

      await interaction.reply(`Bot durumu başarıyla '${durum} ${mesaj}' olarak ayarlandı.`);
    } catch (error) {
      console.error('Durum ayarlama hatası:', error);
      await interaction.reply({ content: 'Durum ayarlanırken hata oluştu.', ephemeral: true });
    }
  },
};
