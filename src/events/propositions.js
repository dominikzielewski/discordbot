const Propositions = require('../commands/admin/propositions');  // Import the Propositions class

module.exports = {
    name: 'messageCreate',   // The name of the event
    async execute(message) {
        // Pass the message to the Propositions handler
        await Propositions.handleMessage(message);
    },
};