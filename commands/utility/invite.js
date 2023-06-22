const { MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
    name: "invite",
    description: "Bot and support server invite links",

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction) {

        const inviteEmbed = new MessageEmbed()
            .setTitle("Vaof Bot Invite & Support")
            .setColor("RANDOM")
            .setDescription(`
        [Vaof Bot - Support Server](Server link here)
        [Vaof Bot - Bot Invite](Bot invite link here)`)


        interaction.reply({ embeds: [inviteEmbed] })

    }
}