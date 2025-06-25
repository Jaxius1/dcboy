import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import fs from 'fs';
import path from 'path';

const statusFile = path.join(process.cwd(), 'commandStatus.json');

// Helper function dosyayı oku
function getStatus() {
  if (!fs.existsSync(statusFile)) return {};
  return JSON.parse(fs.readFileSync(statusFile));
}

// Helper function dosyaya yaz
function setStatus(data) {
  fs.writeFileSync(statusFile, JSON.stringify(data, null, 2));
}

export default {
  data: new SlashCommandBuilder()
    .setName('komutdurum')
    .setDescription('Sunucuda komutları açar veya kapatır')
    .addStringOption(option =>
      option.setName('durum')
        .setDescription('Komutu aç veya kapa')
        .setRequired(true)
        .addChoices(
          { name: 'Aç', value: 'ac' },
          { name: 'Kapat', value: 'kapat' }
        ))
    .addStringOption(option =>
      option.setName('komut')
        .setDescription('Durumunu değiştirmek istediğin komut')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const durum = interaction.options.getString('durum');
    const komut = interaction.options.getString('komut').toLowerCase();

    const data = getStatus();
    if (!data[interaction.guild.id]) data[interaction.guild.id] = {};

    if (durum === 'kapat') {
      data[interaction.guild.id][komut] = false;
      setStatus(data);
      return interaction.reply(`❌ **${komut}** komutu sunucuda kapatıldı.`);
    } else {
      data[interaction.guild.id][komut] = true;
      setStatus(data);
      return interaction.reply(`✅ **${komut}** komutu sunucuda açıldı.`);
    }
  }
};
