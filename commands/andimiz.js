import { SlashCommandBuilder } from 'discord.js';

const andimizMetni = `
Türküm, doğruyum, çalışkanım.

İlkem; küçüklerimi korumak, büyüklerimi saymak,

Yurdumu, milletimi özümden çok sevmektir.

Ülküm; yükselmek, ileri gitmektir.

Ey büyük Atatürk!

Açtığın yolda, gösterdiğin hedefe

Durmadan yürümeye ant içerim.
`;

export default {
  data: new SlashCommandBuilder()
    .setName('andimiz')
    .setDescription('Türkiye Cumhuriyeti Andımız\'ı gösterir'),

  async execute(interaction) {
    await interaction.reply({ content: andimizMetni });
  },
};
