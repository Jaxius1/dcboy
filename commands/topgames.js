import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('topgames')
    .setDescription('Sunucuda en çok oynanan oyunları listeler'),

  async execute(interaction) {
    const guild = interaction.guild;
    await guild.members.fetch(); // tüm üyeleri cache'le

    const gameCount = {};

    guild.members.cache.forEach(member => {
      const game = member.presence?.activities.find(act => act.type === 0); // 0 = Oynuyor (PLAYING)
      if (game) {
        const name = game.name;
        if (gameCount[name]) gameCount[name]++;
        else gameCount[name] = 1;
      }
    });

    const sortedGames = Object.entries(gameCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // en çok 10 oyun

    if (sortedGames.length === 0) {
      return interaction.reply('Sunucuda aktif oynayan kimse yok veya oyun durumu yok.');
    }

    const embed = new EmbedBuilder()
      .setTitle(`${guild.name} - En Çok Oynanan Oyunlar`)
      .setColor('Green')
      .setFooter({ text: 'Developer Jaxius' })
      .setTimestamp();

    sortedGames.forEach(([name, count]) => {
      embed.addFields({ name: name, value: `🎮 ${count} kişi`, inline: true });
    });

    await interaction.reply({ embeds: [embed] });
  },
};
