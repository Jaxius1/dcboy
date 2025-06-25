import { Events, AuditLogEvent } from 'discord.js';

export default {
  name: Events.GuildMemberRemove,
  async execute(member, client) {
    try {
      const guild = member.guild;
      const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberKick });
      const logEntry = fetchedLogs.entries.first();
      if (!logEntry) return;

      const { executor } = logEntry;

      const logChannel = guild.channels.cache.get(client.guardLogChannelId);
      if (!logChannel) return;

      logChannel.send(`❌ Üye atıldı: **${member.user.tag}**  
Yapan: **${executor.tag}**`);
    } catch (error) {
      console.error('Kick log hatası:', error);
    }
  }
};
