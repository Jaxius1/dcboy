import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('stat')
    .setDescription('Sunucu istatistiklerini gösterir.'),

  async execute(interaction) {
    const guild = interaction.guild;

    // Toplam üye sayısı
    const totalMembers = guild.memberCount;

    // Çevrimiçi üyeler (online, dnd, idle)
    const onlineMembers = guild.members.cache.filter(
      member => member.presence?.status === 'online' || member.presence?.status === 'dnd' || member.presence?.status === 'idle'
    ).size;

    // Son 7 gün katılanlar
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const newMembers = guild.members.cache.filter(member => member.joinedTimestamp > weekAgo).size;

    const embed = new EmbedBuilder()
      .setTitle(`${guild.name} Sunucu İstatistikleri`)
      .addFields(
        { name: 'Toplam Üye', value: `${totalMembers}`, inline: true },
        { name: 'Çevrimiçi Üye', value: `${onlineMembers}`, inline: true },
        { name: 'Son 7 Gün Katılanlar', value: `${newMembers}`, inline: true },
      )
      .setColor('Blurple')
      .setFooter({ text: 'Developer: Jaxius' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

