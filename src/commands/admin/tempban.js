const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ms = require('ms');
const tempban = require('../../schemas/tempbanSchema');
const { execute } = require('../../events/ready');

module.exports = {
    mod: true,
    data: new SlashCommandBuilder()
    .setName('tempban')
    .setDescription('Ban uzytkownika na określony czas')
    .addUserOption(option => option.setName('member').setDescription('sss').setRequired(true))
    .addStringOption(option => option.setName('duration').setDescription('sss').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('sss').setRequired(true))
    .addIntegerOption(option => option.setName('delete-message').setDescription('sss').setRequired(true).setMinValue(0).setMaxValue(7)),
    async execute (interaction) {

        const { options } = interaction;
        const member = options.getUser('member');
        const time = options.getString('duration');
        const duration = ms(time);
        const reason = options.getString('reason');
        const deleteMessage = options.getInteger('delete-message');

        async function sendMessage (message) {
            const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setDescription(message);

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const bans = await interaction.guild.bans.fetch();

        var banned = false;
        await bans.forEach(async ban => {
            if (ban.user.id === member.id) {
                banned = true;
            }
        });

        if (banned) {
            return await sendMessage('Użytkownik jest już zbanowany!');
        }

        await tempban.create({
            Guild: interaction.guild.id,
            User: member.id,
            BanTime: Date.now() + duration
        });

        var error = false;
        await interaction.guild.bans.create(member.id, { reason: reason, deleteMessage: deleteMessage }).catch(err =>{
            error = true;
            console.log(err).BanTime;
        });

        if (error) {
            return await sendMessage('Bład!');
        } else {
            await sendMessage(`${member} został zbanowany na ${time} za ${reason}`);
        }
    }
}