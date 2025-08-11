const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Wyczyść daną ilość wiadomości na kanale.')
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Liczba wiadomości do usunięcia.')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)),  // Can delete between 1 and 100 messages.

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        
        if (amount < 1 || amount > 100) {
            return interaction.reply({
                content: 'Możesz usunąć tylko od 1 do 100 wiadomości!',
                ephemeral: true,
            });
        }

        // Delete the specified number of messages
        try {
            const deletedMessages = await interaction.channel.bulkDelete(amount, true);
            await interaction.reply({
                content: `Usunięto **${deletedMessages.size}** wiadomości.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error('Error deleting messages:', error);
            await interaction.reply({
                content: 'There was an error while trying to clear messages.',
                ephemeral: true,
            });
        }
    },
};