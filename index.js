import { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

console.log('TOKEN:', process.env.TOKEN ? 'Var' : 'Yok');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Var' : 'Yok');
console.log('Çalışma dizini:', process.cwd());
console.log("✅ .env'den gelen GUARD_LOG_CHANNEL_ID:", process.env.GUARD_LOG_CHANNEL_ID || 'Yok');

import { fileURLToPath } from 'url';
import { afkMap } from './commands/afk.js';
import zamanSystem from './zamanSystem.js';  // Ekledik

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const statusFile = path.join(__dirname, 'status.json');
const commandStatusFile = path.join(__dirname, 'commandStatus.json');
const energyFile = path.join(__dirname, 'energy.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User],
});

client.commands = new Collection();
client.guardLogChannelId = process.env.GUARD_LOG_CHANNEL_ID;

// --- ENERGY SYSTEM OBJESİ ---
const energySystem = {
  readData() {
    if (!fs.existsSync(energyFile)) return {};
    try {
      return JSON.parse(fs.readFileSync(energyFile, 'utf-8'));
    } catch {
      return {};
    }
  },
  writeData(data) {
    fs.writeFileSync(energyFile, JSON.stringify(data, null, 2));
  },
  getUserEnergy(userId) {
    const data = this.readData();
    if (!data[userId]) {
      data[userId] = { energy: 10, lastUpdate: Date.now() };
      this.writeData(data);
    }
    return data[userId];
  },
  refreshUserEnergy(userId) {
    const data = this.readData();
    const maxEnergy = 10;

    if (!data[userId]) {
      data[userId] = { energy: maxEnergy, lastUpdate: Date.now() };
      this.writeData(data);
      return data[userId];
    }

    const now = Date.now();
    const elapsed = now - data[userId].lastUpdate;

    // 1 saat = 1 enerji doluyor
    const energyToAdd = Math.floor(elapsed / (60 * 60 * 1000));

    if (energyToAdd > 0) {
      data[userId].energy = Math.min(maxEnergy, data[userId].energy + energyToAdd);
      data[userId].lastUpdate = now;
      this.writeData(data);
    }

    return data[userId];
  },
  consumeEnergy(userId) {
    const data = this.readData();
    if (!data[userId]) return false;
    if (data[userId].energy <= 0) return false;
    data[userId].energy -= 1;
    data[userId].lastUpdate = Date.now();
    this.writeData(data);
    return true;
  },
};

client.energySystem = energySystem;

function getCommandStatus() {
  if (!fs.existsSync(commandStatusFile)) return {};
  try {
    return JSON.parse(fs.readFileSync(commandStatusFile, 'utf-8'));
  } catch {
    return {};
  }
}

function isCommandEnabled(guildId, commandName) {
  if (!guildId) return true; // DM için açık olsun
  const data = getCommandStatus();
  if (!data[guildId]) return true;
  if (data[guildId][commandName] === undefined) return true;
  return data[guildId][commandName];
}

// Mesaj geldiğinde zamanSystem parça ekle
client.on('messageCreate', message => {
  if (message.author.bot) return;
  zamanSystem.addParca(message.author.id, 1);
});

// Botun ana döngüsü
(async () => {
  // Komutları yükle
  const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    const commandModule = await import(`./commands/${file}`);
    const command = commandModule.default || commandModule;

    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
    } else {
      console.warn(`[⚠️ UYARI] ${file} dosyasında 'data' veya 'execute' eksik.`);
    }
  }

  // Eventleri yükle
  const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(f => f.endsWith('.js'));
  for (const file of eventFiles) {
    const eventModule = await import(`./events/${file}`);
    const event = eventModule.default || eventModule;

    console.log(`Event yüklendi: ${event.name}`);

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  if (!process.env.TOKEN) {
    console.error('⚠️ TOKEN ENV DEĞERİ BULUNAMADI! .env dosyanı kontrol et.');
    process.exit(1);
  }

  await client.login(process.env.TOKEN);
})();

client.once('ready', () => {
  console.log(`${client.user.tag} olarak giriş yapıldı!`);

  if (fs.existsSync(statusFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(statusFile, 'utf-8'));
      client.user.setActivity(data.message, { type: data.type });
      console.log('Kalıcı status yüklendi:', data);
    } catch (err) {
      console.error('Status yüklenirken hata:', err);
    }
  }
});

// AFK kontrolü
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  message.mentions.users.forEach(user => {
    if (afkMap.has(user.id)) {
      const afkData = afkMap.get(user.id);
      message.channel.send(`🔔 ${user.tag} şu an AFK. Sebep: **${afkData.sebep}**`);
    }
  });

  if (afkMap.has(message.author.id)) {
    afkMap.delete(message.author.id);
    message.channel.send(`✅ ${message.author.tag}, AFK modundan çıktın.`);
  }
});

// Slash komutları çalıştır
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  console.log(`Komut geldi: ${interaction.commandName}`);

  // Komut sunucuda kapalı mı kontrol et
  if (!isCommandEnabled(interaction.guildId, interaction.commandName)) {
    return interaction.reply({ content: '⚠️ Bu komut bu sunucuda kapalıdır.', ephemeral: true });
  }

  // Enerji yenile ve kontrol et
  if (interaction.user) {
    energySystem.refreshUserEnergy(interaction.user.id);

    const userEnergyData = energySystem.getUserEnergy(interaction.user.id);
    if (userEnergyData.energy <= 0) {
      return interaction.reply({ content: '⚠️ Enerjin bitti. Lütfen biraz bekle veya daha sonra tekrar dene.', ephemeral: true });
    }

    energySystem.consumeEnergy(interaction.user.id);
  }

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.log(`Komut bulunamadı: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error('Komut çalıştırılırken hata:', error);

    const logChannel = client.channels.cache.get(client.guardLogChannelId);
    if (logChannel) {
      const errorEmbed = new EmbedBuilder()
        .setTitle('⚠️ Komut Hatası')
        .addFields(
          { name: 'Komut', value: interaction.commandName, inline: true },
          { name: 'Kullanıcı', value: interaction.user.tag, inline: true },
          { name: 'Hata Mesajı', value: `\`\`\`${error.message}\`\`\`` }
        )
        .setColor('Red')
        .setTimestamp();
      logChannel.send({ embeds: [errorEmbed] });
    }

    const reply = { content: 'Komut çalıştırılırken bir hata oluştu, yetkililere bildirildi.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.editReply(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});
