const { SlashCommandBuilder, MessageFlags, PermissionsBitField } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Nadaj timeout dla użytkownika!')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Użytkownik do timeout.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Czas timeout (np. 1h, 30m, 15s)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Powód timeout')
                .setRequired(false)
        ),
    async execute(interaction) {
        // Get the target user, duration, and reason
        const target = interaction.options.getUser('target');
        const durationString = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'Nie podano powodu.';

        // Check if the target user is valid
        const member = interaction.guild.members.cache.get(target.id);
        if (!member) {
            return interaction.reply({
                content: `Nie znaleziono ${target.tag} na serwerze.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        // Convert the duration string to milliseconds using the ms module
        const duration = ms(durationString);

        // Ensure the duration is valid
        if (!duration) {
            return interaction.reply({
                content: 'Nieprawidłowa wartość długości timeout (np. 1h, 30m, 15s).',
                flags: MessageFlags.Ephemeral,
            });
        }

        try {
            // Apply the timeout
            await member.timeout(duration, reason); // ms already returns duration in milliseconds
            await interaction.reply({
                content: `${target.tag} dostał timeout ${ms(duration)}. Powód: ${reason}`,
                flags: MessageFlags.Ephemeral,
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'An error occurred while trying to apply the timeout.',
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};