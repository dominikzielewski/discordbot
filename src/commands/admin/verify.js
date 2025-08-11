const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle
} = require('discord.js');
const { InteractionResponseFlags } = require('discord-api-types/v10');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create_verify')
        .setDescription('Wyślij panel do weryfikacji.'),
    async execute(interaction) {
        // Zapobiegamy uruchomieniu w DM
        if (!interaction.guild) {
            return interaction.reply({
                content: 'To polecenie działa tylko na serwerze.',
                flags: InteractionResponseFlags.Ephemeral
            });
        }

        // Embed weryfikacji
        const verifyEmbed = new EmbedBuilder()
            .setColor(0x5A3D63)
            .setTitle('<:orbitcheck:1329619192256794624> Weryfikacja')
            .setDescription('› Kliknij aby się zweryfikować. Otrzymasz dostęp do serwera.');

        // Przycisk weryfikacyjny
        const verifyButton = new ButtonBuilder()
            .setCustomId('verify_button')
            .setLabel('ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤZweryfikujㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ')
            .setEmoji('<:whitecheck:1329618107723153471>')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(verifyButton);

        // Znajdź kanał weryfikacji
        const verifyChannel = interaction.guild.channels.cache.get('1404175468009357377');
        if (!verifyChannel) {
            return interaction.reply({
                content: 'Nie znaleziono kanału weryfikacji. Utwórz go i spróbuj ponownie.',
                flags: InteractionResponseFlags.Ephemeral
            });
        }

        // Wyślij panel weryfikacyjny
        await verifyChannel.send({ embeds: [verifyEmbed], components: [row] });

        // Potwierdź użytkownikowi
        await interaction.reply({
            content: 'Panel weryfikacyjny został wysłany.',
            flags: InteractionResponseFlags.Ephemeral
        });
    },
};
