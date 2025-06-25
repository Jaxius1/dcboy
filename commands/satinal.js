import { SlashCommandBuilder } from 'discord.js';
import characterSystem from '../characterSystem.js';

const { getCharacter, spendGold, addItem } = characterSystem;

const marketItems = [
  { name: 'Kılıç', price: 50, description: 'Temel saldırı aracı' },
  { name: 'Kalkan', price: 40, description: 'Savunmanı artırır' },
  { name: 'Büyü Kitabı', price: 60, description: 'Zeka arttırır' },
];

export default {
  data: new SlashCommandBuilder()
    .setName('satinal')
    .setDescription('Marketten eşya satın al')
    .addStringOption(option =>
      option.setName('eşya')
        .setDescription('Satın alınacak eşya')
        .setRequired(true)
        .addChoices(
          { name: 'Kılıç', value: 'Kılıç' },
          { name: 'Kalkan', value: 'Kalkan' },
          { name: 'Büyü Kitabı', value: 'Büyü Kitabı' }
        )
    ),

  async execute(interaction) {
    const itemName = interaction.options.getString('eşya');
    const item = marketItems.find(i => i.name === itemName);

    if (!item) {
      return interaction.reply({ content: 'Böyle bir eşya markette yok.', ephemeral: true });
    }

    const character = getCharacter(interaction.user.id);
    if (!character) return interaction.reply({ content: 'Karakter bulunamadı.', ephemeral: true });

    if (character.gold < item.price) {
      return interaction.reply({ content: 'Yeterli goldun yok!', ephemeral: true });
    }

    const success = spendGold(interaction.user.id, item.price);
    if (!success) {
      return interaction.reply({ content: 'Gold harcanırken hata oluştu.', ephemeral: true });
    }

    addItem(interaction.user.id, { name: item.name, description: item.description });

    await interaction.reply(`Başarıyla **${item.name}** satın aldın!`);
  }
};


