const { CommandInteraction, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
    name: "create",
    description: "Testing auto ticket setup",
    permission: "ADMINISTRATOR",

    options: [
        {
            name: "category_name",
            description: "Select the name of the categoy under which ticket system will be made.",
            required: true,
            type: "STRING",
            channelTypes: ["GUILD_CATEGORY"],
        },
        {
            name: "channel",
            description: "Select the channel where ticket embed should be sent.",
            required: true,
            type: "CHANNEL",
            channelTypes: ["GUILD_TEXT"],
        },
        {
            name: "transcripts",
            description: "Select the name of the transcripts channel.",
            type: "STRING",
            required: true,
        },
        {
            name: "handlers",
            description: "Select the ticket handler's role.",
            required: true,
            type: "ROLE",
        },
        {
            name: "everyone",
            description: "Provide the @everyone role. ITS IMPORTANT!",
            required: true,
            type: "ROLE",
        },
        {
            name: "description",
            description: "Set the description of the ticket creation channel.",
            required: true,
            type: "STRING",
        },
        {
            name: "firstbutton",
            description: "Give your first button a label here.",
            required: true,
            type: "STRING",
        },
        {
            name: "secondbutton",
            description: "Give your first button a label here.",
            required: true,
            type: "STRING",
        },
        {
            name: "thirdbutton",
            description: "Give your first button a label here.",
            required: true,
            type: "STRING",
        },
        {
            name: "logging",
            description: "Select the logging channel.",
            type: "CHANNEL",
            channelTypes: ["GUILD_TEXT"],
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction) {

        const { guild, options, channel } = interaction;

        try {
            const Category = options.getString("category_name");
            const Channel = options.getChannel("channel");
            const Transcripts = options.getString("transcripts");
            //const Logging = options.getChannel("logging") || 0;
            //const Handlers = options.getRole("handlers");
            //const Everyone = options.getRole("everyone");

            const Description = options.getString("description");

            const Button1 = options.getString("firstbutton");
            const Button2 = options.getString("secondbutton");
            const Button3 = options.getString("thirdbutton");

            const Buttons = new MessageActionRow();
            Buttons.addComponents(
                new MessageButton()
                    .setCustomId(Button1)
                    .setLabel(Button1)
                    .setStyle("PRIMARY"),
                new MessageButton()
                    .setCustomId(Button2)
                    .setLabel(Button2)
                    .setStyle("SECONDARY"),
                new MessageButton()
                    .setCustomId(Button3)
                    .setLabel(Button3)
                    .setStyle("SUCCESS")
            );

            const Embed = new MessageEmbed()
                .setAuthor({
                    name: guild.name + " | Ticketing System",
                    iconURL: guild.iconURL({ dynamic: true }),
                })
                .setDescription(Description)
                .setColor('#36393f')

            await guild.channels.cache.get(Channel.id).send({ embeds: [Embed], components: [Buttons] });


            await guild.channels
                .create(`${Category}`, {
                    type: "GUILD_CATEGORY"
                });


            const ticket_category = channel.guild.channels.cache.filter(channel => channel.type === "GUILD_CATEGORY" && channel.name === `${Category}`).id;


            await guild.channels
                .create(`${Transcripts}`, {
                    type: "GUILD_TEXT",
                    parent: Category
                });

            interaction.reply({ content: "Setup successful :)", ephemeral: true });


        } catch (err) {
            const errEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`⛔ | An error occured while setting up your ticket system\n**What to make sure of?**
            1. Make sure none of your buttons' names are duplicated.
            3. Make sure your button names do not exceed 200 characters.`
                );
            console.log(err);
            interaction.reply({ embeds: [errEmbed] });
        }

    }
}