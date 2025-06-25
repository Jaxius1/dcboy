import fetch from 'node-fetch';

const API_KEY = process.env.API_FOOTBALL_KEY; // .env içine koy

const BASE_URL = 'https://v3.football.api-sports.io';

async function getSuperLigTable() {
  const url = `${BASE_URL}/standings?league=203&season=2024`; // Süper Lig ID=195, sezon 2023-2024
  const res = await fetch(url, {
    headers: {
      'x-apisports-key': API_KEY,
    }
  });
  const data = await res.json();
  if (!data.response) throw new Error('API’dan veri alınamadı');
  return data.response[0].league.standings[0]; // Puan tablosu arrayi
}

async function getBesiktasMatches() {
  const url = `${BASE_URL}/fixtures?team=549&season=2024`; // Beşiktaş ID=2
  const res = await fetch(url, {
    headers: {
      'x-apisports-key': API_KEY,
    }
  });
  const data = await res.json();
  if (!data.response) throw new Error('API’dan veri alınamadı');
  return data.response; // Maçlar arrayi
}

export { getSuperLigTable, getBesiktasMatches };
