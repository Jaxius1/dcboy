export default {
  name: 'interactionCreate',
  async execute(interaction, client) {
    try {
      if (interaction.isButton()) {
        try {
          await interaction.deferUpdate();
        } catch {
          return;
        }

        const { customId } = interaction;

        if (customId === 'kayıtol') {
          const kayıtlıRolId = '1343701837861224498';

          if (interaction.member.roles.cache.has(kayıtlıRolId)) {
            try {
              await interaction.followUp({ content: 'Zaten kayıtlısın dostum.', ephemeral: true });
            } catch {}
            return;
          }

          try {
            await interaction.member.roles.add(kayıtlıRolId);
            await interaction.followUp({ content: '✅ Başarıyla kayıt oldun!', ephemeral: true });
          } catch {}
          return;
        }

        if (customId === 'cekilis-katil') {
          return; // collector handle edecek
        }

        if (customId.startsWith('banOnay_') || customId.startsWith('banRed_') ||
            customId.startsWith('kickOnay_') || customId.startsWith('kickRed_')) {
          return;
        }
      }

      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        // Burada interaction henüz cevaplanmamışsa deferReply yapıyoruz
        if (!interaction.deferred && !interaction.replied) {
          await interaction.deferReply();
        }

        await command.execute(interaction, client);
      }
    } catch (err) {
      console.error('Komut çalıştırılırken hata:', err);

      if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
        try {
          await interaction.reply({ content: '❌ Komut çalıştırılırken bir hata oluştu.', ephemeral: true });
        } catch (e) {
          console.error('Hata mesajı gönderilemedi:', e);
        }
      }
    }
  }
};
