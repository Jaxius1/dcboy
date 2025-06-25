import { SlashCommandBuilder } from 'discord.js';

export const afkMap = new Map(); // KişiID => { sebep, zaman }

export default {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('AFK moduna geçersin ve sebepten dolayı otomatik uyarı verir.')
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('AFK sebebin')
        .setRequired(false)
    ),

  async execute(interaction) {
    const sebep = interaction.options.getString('sebep') || 'Belirtilmedi';
    afkMap.set(interaction.user.id, { sebep, zaman: Date.now() });

    await interaction.reply({
      content: `🛌 ${interaction.user.tag}, AFK moduna geçtin. Sebep: **${sebep}**`,
      ephemeral: true,
    });
  },
};

