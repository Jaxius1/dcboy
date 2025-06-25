export default {
  name: 'messageDelete',
  async execute(message) {
    if (message.partial || message.author?.bot) return;

    message.client.snipe = {
      içerik: message.content,
      yazar: message.author.tag,
      kanal: message.channel.name,
      zaman: new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' }),
    };
  },
};
