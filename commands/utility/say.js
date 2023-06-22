const { CommandInteraction } = require("discord.js");

module.exports = {
    name: "say",
    description: "Used to make a bot say something",
    options: [
        {
            name: "content",
            description: "Enter text you want bot to say.",
            type: "STRING",
            required: true,
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    execute(interaction) {

        const { options } = interaction;
        const Content = options.getString("content");

        interaction.channel.send(`${Content}`);

        interaction.reply({ content: "Done!", ephemeral: true })
    }
}