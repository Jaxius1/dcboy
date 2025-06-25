import { SlashCommandBuilder } from 'discord.js';
import characterSystem from '../characterSystem.js';

const { getCharacter, addGold, updateXP } = characterSystem;

const tasks = [
  { id: 1, description: '5 mesaj gönder', rewardGold: 20, rewardXP: 15 },
  { id: 2, description: '1 saat aktif kal', rewardGold: 30, rewardXP: 25 },
  { id: 3, description: '3 farklı kanalda mesaj at', rewardGold: 25, rewardXP: 20 },
];

export default {
  data: new SlashCommandBuilder()
    .setName('gorev')
    .setDescription('Günlük görev alır veya görev durumunu görür'),

  async execute(interaction) {
    const char = getCharacter(interaction.user.id);
    if (!char) return interaction.reply({ content: 'Karakter bulunamadı.', ephemeral: true });

    if (!char.tasksCompleted) char.tasksCompleted = [];

    const availableTasks = tasks.filter(t => !char.tasksCompleted.includes(t.id));
    if (availableTasks.length === 0) {
      return interaction.reply('Bugün tamamlanacak görev kalmadı, yarın tekrar dene.');
    }

    const task = availableTasks[0];

    addGold(interaction.user.id, task.rewardGold);
    updateXP(interaction.user.id, task.rewardXP); // ✅ DÜZELTİLDİ

    char.tasksCompleted.push(task.id);

    interaction.reply(`Görev: **${task.description}** tamamlandı! Ödül: ${task.rewardGold} Gold, ${task.rewardXP} XP.`);
  }
};
