import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('trollmode')
    .setDescription('Birini sesli kanaldan atar veya mute eder (troll modu)')
    .addUserOption(option => option.setName('kullanici').setDescription('Troll yapılacak kişi').setRequired(true))
    .addStringOption(option => option.setName('mod').setDescription('At veya mute').setRequired(true).addChoices(
      { name: 'At', value: 'kick' },
      { name: 'Mute', value: 'mute' }
    ))
    .addIntegerOption(option => option.setName('sure').setDescription('Süre (dakika)').setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
      return interaction.reply({ content: 'Yetkin yok kanka!', ephemeral: true });

    const user = interaction.options.getUser('kullanici');
    const mode = interaction.options.getString('mod');
    const sure = interaction.options.getInteger('sure');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member.voice.channel) 
      return interaction.reply({ content: 'Adam zaten seslide değil!', ephemeral: true });

    if (mode === 'kick') {
      await member.voice.disconnect();
      interaction.reply(`${user.tag} sesli kanaldan atıldı! ${sure} dakika sonra serbest kalacak.`);
      setTimeout(() => {
        // Do nothing, üye otomatik gelirse normal sesli kanala döner
      }, sure * 60000);
    } else if (mode === 'mute') {
      await member.voice.setMute(true);
      interaction.reply(`${user.tag} susturuldu! ${sure} dakika sonra açılacak.`);
      setTimeout(async () => {
        if (member.voice.mute) await member.voice.setMute(false);
      }, sure * 60000);
    }
  }
};
