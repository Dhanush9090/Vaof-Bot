const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "suggest",
    description: "Quick and easy suggestion command",
    options: [
        {
            name: "suggestion",
            description: "Enter your suggestion here.",
            required: true,
            type: "STRING",
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    execute(interaction) {

        const { options, customId } = interaction;
        if (!["up", "down"].includes(customId)) return;

        const main_sugg = options.getString("suggestion");

        const suggestEmbed = new MessageEmbed()
            .setTitle("Suggestion")
            .setDescription(`${main_sugg}

            Given by <@${interaction.user.id}>`)
            .setColor("RANDOM")
            .setTimestamp()


        const Buttons = new MessageActionRow();
        Buttons.addComponents(
            new MessageButton()
                .setCustomId("up")
                .setLabel("Upvote")
                .setStyle("PRIMARY")
                .setEmoji("👍"),
            new MessageButton()
                .setCustomId("down")
                .setLabel("Downvote")
                .setStyle("SECONDARY")
                .setEmoji("👎")
        );

        interaction.reply({ embeds: [suggestEmbed], components: [Buttons] });
    }
}