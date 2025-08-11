const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        console.log(`New member joined: ${member.user.tag}`);

        const roleId = '1404175467459776557'; // Replace with the role ID to assign on join
        const roleId1 = '1404175467459776555'; // Replace with the role ID to assign on join

        // Fetch the role from the guild
        const role = member.guild.roles.cache.get(roleId);
        const role1 = member.guild.roles.cache.get(roleId1);

        if (!role) {
            console.error(`Role with ID ${roleId} not found.`);
            return;
        }

        if (!role1) {
            console.error(`Role with ID ${roleId1} not found.`);
            return;
        }

        try {
            // Assign the role to the member
            await member.roles.add(role);
            await member.roles.add(role1);
            console.log(`Assigned role ${role.name}, ${role1.name} to ${member.user.tag}`);
        } catch (error) {
            console.error(`Failed to assign role to ${member.user.tag}:`, error);
        }
    },
};