import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';

const secretsFile = path.join(process.cwd(), 'secrets.json');

function readSecrets() {
  if (!fs.existsSync(secretsFile)) return {};
  try {
    return JSON.parse(fs.readFileSync(secretsFile, 'utf-8'));
  } catch {
    return {};
  }
}

function writeSecrets(data) {
  fs.writeFileSync(secretsFile, JSON.stringify(data, null, 2));
}

export default {
  data: new SlashCommandBuilder()
    .setName('sir')
    .setDescription('Bota özelden sır fısıldarsın, kimse bilmez.')
    .addStringOption(option =>
      option.setName('mesaj')
        .setDescription('Sır mesajını yaz')
        .setRequired(true)),
  
  async execute(interaction) {
    const mesaj = interaction.options.getString('mesaj');
    const userId = interaction.user.id;

    const secrets = readSecrets();

    if (!secrets[userId]) secrets[userId] = [];
    secrets[userId].push(mesaj);

    writeSecrets(secrets);

    await interaction.reply({ content: 'Sır başarıyla saklandı, kanka. İstersen başkasıyla paylaşabilirsin.', ephemeral: true });
  },

  // İstersen lazım olursa sırları getir
  getSecrets(userId) {
    const secrets = readSecrets();
    return secrets[userId] || [];
  },
};
