import fs from 'fs';
import path from 'path';

const zamanFile = path.join(process.cwd(), 'zamanParcasi.json');

function readData() {
  if (!fs.existsSync(zamanFile)) return {};
  try {
    const raw = fs.readFileSync(zamanFile, 'utf8');
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeData(data) {
  fs.writeFileSync(zamanFile, JSON.stringify(data, null, 2));
}

// Zaman parçası ekle
function addParca(userId, amount = 1) {
  const data = readData();
  if (!data[userId]) data[userId] = { parcaSayisi: 0, sonKullanma: 0 };
  data[userId].parcaSayisi += amount;
  writeData(data);
  return data[userId];
}

// Kullanıcının kaç parçası var
function getParca(userId) {
  const data = readData();
  if (!data[userId]) return { parcaSayisi: 0, sonKullanma: 0 };
  return data[userId];
}

// Parça harca
function spendParca(userId, amount) {
  const data = readData();
  if (!data[userId] || data[userId].parcaSayisi < amount) return false;
  data[userId].parcaSayisi -= amount;
  data[userId].sonKullanma = Date.now();
  writeData(data);
  return true;
}

export default { addParca, getParca, spendParca };
