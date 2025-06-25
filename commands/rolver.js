// rolver.js
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('rolver')
    .setDescription('Bir üyeye rol verir.')
    .addUserOption(option =>
      option.setName('kullanici')
        .setDescription('Rol verilecek kullanıcı')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('rol')
        .setDescription('Verilecek rol')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const kullanici = interaction.options.getMember('kullanici');
    const rol = interaction.options.getRole('rol');

    if (!kullanici) return interaction.reply({ content: 'Kullanıcı bulunamadı.', ephemeral: true });
    if (!rol) return interaction.reply({ content: 'Rol bulunamadı.', ephemeral: true });

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({ content: 'Rol vermek için yeterli yetkim yok.', ephemeral: true });
    }
    if (rol.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({ content: 'Bu rolü veremem, çünkü benim rolüm daha düşük.', ephemeral: true });
    }

    try {
      await kullanici.roles.add(rol);
      await interaction.reply({ content: `${kullanici.user.tag} kullanıcısına ${rol.name} rolü verildi.` });
    } catch (error) {
      await interaction.reply({ content: 'Rol verilirken bir hata oluştu.', ephemeral: true });
    }
  }
};
