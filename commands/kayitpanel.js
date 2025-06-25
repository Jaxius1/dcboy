// commands/kayitpanel.js
import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kayitpanel')
    .setDescription('Kayıt panelini gönderir.'),

  async execute(interaction) {
    const buton = new ButtonBuilder()
      .setCustomId('kayıtol')
      .setLabel('🎫 Kayıt Ol')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(buton);

    // interaction.reply yerine FOLLOWUP kullan (çünkü interaction zaten işlenmiş olabilir)
    try {
      await interaction.reply({
        content: 'Aşağıdaki butona basarak kayıt olabilirsin!',
        components: [row],
        ephemeral: false // Genel sohbete gönderilecek
      });
    } catch (err) {
      console.error('Kayıt paneli gönderilirken hata:', err);
    }
  }
};
