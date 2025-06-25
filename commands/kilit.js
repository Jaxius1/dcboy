import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kilit')
    .setDescription('Bu kanalı kilitler veya kilidi açar.')
    .addStringOption(option =>
      option.setName('işlem')
        .setDescription('Kilit aç veya kapat')
        .setRequired(true)
        .addChoices(
          { name: 'aç', value: 'ac' },
          { name: 'kapat', value: 'kapat' }
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const işlem = interaction.options.getString('işlem');
    const kanal = interaction.channel;

    try {
      if (işlem === 'kapat') {
        await kanal.permissionOverwrites.edit(kanal.guild.roles.everyone, { SendMessages: false });
        await interaction.reply({ content: '🔒 Kanal kilitlendi.', ephemeral: true });
      } else if (işlem === 'ac') {
        await kanal.permissionOverwrites.edit(kanal.guild.roles.everyone, { SendMessages: true });
        await interaction.reply({ content: '🔓 Kanal kilidi açıldı.', ephemeral: true });
      } else {
        await interaction.reply({ content: '❌ Geçersiz işlem seçildi.', ephemeral: true });
      }
    } catch (error) {
      await interaction.reply({ content: '❌ Kanal kilitlenirken hata oluştu.', ephemeral: true });
      console.error(error);
    }
  }
};
