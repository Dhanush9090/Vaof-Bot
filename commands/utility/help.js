const { MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
    name: "help",
    description: "Lends a helping hand bro.",
    options: [
        {
            name: "case",
            type: "STRING",
            description: "Provides required assistance [ UNDER MAINTENANCE ] ",
            required: true,
            choices: [
                { name: "setup", value: "setup" },
                { name: "faq", value: "faq" },
                { name: "commands", value: "commands" }
            ],
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options } = interaction;


        const helpKind = options.getString("case");

        switch (helpKind) {
            case "setup":
                const case1Embed = new MessageEmbed()
                    .setDescription("Case 1 successful\n\n[Vaof Bot - Support Server](Server link here)")
                    .setColor("RANDOM")
                    .setTimestamp()


                interaction.reply({ embeds: [case1Embed] });

                break;


            case "faq":
                const case2Embed = new MessageEmbed()
                    .setDescription("Case 2 successful")
                    .setColor("RANDOM")
                    .setTimestamp()


                interaction.reply({ embeds: [case2Embed] });

                break;


            case "commands":
                const case3Embed = new MessageEmbed()
                    .setDescription("**COMMANDS**")
                    .setColor("RANDOM")
                    .setTimestamp()
                    .setFields(

                        { name: "Ticket System", value: " Here is the list of commands used for ticket system." },
                        { name: "create", value: "Used to create a ticket", inline: true },
                        { name: "ticket", value: "Used to perform ticket actions.", inline: true },
                        { name: "ticketSetup", value: "Used to setup the complete ticket systme", inline: true },

                        { name: "Utility", value: "Here is the list of commands used for general purpose." },
                        { name: "say", value: "Used to make the bot say anything", inline: true },
                        { name: "invite", value: "Used to get important bot related invites.", inline: true },
                        { name: "serverinfo", value: "Get serverinfo of the present guild.", inline: true },

                        { name: "Moderation", value: " Will be introduced SOON", inline: true },


                        { name: "Economy System", value: "Will introduce SOON" }

                    )


                interaction.reply({ embeds: [case3Embed] });

                break;
        }
    },
};