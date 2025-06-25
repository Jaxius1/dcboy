import autoReplies from '../autoReplies.js';

const ignoredChannels = ['1379475838663266424', '1376945428238434446', '1369760861391949874']; // Link engelleme kapalı olan kanallar
const dmLogChannelId = '1386791760134537452'; // DM loglarının düşeceği kanalın ID'si

export default {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    // --- DM LOG & CEVAP ---
    if (message.channel.type === 1) { // 1 = DM
      const logChannel = client.channels.cache.get(dmLogChannelId);
      if (logChannel) {
        const embed = {
          color: 0x3498db,
          author: {
            name: message.author.tag,
            icon_url: message.author.displayAvatarURL(),
          },
          description: `📩 **DM'den gelen mesaj:**\n\`\`\`\n${message.content}\n\`\`\``,
          footer: { text: `Kullanıcı ID: ${message.author.id}` },
          timestamp: new Date()
        };

        await logChannel.send({ embeds: [embed] }).catch(console.error);
      }

      // Bonus: Otomatik DM cevabı
      try {
        await message.reply('Mesajın alındı kardeşim, yetkililere iletildi ✅');
      } catch (e) {
        console.log('DM yanıtı atılamadı:', e);
      }

      return; // DM ise geri kalan kurallar çalışmasın
    }

    const msg = message.content.toLowerCase();

    // --- Otomatik Cevaplar ---
    for (const trigger in autoReplies) {
      if (msg.includes(trigger)) {
        await message.channel.send(autoReplies[trigger]);
        return;
      }
    }

    // --- LINK ENGELLEME ---
    if (!ignoredChannels.includes(message.channel.id)) {
      const linkRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
      if (linkRegex.test(message.content)) {
        try {
          await message.delete();
          const warnMsg = await message.channel.send(`${message.author}, link paylaşmak yasak oe!`);
          setTimeout(() => warnMsg.delete().catch(() => {}), 5000);
        } catch (e) {
          console.log('Link silinirken hata:', e);
        }
        return;
      }
    }

    // --- SPAM KORUMASI ---
    if (!client.spamMap) client.spamMap = new Map();
    const userId = message.author.id;
    const now = Date.now();

    if (client.spamMap.has(userId)) {
      const lastTime = client.spamMap.get(userId);
      if (now - lastTime < 1000) {
        try {
          await message.delete();
          const warnMsg = await message.channel.send(`${message.author}, spam yapma!`);
          setTimeout(() => warnMsg.delete().catch(() => {}), 4000);
        } catch (e) {
          console.log('Spam mesaj silinirken hata:', e);
        }
        return;
      }
    }

    client.spamMap.set(userId, now);
    setTimeout(() => client.spamMap.delete(userId), 5000);
  }
};

