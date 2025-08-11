module.exports = {
    name: 'exampleDropdown',
    customId: 'example_dropdown_id',
    async execute(interaction) {
        await interaction.reply(`You selected: ${interaction.values[0]}`);
    },
};