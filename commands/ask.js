import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Birinin aşk yüzdesini ölçer.')
    .addUserOption(option =>
      option.setName('hedef')
        .setDescription('Aşkını ölçmek istediğin kişiyi seç')
        .setRequired(true)
    ),

  async execute(interaction) {
    const hedef = interaction.options.getUser('hedef');
    const user = interaction.user;

    if (hedef.id === user.id) {
      return interaction.reply({
        content: 'Kanka, kendinle aşk ölçemezsin amına kodumun salağı',
        ephemeral: true,
      });
    }

    const yuzde = Math.floor(Math.random() * 101);
    await interaction.reply(`${user.username} ❤️ ${hedef.username} arasında aşk yüzdesi: **%${yuzde}**`);
  },
};

