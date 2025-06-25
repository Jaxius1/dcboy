import { Events } from 'discord.js';

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`${client.user.tag} olarak giriş yapıldı!`);

    // .env'den GUARD_LOG_CHANNEL_ID kontrolü
    const logChannelId = process.env.GUARD_LOG_CHANNEL_ID;
    if (!logChannelId) {
      console.warn('❌ GUARD_LOG_CHANNEL_ID tanımlanmamış veya .env dosyası okunamıyor!');
    } else {
      console.log(`✅ Log kanalı ID: ${logChannelId}`);
    }

    // Invite sistemi kaldırıldı, başka bişey yapmıyor.
  },
};
