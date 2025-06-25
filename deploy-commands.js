import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  try {
    const commandModule = await import(`./commands/${file}`);
    const command = commandModule.default;
    if (command.data && command.execute) {
      commands.push(command.data.toJSON());
    } else {
      console.warn(`[⚠️ UYARI] ${file} dosyasında 'data' veya 'execute' eksik. Bu komut atlandı.`);
    }
  } catch (error) {
    console.error(`[❌ HATA] '${file}' dosyası yüklenirken hata oluştu:`, error.message);
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('📤 Komutlar deploy ediliyor...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('✅ Komutlar başarıyla yüklendi!');
  } catch (error) {
    console.error('❌ Deploy sırasında hata:', error.message);
  }
})();
