const { Events } = require('discord.js');
const announce = require('../commands/admin/announce'); // Import the Announcement command

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Check if the interaction is a modal submit
        if (interaction.isModalSubmit()) {
    if (interaction.customId === 'advancedAnnouncementModal') {
        const announce = require('../commands/admin/announce');
        await announce.modalSubmit(interaction);
    }
}

    },
};