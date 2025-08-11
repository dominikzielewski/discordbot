const {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    EmbedBuilder,
    MessageFlags,
    ChannelType,
    StringSelectMenuBuilder,
} = require('discord.js');

const FOOTER_TEXT = 'DobreMordy'; // Footer text constant
const THUMBNAIL_URL = 'https://i.imgur.com/BYDIQUN.png'; // Thumbnail image URL constant

class Announcement {
    constructor() {
        this.data = new SlashCommandBuilder()
            .setName('ogloszenie')
            .setDescription('Stwórz ogłoszenie!')
            .addChannelOption(option =>
                option
                    .setName('channel')
                    .setDescription('Wybierz kanał na który ma zostać wysłana wiadomosc.')
                    .addChannelTypes(ChannelType.GuildText)
            ); // Optional channel selection
    }

    async execute(interaction) {
        try {
            console.log('Received interaction:', interaction);

            // Get the selected channel or fallback to the current channel
            const targetChannel =
                interaction.options.getChannel('channel') || interaction.channel;

            console.log(`Target Channel: ${targetChannel.name}`);

            // Create the modal
            const modal = new ModalBuilder()
                .setCustomId('advancedAnnouncementModal')
                .setTitle('Ogłoszenia');

            const titleInput = new TextInputBuilder()
                .setCustomId('announcementTitle')
                .setLabel('Tytuł')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Wprowadź tytuł ogłoszenia.')
                .setRequired(true);

            const descriptionInput = new TextInputBuilder()
                .setCustomId('announcementDescription')
                .setLabel('Treść ogłoszenia.')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('Wprowadź treść ogłoszenia')
                .setRequired(true);

            const colorInput = new TextInputBuilder()
                .setCustomId('announcementColor')
                .setLabel('Color (Hex Code)')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('#0099FF (Zostaw puste dla default)')
                .setRequired(false);

            const imageInput = new TextInputBuilder()
                .setCustomId('announcementImage')
                .setLabel('Image URL')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Wprowadź URL zdjęcia (opcjonalnie)')
                .setRequired(false);

            const thumbnailInput = new TextInputBuilder()
                .setCustomId('announcementThumbnail')
                .setLabel('Logo (yes/no)')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('default: no')
                .setRequired(false);

            const row1 = new ActionRowBuilder().addComponents(titleInput);
            const row2 = new ActionRowBuilder().addComponents(descriptionInput);
            const row3 = new ActionRowBuilder().addComponents(colorInput);
            const row4 = new ActionRowBuilder().addComponents(imageInput);
            const row5 = new ActionRowBuilder().addComponents(thumbnailInput);

            modal.addComponents(row1, row2, row3, row4, row5);

            console.log('Displaying modal:', modal);

            // Store the target channel ID in interaction for modal submission
            await interaction.showModal(modal);
            interaction.client.targetChannels ??= {};
            interaction.client.targetChannels[interaction.user.id] = targetChannel.id;
        } catch (error) {
            console.error('Error showing modal:', error);
            await interaction.reply({
                content: 'Something went wrong. Please try again.',
                flags: MessageFlags.Ephemeral,
            });
        }
    }

    async modalSubmit(interaction) {
        if (interaction.customId === 'advancedAnnouncementModal') {
            try {
                const title = interaction.fields.getTextInputValue('announcementTitle');
                const description = interaction.fields.getTextInputValue('announcementDescription');
                const color = interaction.fields.getTextInputValue('announcementColor') || '#5a3d63';
                const image = interaction.fields.getTextInputValue('announcementImage');
                const thumbnailInputValue = interaction.fields.getTextInputValue('announcementThumbnail') || 'no';
                const thumbnail = thumbnailInputValue.toLowerCase() === 'yes';

                console.log('Announcement Details:', { title, description, color, image, thumbnail });

                if (image && !image.startsWith('http')) {
                    return interaction.reply({
                        content: 'Invalid image URL. Please provide a valid URL starting with http or https.',
                        flags: MessageFlags.Ephemeral,
                    });
                }

                if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
                    return interaction.reply({
                        content: 'Invalid hex color code. Please provide a valid hex code like #0099FF.',
                        flags: MessageFlags.Ephemeral,
                    });
                }

                const embed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(description)
                    .setColor(color.startsWith('#') ? parseInt(color.slice(1), 16) : 0x0099FF)
                    .setFooter({ text: FOOTER_TEXT });

                if (thumbnail) embed.setThumbnail(THUMBNAIL_URL); // Add thumbnail only if enabled
                if (image) embed.setImage(image);

                // Retrieve the target channel from stored interaction data
                const targetChannelId = interaction.client.targetChannels?.[interaction.user.id];
                const targetChannel =
                    interaction.guild.channels.cache.get(targetChannelId) || interaction.channel;

                if (!targetChannel) {
                    return interaction.reply({
                        content: 'Error: Could not determine the target channel.',
                        flags: MessageFlags.Ephemeral,
                    });
                }

                await targetChannel.send({ embeds: [embed] });

                delete interaction.client.targetChannels[interaction.user.id]; // Cleanup

                await interaction.reply({
                    content: `Announcement sent successfully to ${targetChannel}!`,
                    flags: MessageFlags.Ephemeral,
                });
            } catch (error) {
                console.error('Error processing modal submission:', error);
                await interaction.reply({
                    content: 'Something went wrong while processing your announcement. Please try again.',
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    }
}

module.exports = new Announcement();