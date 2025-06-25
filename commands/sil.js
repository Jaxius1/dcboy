// sil.js
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('sil')
    .setDescription('Belirtilen miktarda mesaj siler.')
    .addIntegerOption(option =>
      option.setName('miktar')
        .setDescription('Silinecek mesaj sayısı (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const miktar = interaction.options.getInteger('miktar');
    try {
      const deleted = await interaction.channel.bulkDelete(miktar, true);
      await interaction.reply({ content: `✅ Başarıyla ${deleted.size} mesaj silindi.`, ephemeral: true });
    } catch (error) {
      await interaction.reply({ content: '❌ Mesajlar silinirken bir hata oluştu.', ephemeral: true });
      console.error(error);
    }
  }
};
