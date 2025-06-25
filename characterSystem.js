import fs from 'fs';
import path from 'path';

const karakterFile = path.join(process.cwd(), 'karakterData.json');  // doğru dosya yolu

function readData() {
  if (!fs.existsSync(karakterFile)) return {};
  try {
    const raw = fs.readFileSync(karakterFile, 'utf8');
    if (!raw) {
      console.log('Dosya boş');
      return {};
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('JSON parse hatası:', err);
    console.log('Dosya içeriği:', fs.readFileSync(karakterFile, 'utf8'));
    return {};
  }
}

function writeData(data) {
  fs.writeFileSync(karakterFile, JSON.stringify(data, null, 2));
}

function createCharacter(userId, userName) {
  const data = readData();
  if (!data[userId]) {
    const personalityOptions = [
      'komik ve uykucu',
      'zorba ama zeki',
      'kurnaz ve tembel',
      'fazla iyi niyetli',
      'alaycı ve pozitif',
      'kibirli ve zengin',
      'sert ama adaletli'
    ];
    const randomPersonality = personalityOptions[Math.floor(Math.random() * personalityOptions.length)];

    data[userId] = {
      name: userName,
      personality: randomPersonality,
      level: 1,
      xp: 0,
      gold: 0,
      inventory: [],
      traits: [],
      lastActive: Date.now()
    };
    writeData(data);
  }
  return data[userId];
}

function getCharacter(userId) {
  const data = readData();
  if (!data[userId]) return null;

  // lastActive güncelle
  data[userId].lastActive = Date.now();
  writeData(data);

  return data[userId];
}

function updateXP(userId, amount) {
  const data = readData();
  if (!data[userId]) return null;

  data[userId].xp += amount;

  // Level up sistemi: XP 100 geçince level artar, artan XP kalır
  while (data[userId].xp >= 100) {
    data[userId].level++;
    data[userId].xp -= 100;
  }

  writeData(data);
  return data[userId];
}

function changePersonality(userId, newPersonality) {
  const data = readData();
  if (!data[userId]) return null;
  data[userId].personality = newPersonality;
  writeData(data);
  return data[userId];
}

function addTrait(userId, trait) {
  const data = readData();
  if (!data[userId]) return null;

  if (!data[userId].traits.includes(trait)) {
    data[userId].traits.push(trait);
    writeData(data);
  }
  return data[userId];
}

function removeTrait(userId, trait) {
  const data = readData();
  if (!data[userId]) return null;

  data[userId].traits = data[userId].traits.filter(t => t !== trait);
  writeData(data);
  return data[userId];
}

function addItem(userId, item) {
  const data = readData();
  if (!data[userId]) return false;

  if (!data[userId].inventory) data[userId].inventory = [];
  data[userId].inventory.push(item);

  writeData(data);
  return true;
}

function spendGold(userId, amount) {
  const data = readData();
  if (!data[userId]) return false;
  if (data[userId].gold === undefined) data[userId].gold = 0;

  if (data[userId].gold < amount) return false;

  data[userId].gold -= amount;
  writeData(data);
  return true;
}

function addGold(userId, amount) {
  const data = readData();
  if (!data[userId]) return false;
  if (data[userId].gold === undefined) data[userId].gold = 0;

  data[userId].gold += amount;
  writeData(data);
  return true;
}

function getAllCharacters() {
  return readData();
}

function battle(user1, user2) {
  const data = readData();
  if (!data[user1] || !data[user2]) return null;

  const traitBonus1 = data[user1].traits.length;
  const traitBonus2 = data[user2].traits.length;

  const roll1 = Math.floor(Math.random() * 20) + data[user1].level + traitBonus1;
  const roll2 = Math.floor(Math.random() * 20) + data[user2].level + traitBonus2;

  let winner = null;
  if (roll1 > roll2) winner = user1;
  else if (roll2 > roll1) winner = user2;

  if (winner) updateXP(winner, 25);

  return {
    winner,
    roll1,
    roll2,
    name1: data[user1].name,
    name2: data[user2].name,
    char1: data[user1].personality,
    char2: data[user2].personality,
    traits1: data[user1].traits,
    traits2: data[user2].traits,
  };
}

export default {
  createCharacter,
  getCharacter,
  updateXP,
  changePersonality,
  addTrait,
  removeTrait,
  getAllCharacters,
  battle,
  addItem,
  spendGold,
  addGold,
};
