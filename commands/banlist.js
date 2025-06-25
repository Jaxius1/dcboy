import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('banlist')
    .setDescription('Sunucudaki yasaklı üyeleri listeler.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    try {
      const bans = await interaction.guild.bans.fetch();
      if (!bans.size) return interaction.reply({ content: 'Sunucuda yasaklı kullanıcı yok.', ephemeral: true });

      const banList = bans.map(ban => `${ban.user.tag} (\`${ban.user.id}\`) - Sebep: ${ban.reason || 'Belirtilmedi'}`).join('\n');

      const embed = new EmbedBuilder()
        .setTitle('🚫 Yasaklı Kullanıcılar')
        .setDescription(banList)
        .setColor('Red')
        .setFooter({ text: 'Developer: Jaxius' })
        .setFooter({ text: `Toplam: ${bans.size}` });


      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error('Banlist hatası:', error);
      return interaction.reply({ content: '❌ Yasaklı kullanıcılar listelenirken hata oluştu.', ephemeral: true });
    }
  },
};

