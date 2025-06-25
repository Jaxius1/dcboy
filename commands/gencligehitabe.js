import { SlashCommandBuilder } from 'discord.js';

const gencligeHitabeMetni = `
Ey Türk gençliği!

Birinci vazifen, Türk istiklalini, Türk Cumhuriyetini, ilelebet, muhafaza ve müdafaa etmektir.

Mevcudiyetinin ve istikbalinin yegâne temeli budur.

Bu temel, senin en kıymetli hazinendir.

İstikbalde dahi seni, bu hazineden mahrum etmek isteyeceklerdir.

Bir gün, istiklal ve cumhuriyeti müdafaa mecburiyetine düşersen, vazifeye atılmak için, içinde bulunacağın vaziyetin imkân ve şeraitini düşünmeyeceksin!

Bu imkân ve şerait, çok namüsait bir mahiyette tezahür edebilir.

İstiklal ve cumhuriyetine kastedecek düşmanlar, bütün dünyada emsali görülmemiş bir galibiyetin mümessili olabilirler.

Cebren ve hile ile aziz vatanın bütün kaleleri zaptedilmiş, bütün tersanelerine girilmiş, bütün orduları dağıtılmış ve memleketin her köşesi bilfiil işgal edilmiş olabilir.

Bütün bu şeraitten daha elim ve daha vahim olmak üzere, memleketin dahilinde, iktidara sahip olanlar gaflet ve dalalet ve hatta hıyanet içinde bulunabilirler.

Hatta bu iktidar sahipleri şahsi menfaatlerini müstevlilerin siyasi emelleriyle tevhit edebilirler.

Millet, fakr ü zaruret içinde harap ve bîtap düşmüş olabilir.

Ey Türk istikbalinin evladı!

İşte, bu ahval ve şerait içinde dahi vazifen; Türk istiklal ve cumhuriyetini kurtarmaktır!

Muhtaç olduğun kudret, damarlarındaki asil kanda mevcuttur!
`;

export default {
  data: new SlashCommandBuilder()
    .setName('gencligehitabe')
    .setDescription('Mustafa Kemal Atatürk\'ün Gençliğe Hitabe\'sini gösterir'),

  async execute(interaction) {
    await interaction.reply({ content: gencligeHitabeMetni });
  },
};
