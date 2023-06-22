const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "commands",
    description: "Provides a list of commands of the bot.",
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    execute(interaction) {

        const cmdEmbed = new MessageEmbed()
            .setDescription("**COMMANDS of Voaf Bot**")
            .setColor("RANDOM")
            .setFields(

                { name: "Ticket System", value: " Here is the list of commands used for ticket system." },
                { name: "create", value: "Used to create a ticket", inline: true },
                { name: "ticket", value: "Used to perform ticket actions.", inline: true },
                { name: "ticketsetup", value: "Used to setup the complete ticket systme", inline: true },

                { name: "Utility", value: "Here is the list of commands used for general purpose." },
                { name: "say", value: "Used to make the bot say anything", inline: true },
                { name: "invite", value: "Used to get important bot related invites.", inline: true },
                { name: "serverinfo", value: "Get serverinfo of the present guild.", inline: true },

                { name: "Moderation", value: " Will be introduced SOON", inline: true },

                { name: "Economy System", value: "Will introduce SOON" }

            )


        interaction.reply({ embeds: [cmdEmbed] });
    }
}