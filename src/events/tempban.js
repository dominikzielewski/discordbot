const { EmbedBuilder, Events } = require('discord.js');
const tempban = require('../schemas/tempbanSchema');

module.exports = {
    name: Events.ClientReady,
    async execute (client) {
        async function unban(banData) {
            const delay = banData.BanTime - Date.now();
            if (delay <= 0) return;

            setTimeout(async () => {
                try {
                    const guild = await client.guilds.fetch(banData.Guild);
                    await guild.bans.remove(banData.User);

                    await tempban.deleteOne({ _id: banData._id })
                } catch (e) {
                    console.error('error unbunning member');
                }
            }, delay)
        }

        const data = await tempban.find();
        data.forEach(unban);
        tempban.watch().on('change', async (change) => {
            if (change.operationType === 'insert') {
                const newUnban = change.fullDocument;
                unban(newUnban);
            }
        });
    }
}