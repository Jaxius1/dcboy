import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Komutlar sıfırlanıyor...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: [] },
    );
    console.log('🧹 Komutlar silindi!');

    const commands = [
      {
        name: 'ping',
        description: 'Botun çalışıp çalışmadığını kontrol eder.',
      },
    ];

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );

    console.log('✅ Basit komut yüklendi. Discord’da `/ping` komutunu görebiliyor musun?');
  } catch (error) {
    console.error(error);
  }
})();
