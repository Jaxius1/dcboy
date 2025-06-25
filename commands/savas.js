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
    .setName('savas')
    .setDescription('Bir kullanıcıya savaş açarsın!')
    .addUserOption(option =>
      option.setName('hedef')
        .setDescription('Savaşacağın kullanıcı')
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const target = interaction.options.getUser('hedef');

    if (target.bot) {
      return interaction.reply({ content: '🤖 Botlarla savaşamazsın, ezik misin?' });
    }

    if (target.id === userId) {
      return interaction.reply({ content: '💀 Kendinle savaşamazsın dostum, o kadar da yalnız değilsin.' });
    }

    const data = readKarakterData();
    const userChar = data[userId];
    const targetChar = data[target.id];

    if (!userChar || !targetChar) {
      return interaction.reply({
        content: '❌ Her iki kullanıcının da karakteri olmalı. `/karakter-olustur` komutu ile oluşturabilirsiniz.',
        ephemeral: true,
      });
    }

    // Rastgele hesaplama formülü
    const userPower = userChar.güç + userChar.zeka + userChar.çeviklik + Math.floor(Math.random() * 10);
    const targetPower = targetChar.güç + targetChar.zeka + targetChar.çeviklik + Math.floor(Math.random() * 10);

    let winner, loser, winnerPower, loserPower;

    if (userPower > targetPower) {
      winner = interaction.user;
      loser = target;
      winnerPower = userPower;
      loserPower = targetPower;
    } else if (userPower < targetPower) {
      winner = target;
      loser = interaction.user;
      winnerPower = targetPower;
      loserPower = userPower;
    } else {
      return interaction.reply('🤝 Berabere! İki taraf da eşit güçteydi.');
    }

    await interaction.reply({
      content: `⚔️ **${interaction.user.username}** VS **${target.username}** ⚔️\n\n` +
        `🏆 Kazanan: **${winner.username}**\n` +
        `💪 Güç Skoru: ${winnerPower} vs ${loserPower}`,
    });
  },
};
