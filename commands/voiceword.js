import { SlashCommandBuilder } from 'discord.js';

const activeGames = new Map();

export default {
  data: new SlashCommandBuilder()
    .setName('voiceword')
    .setDescription('Sesli kanalda kelime oyunu başlatır.'),

  async execute(interaction) {
    const member = interaction.member;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) return interaction.reply({ content: 'Sesli kanalda olmalısın.', ephemeral: true });

    if (activeGames.has(voiceChannel.id)) {
      return interaction.reply({ content: 'Bu sesli kanalda zaten bir oyun aktif.', ephemeral: true });
    }

    await interaction.reply('🎮 Kelime oyunu başladı! Sırayla yeni kelime söyleyin.');

    let lastWord = '';
    activeGames.set(voiceChannel.id, { lastWord });

    const filter = m => m.member.voice.channelId === voiceChannel.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 5 * 60 * 1000 });

    collector.on('collect', m => {
      const word = m.content.toLowerCase();

      if (lastWord && word[0] !== lastWord.slice(-1)) {
        m.reply(`❌ Kelime önceki kelimenin son harfiyle başlamalı! Son kelime: **${lastWord}**`);
        return;
      }

      lastWord = word;
      activeGames.get(voiceChannel.id).lastWord = word;
      m.react('✅');
    });

    collector.on('end', () => {
      activeGames.delete(voiceChannel.id);
      interaction.followUp('Oyun bitti! Teşekkürler oynadığınız için.');
    });
  }
};
