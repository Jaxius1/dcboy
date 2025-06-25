// tasima.js
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('tasima')
    .setDescription('Sesli kanaldaki kişileri başka bir ses kanalına topluca taşır.')
    .addChannelOption(option =>
      option.setName('hedef')
        .setDescription('Taşımak istediğin ses kanalı')
        .setRequired(true)
        .addChannelTypes(2)), // 2 = GUILD_VOICE

  async execute(interaction) {
    const hedefKanal = interaction.options.getChannel('hedef');
    const üye = interaction.member;

    if (!üye.voice.channel) return interaction.reply({ content: 'Önce sesli bir kanalda olmalısın.', ephemeral: true });
    if (hedefKanal.id === üye.voice.channel.id) return interaction.reply({ content: 'Zaten aynı kanaldasınız.', ephemeral: true });

    const üyeler = üye.voice.channel.members;

    if (üyeler.size === 0) return interaction.reply({ content: 'Sesli kanalda kimse yok.', ephemeral: true });

    üyeler.forEach(member => {
      member.voice.setChannel(hedefKanal).catch(() => {});
    });

    interaction.reply({ content: `${üyeler.size} kişi başarıyla ${hedefKanal.name} kanalına taşındı!` });
  }
};
