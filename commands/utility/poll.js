const { CommandInteraction } = require("discord.js");

module.exports = {
    name: "poll",
    description: "Quick and easy yes/no poll. [ UNDER CONSTRUCTION ]",
    options: [
        {
            name: "question",
            description: "Enter the question you want a poll on.",
            required: true,
            type: "STRING",
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const { options } = interaction;
        const que = options.getString("question");

        const theMsg = await interaction.reply({ content: `**${interaction.user.username}** asks: ${que}` });
    }
}