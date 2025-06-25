import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Bir kullanıcının avatarını gösterir.')
    .addUserOption(option =>
      option.setName('kullanici')
        .setDescription('Avatarı gösterilecek kullanıcı')
        .setRequired(false)
    ),

  async execute(interaction) {
    const kullanici = interaction.options.getUser('kullanici') || interaction.user;

    const embed = new EmbedBuilder()
      .setTitle(`${kullanici.tag} kullanıcısının avatarı`)
      .setImage(kullanici.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setColor('Random');

    await interaction.reply({ embeds: [embed] });
  },
};

