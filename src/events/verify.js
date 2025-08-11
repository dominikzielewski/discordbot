const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'verify_button') {
            const verifiedRoleId = '1328485163692195982'; // Replace with your verified role ID
            const newRoleId = '1328485289697742963'; // Replace with your new role ID

            const member = interaction.member;

            try {
                const verifiedRole = interaction.guild.roles.cache.get(verifiedRoleId);
                const newRole = interaction.guild.roles.cache.get(newRoleId);

                if (!verifiedRole || !newRole) {
                    return interaction.reply({
                        content: 'Role not found. Please contact an administrator.',
                        ephemeral: true,
                    });
                }

                if (member.roles.cache.has(verifiedRole.id)) {
                    return interaction.reply({
                        content: 'Jesteś już zweryfikowany!',
                        ephemeral: true,
                    });
                }

                // Add verified role and remove new role
                await member.roles.add(verifiedRole);
                await member.roles.remove(newRole);

                await interaction.reply({
                    content: '<:orbitcheck:1329619192256794624> Zweryfikowano!',
                    ephemeral: true,
                });
            } catch (error) {
                console.error(`Error during role assignment: ${error}`);
                await interaction.reply({
                    content: 'There was an error verifying your account. Please contact an administrator.',
                    ephemeral: true,
                });
            }
        }
    },
};