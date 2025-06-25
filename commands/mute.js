import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Kullanıcıyı mute veya unmute yapar (sesli veya yazılı).')
    .addUserOption(option =>
      option.setName('kullanici')
        .setDescription('Mute/Unmute yapılacak kullanıcı')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('tur')
        .setDescription('Mute türü seç')
        .setRequired(true)
        .addChoices(
          { name: 'Chat Mute (Yazılı)', value: 'chat' },
          { name: 'Ses Mute', value: 'voice' },
          { name: 'Hem Chat Hem Ses Mute', value: 'both' },
          { name: 'Unmute', value: 'unmute' }
        ))
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Mute sebebi')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const kullanici = interaction.options.getMember('kullanici');
    const tur = interaction.options.getString('tur');
    const sebep = interaction.options.getString('sebep') || 'Belirtilmedi';

    if (!kullanici) return interaction.reply({ content: 'Kullanıcı sunucuda bulunamadı.', ephemeral: true });
    if (kullanici.user.id === interaction.user.id) return interaction.reply({ content: 'Kendini muteleyemezsin.', ephemeral: true });
    if (kullanici.user.bot) return interaction.reply({ content: 'Botları muteleyemezsin.', ephemeral: true });

    try {
      if (tur === 'chat') {
        if (kullanici.communicationDisabledUntilTimestamp && kullanici.communicationDisabledUntilTimestamp > Date.now()) {
          return interaction.reply({ content: 'Bu kullanıcı zaten chat mute durumda.', ephemeral: true });
        }
        await kullanici.timeout(10 * 60 * 1000, sebep);
        return interaction.reply({ content: `${kullanici.user.tag} chat mute edildi. Sebep: ${sebep}` });
      } else if (tur === 'voice') {
        if (!kullanici.voice.channel) {
          return interaction.reply({ content: 'Bu kullanıcı şu anda ses kanalında değil.', ephemeral: true });
        }
        if (kullanici.voice.serverMute) {
          return interaction.reply({ content: 'Bu kullanıcı zaten ses mute durumda.', ephemeral: true });
        }
        await kullanici.voice.setMute(true, sebep);
        return interaction.reply({ content: `${kullanici.user.tag} ses mute edildi. Sebep: ${sebep}` });
      } else if (tur === 'both') {
        await kullanici.timeout(10 * 60 * 1000, sebep);
        if (kullanici.voice.channel && !kullanici.voice.serverMute) {
          await kullanici.voice.setMute(true, sebep);
        }
        return interaction.reply({ content: `${kullanici.user.tag} hem chat hem ses mute edildi. Sebep: ${sebep}` });
      } else if (tur === 'unmute') {
        if (kullanici.communicationDisabledUntilTimestamp && kullanici.communicationDisabledUntilTimestamp > Date.now()) {
          await kullanici.timeout(null, sebep);
        }
        if (kullanici.voice.serverMute) {
          await kullanici.voice.setMute(false, sebep);
        }
        return interaction.reply({ content: `${kullanici.user.tag} unmute edildi. Sebep: ${sebep}` });
      } else {
        return interaction.reply({ content: 'Geçersiz mute türü seçildi.', ephemeral: true });
      }
    } catch (error) {
      console.error('Mute Hatası:', error);
      return interaction.reply({ content: 'Mute/Unmute işlemi sırasında hata oluştu.', ephemeral: true });
    }
  }
};
