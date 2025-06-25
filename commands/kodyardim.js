import { SlashCommandBuilder } from 'discord.js';

const kodlar = {
  döngü: `for(let i=0; i<5; i++) {
  console.log(i);
}`,
  fonksiyon: `function selamla() {
  console.log('Naber kanka!');
}`,
  koşul: `if (x > 10) {
  console.log('Büyük');
} else {
  console.log('Küçük');
}`,
};

export default {
  data: new SlashCommandBuilder()
    .setName('kodyardım')
    .setDescription('Basit kod örnekleri veririm.')
    .addStringOption(option =>
      option.setName('konu')
        .setDescription('Örnek istediğin konu')
        .setRequired(true)
        .addChoices(
          { name: 'Döngü', value: 'döngü' },
          { name: 'Fonksiyon', value: 'fonksiyon' },
          { name: 'Koşul', value: 'koşul' },
        )),
  
  async execute(interaction) {
    const konu = interaction.options.getString('konu');
    const kod = kodlar[konu];

    if (!kod) {
      await interaction.reply({ content: 'Böyle bir konu yok, kardeşim.', ephemeral: true });
      return;
    }

    await interaction.reply({ content: `\`\`\`js\n${kod}\n\`\`\`` });
  },
};
