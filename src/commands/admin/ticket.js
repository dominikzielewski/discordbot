const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');

// Define Channel IDs as constants
const TICKET_REQUEST_CHANNEL_ID = '1328495603784744991'; // Replace with your ticket request channel ID

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create_ticket') // Define the command name
        .setDescription('Wyslij panel do ticketow.'),

    async execute(interaction) {
        // Check if the user already has an open ticket (excluding closed ones)
        const existingTicket = interaction.guild.channels.cache.find(
            channel => channel.name === `ticket-${interaction.user.username}-*` && channel.parentId !== CLOSED_CATEGORY_ID
        );

        if (existingTicket) {
            return interaction.reply({
                content: 'Masz już otwarty ticket!',
                ephemeral: true,
            });
        }

        // Embed message for ticket creation
        const embed = new EmbedBuilder()
            .setColor(0x5A3D63)
            .setTitle('🎫 Stwórz swój ticket')
            .setDescription('› Wybierz powód zgłoszenia! Zostanie utworzony specjalny kanał na którym będziesz mógł skontaktować się z administracją serwera!');

        // Create the dropdown for ticket reason
        const reasonDropdown = new StringSelectMenuBuilder()
            .setCustomId('ticket_reason')
            .setPlaceholder('Wybierz powoód')
            .addOptions(
                { label: 'Code', value: 'code' },
                { label: 'Graphics', value: 'graphics' },
                { label: 'Video', value: 'video' },
                { label: 'WordPress', value: 'wordpress' },
                { label: 'Discord', value: 'discord' },
                { label: 'Inne', value: 'other' },
                { label: 'Błędy', value: 'error' }
            );

        const row2 = new ActionRowBuilder().addComponents(reasonDropdown); // Second row with dropdown

        // Fetch the 'ticket-requests' channel (change the ID to your actual ticket request channel)
        const ticketRequestChannel = interaction.guild.channels.cache.get(TICKET_REQUEST_CHANNEL_ID); // Use the constant

        if (!ticketRequestChannel) {
            return interaction.reply({
                content: 'Ticket request channel not found.',
                ephemeral: true,
            });
        }

        try {
            // Send the embed with the dropdown to the ticket-requests channel
            await ticketRequestChannel.send({
                embeds: [embed],
                components: [row2],
            });

            // Acknowledge the user with an ephemeral response
            await interaction.reply({
                content: 'Please check the ticket request channel to create your ticket.',
                ephemeral: true,
            });
        } catch (error) {
            console.error('Error sending message:', error);
            await interaction.reply({
                content: 'There was an error sending the ticket creation message.',
                ephemeral: true,
            });
        }
    },
};