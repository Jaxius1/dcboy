import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';

const karakterFile = path.join(process.cwd(), 'karakterData.json');

function readKarakterData() {
  if (!fs.existsSync(karakterFile)) return {};
  return JSON.parse(fs.readFileSync(karakterFile, 'utf-8'));
}

function writeKarakterData(data) {
  fs.writeFileSync(karakterFile, JSON.stringify(data, null, 2));
}

const kisilikler = [
  'Sakin',
  'Agresif',
  'Maceraperest',
  'Zeki',
  'Gizemli',
  'Ezik',
  'Lider Ruhlu',
  'Psikopat',
  'Çılgın',
  'Duygusal',
];

export default {
  data: new SlashCommandBuilder()
    .setName('kisilik-degistir')
    .setDescription('Karakterinin kişiliğini rastgele değiştirir.'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const data = readKarakterData();

    if (!data[userId]) {
      return interaction.reply({
        content: '❌ Henüz bir karakterin yok. Oluşturmak için `/karakter-olustur` kullan.',
        ephemeral: true,
      });
    }

    const yeniKisilik = kisilikler[Math.floor(Math.random() * kisilikler.length)];
    data[userId].kişilik = yeniKisilik;
    writeKarakterData(data);

    await interaction.reply({
      content: `🎭 Yeni kişiliğin: **${yeniKisilik}**`,
    });
  },
};
