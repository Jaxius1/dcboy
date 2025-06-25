// unban.js
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Yasaklı olan bir üyeyi yasağını kaldırır.')
    .addStringOption(option =>
      option.setName('kullaniciid')
        .setDescription('Yasağı kaldırılacak kullanıcının ID\'si')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const userId = interaction.options.getString('kullaniciid');

    try {
      await interaction.guild.bans.remove(userId);
      await interaction.reply({ content: `✅ ${userId} ID'li kullanıcının yasağı kaldırıldı.` });
    } catch (error) {
      console.error('Unban hatası:', error);
      await interaction.reply({ content: '❌ Yasağı kaldırırken hata oluştu ya da böyle bir yasaklı yok.', ephemeral: true });
    }
  }
};
