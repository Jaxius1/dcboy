import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  data: new SlashCommandBuilder()
    .setName('atatürk')
    .setDescription('Atatürk resmi gönderir'),

  async execute(interaction) {
    // Resim dosya yolları (birden fazla resim koyabilirsin)
    const images = [
      path.join(__dirname, '../../Yeni klasör (2)/atatürk1.jpg'),
      path.join(__dirname, '../../Yeni klasör (2)/atatürk2.jpg'),
      path.join(__dirname, '../../Yeni klasör (2)/atatürk3.jpg'),
    ];

    // Rastgele bir resim seç
    const randomImagePath = images[Math.floor(Math.random() * images.length)];

    // Attachment oluştur
    const attachment = new AttachmentBuilder(randomImagePath);

    // Dosya olarak gönder (link değil, resim chatte direkt görünür)
    await interaction.reply({ files: [attachment] });
  },
};
