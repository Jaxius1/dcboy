import { Events } from 'discord.js';

export default {
  name: Events.GuildBanAdd,
  async execute(ban, client) {
    try {
      const { guild, user } = ban;
      const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_BAN_ADD' });
      const banLog = fetchedLogs.entries.first();

      if (!banLog) return;
      const { executor, target, reason } = banLog;

      // Log kanalı
      const logChannel = guild.channels.cache.get(client.guardLogChannelId);
      if (!logChannel) return;

      logChannel.send(`🚫 **${user.tag}** banlandı!  
Banlayan: **${executor.tag}**  
Sebep: **${reason || "Sebep belirtilmedi"}**`);
    } catch (error) {
      console.error('Ban log hatası:', error);
    }
  }
};
