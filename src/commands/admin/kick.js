const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Wyrzuć użytkownika z serwera.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Użytkownik do wyrzucenia.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Powód wyrzucenia użytkownika.')
                .setRequired(false)
        ),
    async execute(interaction) {
        // Get the target member and reason
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'Nie podano powodu.';

        // Check if the target is a valid member
        const member = interaction.guild.members.cache.get(target.id);
        if (!member) {
            return interaction.reply({
                content: `Nie znaleziono ${target.tag} na serwerze.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        // Check if the member is kickable (bot must have higher role than the member being kicked)
        if (!member.kickable) {
            return interaction.reply({
                content: `Nie można wyrzucić ${target.tag}.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        try {
            // Kick the member
            await member.kick(reason);
            await interaction.reply({
                content: `${target.tag} został wyrzucony z serwera. Powód: ${reason}`,
                flags: MessageFlags.Ephemeral,
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'An error occurred while trying to kick the member.',
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};