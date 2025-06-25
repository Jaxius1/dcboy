import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('oylama')
    .setDescription('Bir oylama başlatır, 2 seçenekle.')
    .addStringOption(option =>
      option.setName('soru')
        .setDescription('Oylama sorusu')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('seçenek1')
        .setDescription('Birinci seçenek (örn: Evet)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('seçenek2')
        .setDescription('İkinci seçenek (örn: Hayır)')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('süre')
        .setDescription('Oylama süresi saniye olarak (max 300)')
        .setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({ content: 'Bu komutu kullanmak için yetkin yok.', ephemeral: true });
    }

    const soru = interaction.options.getString('soru');
    const secenek1 = interaction.options.getString('seçenek1');
    const secenek2 = interaction.options.getString('seçenek2');
    let sure = interaction.options.getInteger('süre');

    if (sure > 300) sure = 300;
    if (sure < 5) sure = 5;

    await interaction.deferReply();

    const embed = new EmbedBuilder()
      .setTitle('📊 Oylama Başladı!')
      .setDescription(soru)
      .addFields(
        { name: 'Seçenek 1', value: secenek1, inline: true },
        { name: 'Seçenek 2', value: secenek2, inline: true }
      )
      .setColor('Blue')
      .setFooter({ text: `Oylama süresi: ${sure} saniye` });

    const mesaj = await interaction.editReply({ embeds: [embed] });

    await mesaj.react('1️⃣');
    await mesaj.react('2️⃣');

    setTimeout(async () => {
      try {
        const mesajGuncel = await interaction.channel.messages.fetch(mesaj.id);
        const oy1 = mesajGuncel.reactions.cache.get('1️⃣')?.count - 1 || 0;
        const oy2 = mesajGuncel.reactions.cache.get('2️⃣')?.count - 1 || 0;

        const sonucEmbed = new EmbedBuilder()
          .setTitle('📊 Oylama Bitti!')
          .setDescription(soru)
          .addFields(
            { name: secenek1, value: `${oy1} oy`, inline: true },
            { name: secenek2, value: `${oy2} oy`, inline: true }
          )
          .setColor(oy1 > oy2 ? 'Green' : oy2 > oy1 ? 'Red' : 'Grey');

        await interaction.editReply({ embeds: [sonucEmbed] });
      } catch (error) {
        console.error('Oylama sonucu gönderilirken hata:', error);
      }
    }, sure * 1000);
  }
};
