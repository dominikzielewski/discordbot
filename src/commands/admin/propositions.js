const { EmbedBuilder } = require('discord.js');

// Constants
const EMBED_COLOR = '#5a3d63';
const THUMBNAIL_URL = 'https://i.imgur.com/BYDIQUN.png';
const CHANNEL_ID = '1404175468009357381';
const FOOTER_TEXT = 'DobreMordy';

class Propositions {
    constructor() {}

    // Function to process the message
    async handleMessage(message) {
        // Check if the message is from the correct channel and not from a bot
        if (message.channel.id === CHANNEL_ID && !message.author.bot) {
            try {
                // Create the embed for the proposition
                const embed = new EmbedBuilder()
                    .setColor(EMBED_COLOR)
                    .setTitle(`Propozycja od ${message.author.tag}`)
                    .setDescription(`**Treść propozycji:** ${message.content}`)
                    // .setFooter({ text: FOOTER_TEXT })
                    .setThumbnail(THUMBNAIL_URL);

                // Get the proposal channel by ID
                const proposalChannel = message.guild.channels.cache.get(CHANNEL_ID);

                if (!proposalChannel) {
                    return message.channel.send('Błąd: nie znaleziono kanału propozycji.');
                }

                // Send the embed to the proposal channel
                const sentMessage = await proposalChannel.send({
                    embeds: [embed],
                });

                // Add reactions to the sent message
                await sentMessage.react('👍');
                await sentMessage.react('👎');

                await message.delete();
            } catch (error) {
                console.error('Błąd podczas przetwarzania wiadomości:', error);
                message.channel.send('Coś poszło nie tak przy wysyłaniu propozycji.');
            }
        }
    }
}

module.exports = new Propositions();