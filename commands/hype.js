import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('hype')
    .setDescription('Son 50 mesajdaki aktiflik verilerini gösterir.'),

  async execute(interaction) {
    const messages = await interaction.channel.messages.fetch({ limit: 50 });
    const totalMessages = messages.size;

    const users = new Set();
    let emojiCount = 0;

    messages.forEach(msg => {
      users.add(msg.author.id);
      if (/<a?:\w+:\d+>/.test(msg.content)) emojiCount++;
    });

    await interaction.reply({
      content: `🔥 **Sunucu Hype Raporu** 🔥\n\nSon 50 mesaj: **${totalMessages} mesaj**\nAktif kullanıcı sayısı: **${users.size}**\nEmoji kullanımı: **${emojiCount}**`,
      ephemeral: false,
    });
  }
};