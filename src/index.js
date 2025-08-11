const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');

// ====== INIT CLIENT ======
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,           // wymagane do slash commands
        GatewayIntentBits.GuildMessages,    // wymagane jeśli bot wysyła / czyta wiadomości
        GatewayIntentBits.MessageContent,   // dostęp do treści wiadomości (tylko jeśli potrzebne)
        GatewayIntentBits.GuildMembers      // dostęp do listy członków i ich danych
    ],
});

client.commands = new Collection();
client.events = new Collection();
client.buttons = new Collection();
client.dropdowns = new Collection();
client.modals = new Collection();
client.schemas = new Collection();

// ====== LOGIN ======
client.login(token)
    .then(() => console.log('[BOT] Zalogowano pomyślnie!'))
    .catch(err => console.error('[BOT] Błąd logowania:', err));

// ====== LOAD COMMANDS ======
const commandsPath = path.join(__dirname, 'commands');
const commands = [];

fs.readdirSync(commandsPath).forEach(folder => {
    const folderPath = path.join(commandsPath, folder);
    if (!fs.lstatSync(folderPath).isDirectory()) return;

    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);
        if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        } else {
            console.warn(`[WARNING] Command at ${filePath} is missing "data" or "execute".`);
        }
    }
});

// ====== REGISTER COMMANDS ======
(async () => {
    try {
        console.log('[BOT] Odświeżanie komend aplikacji (/)...');
        const rest = new REST({ version: '10' }).setToken(token);
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        console.log('[BOT] Pomyślnie zarejestrowano komendy.');
    } catch (error) {
        console.error('[BOT] Błąd podczas rejestrowania komend:', error);
    }
})();

// ====== LOAD EVENTS ======
const eventsPath = path.join(__dirname, 'events');
fs.readdirSync(eventsPath)
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (!event.name) return;
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    });

// ====== LOAD BUTTONS ======
const buttonsPath = path.join(__dirname, 'buttons');
fs.readdirSync(buttonsPath)
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
        const filePath = path.join(buttonsPath, file);
        const button = require(filePath);
        if (button.customId && button.execute) {
            client.buttons.set(button.customId, button);
        } else {
            console.warn(`[WARNING] Button at ${filePath} is missing "customId" or "execute".`);
        }
    });

// ====== LOAD DROPDOWNS ======
const dropdownsPath = path.join(__dirname, 'dropdowns');
fs.readdirSync(dropdownsPath)
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
        const filePath = path.join(dropdownsPath, file);
        const dropdown = require(filePath);
        if (dropdown.customId && dropdown.execute) {
            client.dropdowns.set(dropdown.customId, dropdown);
        } else {
            console.warn(`[WARNING] Dropdown at ${filePath} is missing "customId" or "execute".`);
        }
    });

// ====== LOAD MODALS ======
const modalsPath = path.join(__dirname, 'modals');
fs.readdirSync(modalsPath)
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
        const filePath = path.join(modalsPath, file);
        const modal = require(filePath);
        if (modal.customId && modal.execute) {
            client.modals.set(modal.customId, modal);
        } else {
            console.warn(`[WARNING] Modal at ${filePath} is missing "customId" or "execute".`);
        }
    });

// ====== LOAD SCHEMAS ======
const schemasPath = path.join(__dirname, 'schemas');
fs.readdirSync(schemasPath)
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
        const filePath = path.join(schemasPath, file);
        const schema = require(filePath);
        if (schema.name) {
            client.schemas.set(schema.name, schema);
        } else {
            console.warn(`[WARNING] Schema at ${filePath} is missing "name" property.`);
        }
    });
