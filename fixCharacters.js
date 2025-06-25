import fs from 'fs';
const karakterFile = 'karakterData.json';

const raw = fs.readFileSync(karakterFile, 'utf8');
const data = JSON.parse(raw);

for (const userId in data) {
  const char = data[userId];

  if (!char.gold) char.gold = 100;

  if (!char.stats) {
    char.stats = {
      strength: 5,
      agility: 5,
      intelligence: 5
    };
  } else {
    if (!char.stats.strength) char.stats.strength = 5;
    if (!char.stats.agility) char.stats.agility = 5;
    if (!char.stats.intelligence) char.stats.intelligence = 5;
  }

  if (!char.inventory) char.inventory = [];
  if (!char.tasksCompleted) char.tasksCompleted = [];
}

fs.writeFileSync(karakterFile, JSON.stringify(data, null, 2));
console.log('Karakter dosyası eksikleri düzeltildi!');
