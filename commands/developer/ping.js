const { CommandInteraction } = require("discord.js");

module.exports = {
    name: "ping",
    description: "ping to check if bot is online",
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    execute(interaction) {
        interaction.reply({ content: "PONG!", ephemeral: true })
    }
}