import { Events, AuditLogEvent } from 'discord.js';

export default {
  name: Events.GuildRoleDelete,
  async execute(role, client) {
    try {
      const guild = role.guild;
      const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleDelete });
      const logEntry = fetchedLogs.entries.first();
      if (!logEntry) return;

      const { executor } = logEntry;

      const logChannel = guild.channels.cache.get(client.guardLogChannelId);
      if (!logChannel) return;

      logChannel.send(`❌ Rol silindi: **${role.name}**  
Yapan: **${executor.tag}**`);
    } catch (error) {
      console.error('Role delete log hatası:', error);
    }
  }
};
