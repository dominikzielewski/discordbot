const { ActivityType } = require("discord.js");
const mongoose = require('mongoose');
const { mongoURL } = require('../config.json');
const { DateTime } = require('luxon');

const formattedDate = DateTime.now().toFormat('dd.MM.yyyy HH:mm');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        client.user.setActivity({

            name: `👨🏿‍💻 OrbitCode - coding team! ${formattedDate}`,
            type: ActivityType.Custom
        })
        console.log(`Ready! Logged in as ${client.user.tag}`);

        // Connect to MongoDB
        (async function() {
            if (!mongoURL) return console.warn('MongoDB URL is not provided in the config.json file, skipping database connection...');
            console.log('Connected to MongoDB...')
            await mongoose.connect(mongoURL);
        })();
    },
};