import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('rollcall')
    .setDescription('Sesli kanaldaki üyelerin konuşma sürelerini gösterir'),

  async execute(interaction, client) {
    if (!interaction.member.voice.channel) 
      return interaction.reply({ content: 'Önce sesli kanala gir lan!', ephemeral: true });

    const channel = interaction.member.voice.channel;
    const members = channel.members;

    // Burada sadece basit üyeleri listeliyoruz, detaylı konuşma süresi için dış API veya botun kendi datalarını tutması lazım.
    let replyMsg = `🎤 Sesli Kanal Raporu - ${channel.name}:\n`;
    members.forEach(member => {
      replyMsg += `- ${member.user.tag}\n`;
    });

    interaction.reply(replyMsg);
  }
};
