import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';

const karakterFile = path.join(process.cwd(), 'karakterData.json');

function readKarakterData() {
  if (!fs.existsSync(karakterFile)) return {};
  return JSON.parse(fs.readFileSync(karakterFile, 'utf-8'));
}

export default {
  data: new SlashCommandBuilder()
    .setName('envanter')
    .setDescription('Envanterini görüntüler.'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const data = readKarakterData();
    const userData = data[userId];

    if (!userData || !userData.envanter) {
      return interaction.reply('📦 Envanterin boş veya karakterin yok.');
    }

    const itemList = userData.envanter.length > 0 ? userData.envanter.join(', ') : 'Hiçbir şey yok.';
    return interaction.reply(`🎒 Envanterin: **${itemList}**`);
  },
};