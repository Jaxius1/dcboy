import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import characterSystem from '../characterSystem.js';

const { getCharacter } = characterSystem;

export default {
  data: new SlashCommandBuilder()
    .setName('karakter')
    .setDescription('Karakter bilgilerinizi gösterir'),

  async execute(interaction) {
    const char = getCharacter(interaction.user.id);
    if (!char) return interaction.reply({ content: 'Karakter bulunamadı!', ephemeral: true });

    // Eksik alanları varsayılanlarla tamamla
    const level = char.level ?? 1;
    const xp = char.xp ?? 0;
    const gold = char.gold ?? 0;

    const stats = char.stats ?? { strength: 0, agility: 0, intelligence: 0 };
    const inventory = Array.isArray(char.inventory) ? char.inventory : [];

    const embed = new EmbedBuilder()
      .setTitle(`${interaction.user.username} Karakteri`)
      .addFields(
        { name: 'Seviye', value: level.toString(), inline: true },
        { name: 'XP', value: `${xp} / 100`, inline: true },
        { name: 'Gold', value: gold.toString(), inline: true },
        { name: 'Güç', value: stats.strength.toString(), inline: true },
        { name: 'Çeviklik', value: stats.agility.toString(), inline: true },
        { name: 'Zeka', value: stats.intelligence.toString(), inline: true },
        { name: 'Envanter', value: inventory.length > 0 ? inventory.map(i => i.name).join(', ') : 'Boş' }
      )
      .setColor('Gold');

    await interaction.reply({ embeds: [embed] });
  }
};

