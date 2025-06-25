import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { afkMap } from '../commands/afk.js'; // doğru path'e dikkat et!

export default {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Bir üyenin profilini gösterir.')
    .addUserOption(option => option.setName('user').setDescription('Profilini görmek istediğin kullanıcı').setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) return interaction.reply({ content: 'Kullanıcı sunucuda bulunamadı.', ephemeral: true });

    const roles = member.roles.cache
      .filter(role => role.id !== interaction.guild.id)
      .map(role => role.toString())
      .join(', ') || 'Rol yok';

    // Uyarı sayısı burada basit örnek, sen bunu kendi sistemine göre düzenlersin
    const warnings = 0; 

    const afkData = afkMap.get(user.id);
    const afkStatus = afkData ? `AFK: ${afkData.sebep}` : 'AFK değil';

    const embed = new EmbedBuilder()
      .setTitle(`${user.tag} - Profil`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'Roller', value: roles, inline: false },
        { name: 'Uyarı Sayısı', value: warnings.toString(), inline: true },
        { name: 'AFK Durumu', value: afkStatus, inline: true },
        { name: 'Sunucuya Katılım', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: 'Hesap Oluşturma', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
      )
      .setColor('Blurple')
      .setFooter({ text: 'Developer Jaxius' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};

