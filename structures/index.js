const { Client, Collection } = require("discord.js");
const client = new Client({ intents: 32767 });
const { Token } = require("../structures/config.json");

const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");


client.commands = new Collection();

["events" , "commands" ].forEach(handler => {
    require(`./handlers/${handler}`)(client, PG , Ascii);
});

client.login(Token);