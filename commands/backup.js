import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import fs from 'fs';
import path from 'path';

const backupFilePath = path.join(process.cwd(), 'server_backup.json');

export default {
  data: new SlashCommandBuilder()
    .setName('backup')
    .setDescription('Sunucu yedeği alır veya yükler.')
    .addStringOption(option => option
      .setName('action')
      .setDescription('backup al veya yükle')
      .setRequired(true)
      .addChoices(
        { name: 'al', value: 'save' },
        { name: 'yükle', value: 'load' },
      ))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const action = interaction.options.getString('action');
    const guild = interaction.guild;

    if (action === 'save') {
      try {
        const backupData = {
          roles: guild.roles.cache.filter(r => !r.managed && r.id !== guild.id).map(r => ({
            name: r.name,
            color: r.color,
            hoist: r.hoist,
            permissions: r.permissions.bitfield.toString(),
            position: r.position,
            mentionable: r.mentionable
          })),
          channels: guild.channels.cache
            .filter(c => c.type === 0 || c.type === 2) // text ve voice kanallar
            .map(c => ({
              name: c.name,
              type: c.type,
              parentId: c.parentId,
              position: c.position,
              nsfw: c.nsfw || false,
              bitrate: c.bitrate || null,
              userLimit: c.userLimit || null,
              topic: c.topic || null,
              rateLimitPerUser: c.rateLimitPerUser || null
            }))
        };

        fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));
        await interaction.reply('✅ Sunucu yedeği başarıyla alındı.');
      } catch (error) {
        console.error(error);
        await interaction.reply('❌ Yedekleme sırasında hata oluştu.');
      }
    } else if (action === 'load') {
      try {
        if (!fs.existsSync(backupFilePath)) {
          return interaction.reply('❌ Yedek dosyası bulunamadı.');
        }

        const backupData = JSON.parse(fs.readFileSync(backupFilePath));

        // Rolleri yükle
        for (const roleData of backupData.roles) {
          if (guild.roles.cache.find(r => r.name === roleData.name)) continue;

          await guild.roles.create({
            name: roleData.name,
            color: roleData.color,
            hoist: roleData.hoist,
            permissions: BigInt(roleData.permissions),
            mentionable: roleData.mentionable
          }).catch(console.error);
        }

        // Kanalları yükle
        for (const chData of backupData.channels) {
          if (guild.channels.cache.find(c => c.name === chData.name && c.type === chData.type)) continue;

          await guild.channels.create({
            name: chData.name,
            type: chData.type,
            parentId: chData.parentId || null,
            position: chData.position,
            nsfw: chData.nsfw,
            bitrate: chData.bitrate,
            userLimit: chData.userLimit,
            topic: chData.topic,
            rateLimitPerUser: chData.rateLimitPerUser,
          }).catch(console.error);
        }

        await interaction.reply('✅ Yedek başarıyla yüklendi.');
      } catch (error) {
        console.error(error);
        await interaction.reply('❌ Yedek yükleme sırasında hata oluştu.');
      }
    }
  }
};
