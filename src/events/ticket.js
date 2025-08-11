const { Events, MessageFlags, ChannelType, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

// Define Channel IDs as constants
const TICKET_CATEGORY_ID = '1328500517072015412';  // Replace with your "Tickets" category ID
const CLOSED_CATEGORY_ID = '1329246678452273298'; // Replace with your "Closed Tickets" category ID
const ADMIN_CHANNEL_ID = '1329242906157908101'; // Replace with your admin channel ID

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Handle ticket creation based on dropdown selection
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'ticket_reason') {
                const reason = interaction.values[0]; // Reason chosen by the user

                // Check if the user already has an open ticket (excluding closed ones)
                const existingTicket = interaction.guild.channels.cache.find(
                    channel => channel.name === `ticket-${interaction.user.username}-${reason}` && channel.parentId !== CLOSED_CATEGORY_ID
                );

                if (existingTicket) {
                    return interaction.reply({
                        content: 'Masz już otwarty ticket',
                        ephemeral: true,
                    });
                }

                // Create the 'Tickets' category if not already present
                const ticketCategory = interaction.guild.channels.cache.get(TICKET_CATEGORY_ID);
                if (!ticketCategory) {
                    return interaction.reply({
                        content: 'The "Tickets" category does not exist. Please contact an admin.',
                        flags: MessageFlags.Ephemeral,
                    });
                }

                // Create the ticket channel
                const newTicketChannel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}-${reason}`,
                    type: ChannelType.GuildText,
                    parent: ticketCategory.id, // Place in the 'Tickets' category
                    topic: `Ticket użytkownika ${interaction.user.tag}. Powód ${reason}`,
                    permissionOverwrites: [
                        { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                        { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                        { id: '1328483734831366327', allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
                    ],
                });

                // Send embed to the new ticket channel
                const userTicketEmbed = new EmbedBuilder()
                    .setColor(0x5A3D63)
                    .setTitle('Utworzono ticket')
                    .setDescription(`Witaj ${interaction.user.tag}, twój ticket został utworzony. Powód zgłoszenia: **${reason}**. Zaraz skontaktuje się z tobą administrator.`);

                const closeButton = new ButtonBuilder()
                    .setCustomId('ticket_close')
                    .setLabel('ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤZamknijㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ')
                    .setEmoji('<:cross:1329622674510446645>')
                    .setStyle(ButtonStyle.Danger);

                const row = new ActionRowBuilder().addComponents(closeButton); // Only add the close button

                await newTicketChannel.send({
                    embeds: [userTicketEmbed],
                    components: [row],
                });

                // Send embed to administration channel
                const adminChannel = interaction.guild.channels.cache.get(ADMIN_CHANNEL_ID);
                if (adminChannel) {
                    const adminEmbed = new EmbedBuilder()
                        .setColor(0x5A3D63)
                        .setTitle(`Ticket ${interaction.user.tag}`)
                        .setDescription(` Użytkownik ${interaction.user.tag} utworzył zgłoszenie. Powód: **${reason}**. Przyjmij zgłoszenie na kanale <#${newTicketChannel.id}>.`);
                    await adminChannel.send({ embeds: [adminEmbed] });
                }

                // Acknowledge ticket creation to the user
                await interaction.reply({
                    content: `Twoje zgłoszenie zostało utworzone. Powód: **${reason}**. Przejdź na kanał ${newTicketChannel} i skontaktuj się z administratorem.`,
                    flags: MessageFlags.Ephemeral,
                });
            }
        }

        // Handle closing the ticket
        if (interaction.isButton()) {
            if (interaction.customId === 'ticket_close') {
                const ticketChannel = interaction.channel;
        
                // Move ticket to "Closed Tickets" category
                const closedCategory = interaction.guild.channels.cache.get(CLOSED_CATEGORY_ID); // Ensure you have a "Closed Tickets" category
                if (closedCategory) {
                    await ticketChannel.setParent(closedCategory.id);
                }
        
                // // Create the "Remove Ticket" button
                // const removeButton = new ButtonBuilder()
                //     .setCustomId('ticket_remove')
                //     .setLabel('Remove Ticket')
                //     .setStyle(ButtonStyle.Secondary);
        
                // const row = new ActionRowBuilder().addComponents(removeButton);
        
                // // Send embed and button to the closed ticket channel
                // const closeEmbed = new EmbedBuilder()
                //     .setColor(0xFF0000)
                //     .setTitle('Ticket Closed')
                //     .setDescription(`This ticket has been closed. You can now remove it if needed by clicking the button below.`);
        
                // try {
                //     await ticketChannel.send({
                //         embeds: [closeEmbed],
                //         components: [row],
                //     });
                // } catch (error) {
                //     console.error('Error sending message to closed ticket channel:', error);
                //     await interaction.reply({
                //         content: 'There was an issue processing the ticket closure. Please try again later.',
                //         ephemeral: true,
                //     });
                //     return;
                // }
        
                // Acknowledge action to the user
                await interaction.reply({
                    content: `Twój ticket został zamknięty.`,
                    ephemeral: true,
                });
            }
        
            // // Handle removing the ticket
            // if (interaction.customId === 'ticket_remove') {
            //     const ticketChannel = interaction.channel;
        
            //     // Check if the ticket channel still exists before deleting
            //     if (!ticketChannel) {
            //         await interaction.reply({
            //             content: 'This ticket no longer exists or has been deleted.',
            //             ephemeral: true,
            //         });
            //         return;
            //     }
        
            //     // Delete the ticket channel
            //     try {
            //         await interaction.channel.delete();
            //         await interaction.reply({
            //             content: `Your ticket has been removed.`,
            //             ephemeral: true,
            //         });
            //     } catch (error) {
            //         console.error('Error removing the ticket:', error);
            //         await interaction.reply({
            //             content: 'There was an issue removing the ticket. Please try again later.',
            //             ephemeral: true,
            //         });
            //     }
            // }
        }
    },
};