const { Schema, model } = require('mongoose');

let tempban = new Schema({
    Guild: String,
    User: String,
    BanTime: String
});

module.exports = model('tempban123112312231', tempban);