import { Events } from 'discord.js';

export default {
  name: Events.ChannelDelete,
  async execute(channel, client) {
    try {
      const guild = channel.guild;
      const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'CHANNEL_DELETE' });
      const logEntry = fetchedLogs.entries.first();
      if (!logEntry) return;

      const { executor } = logEntry;

      const logChannel = guild.channels.cache.get(client.guardLogChannelId);
      if (!logChannel) return;

      logChannel.send(`❌ Kanal silindi: **${channel.name}**  
Yapan: **${executor.tag}**`);
    } catch (error) {
      console.error('Channel delete log hatası:', error);
    }
  }
};
