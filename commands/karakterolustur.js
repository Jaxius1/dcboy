import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';

const karakterFile = path.join(process.cwd(), 'karakterData.json');

// JSON'dan veriyi oku
function readKarakterData() {
  if (!fs.existsSync(karakterFile)) return {};
  return JSON.parse(fs.readFileSync(karakterFile, 'utf-8'));
}

// JSON'a veri yaz
function writeKarakterData(data) {
  fs.writeFileSync(karakterFile, JSON.stringify(data, null, 2));
}

export default {
  data: new SlashCommandBuilder()
    .setName('karakter-olustur')
    .setDescription('Kendine bir karakter oluştur!')
    .addStringOption(opt =>
      opt.setName('isim')
        .setDescription('Karakterine bir isim ver')
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const name = interaction.options.getString('isim');
    const data = readKarakterData();

    if (data[userId]) {
      return interaction.reply({
        content: `❌ Zaten bir karakterin var! İsmi: **${data[userId].name}**`,
        ephemeral: true,
      });
    }

    const karakter = {
      name: name,
      seviye: 1,
      güç: Math.floor(Math.random() * 10) + 5,
      zeka: Math.floor(Math.random() * 10) + 5,
      çeviklik: Math.floor(Math.random() * 10) + 5,
      kişilik: 'Tarafsız',
      enerji: 10,
      xp: 0,
    };

    data[userId] = karakter;
    writeKarakterData(data);

    await interaction.reply({
      content: `✅ Karakterin oluşturuldu! İsmi: **${karakter.name}**, Güç: ${karakter.güç}, Zeka: ${karakter.zeka}, Çeviklik: ${karakter.çeviklik}`,
    });
  },
};
