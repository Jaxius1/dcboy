import { SlashCommandBuilder } from 'discord.js';

const ruyaTabirleri = [
  "Rüyanda su görmek, genellikle hayatında duygusal bir temizlenme ve yenilenme dönemi olduğuna işarettir.",
  "Yılan görmek, genellikle saklı düşmanlara veya uyarılara delalet eder. Dikkatli ol!",
  "Uçtuğunu görmek, özgürlük arzusu ve engelleri aşma isteğin anlamına gelir.",
  "Dişlerinin dökülmesi, özgüven eksikliği veya hayatında yaşadığın stresin göstergesidir.",
  "Karanlık bir yerde kaybolmak, hayatındaki belirsizlikler ve kaygılarla yüzleştiğinin işaretidir.",
  "Ağaç görmek, köklerinle bağın ve hayatındaki sağlamlık duygusunu simgeler.",
  "Yanan ev, genellikle büyük değişimlerin ve dönüşümlerin başlangıcını gösterir.",
  "Birini kaybetmek, geçmişteki pişmanlıklar ve özlemlerle ilgili olabilir.",
  "Para bulmak, yakında maddi kazanç ve şansın artacağına işarettir.",
  "Yolda yürürken engellerle karşılaşmak, hayatında aşman gereken zorlukları temsil eder.",
  "Rüyada bebek görmek, yeni başlangıçlar ve masumiyetle ilgili olumlu bir semboldür.",
  "Kuş görmek, özgürlüğün, umutların ve yüksek ideallerinin göstergesidir.",
  "Yağmur altında yürümek, duygusal arınma ve rahatlama ihtiyacını simgeler.",
  "Rüyanda bir kapıyı açmak, yeni fırsatların ve keşiflerin yaklaştığı anlamına gelir.",
  "Kedi görmek, bazen gizli düşmanları veya başkalarının niyetlerine karşı dikkatli olmanı söyler."
];

export default {
  data: new SlashCommandBuilder()
    .setName('ruya')
    .setDescription('Gördüğün rüyayı tabir eder')
    .addStringOption(option =>
      option.setName('ruya')
        .setDescription('Rüyanı yaz')
        .setRequired(true)
    ),

  async execute(interaction) {
    const ruya = interaction.options.getString('ruya');

    // Rastgele tabir seç
    const tabir = ruyaTabirleri[Math.floor(Math.random() * ruyaTabirleri.length)];

    await interaction.reply(`**Rüyan:** ${ruya}\n\n**Tabir:** ${tabir}`);
  }
};
