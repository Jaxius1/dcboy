// rolbilgi.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('rolbilgi')
    .setDescription('Bir rol hakkında bilgi verir.')
    .addRoleOption(option =>
      option.setName('rol')
        .setDescription('Bilgi almak istediğin rolü seç')
        .setRequired(true)),

  async execute(interaction) {
    const role = interaction.options.getRole('rol');
    if (!role) {
      return interaction.reply({ content: '⚠️ Rol bulunamadı!', ephemeral: true });
    }

    const membersCount = role.members.size;
    const roleColor = role.color === 0 ? 'Renk Yok' : role.hexColor;

    const embed = new EmbedBuilder()
      .setTitle(`Rol Bilgisi: ${role.name}`)
      .addFields(
        { name: 'Rol ID', value: role.id, inline: true },
        { name: 'Üye Sayısı', value: `${membersCount}`, inline: true },
        { name: 'Rol Rengi', value: roleColor, inline: true }
      )
      .setColor(role.color || 'Random');

    await interaction.reply({ embeds: [embed] });
  },
};
