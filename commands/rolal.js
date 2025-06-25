// rolal.js
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('rolal')
    .setDescription('Bir kullanıcının rolünü alır.')
    .addRoleOption(option =>
      option.setName('rol')
        .setDescription('Alınacak rolü seç')
        .setRequired(true))
    .addUserOption(option =>
      option.setName('kullanici')
        .setDescription('Rolü alınacak kullanıcıyı seç')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const rol = interaction.options.getRole('rol');
    const kullanici = interaction.options.getMember('kullanici');

    if (!kullanici) return interaction.reply({ content: 'Kullanıcı bulunamadı.', ephemeral: true });

    try {
      await kullanici.roles.remove(rol);
      await interaction.reply({ content: `${kullanici.user.tag} kullanıcısından ${rol.name} rolü alındı!` });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Rol alınırken hata oluştu.', ephemeral: true });
    }
  }
};
