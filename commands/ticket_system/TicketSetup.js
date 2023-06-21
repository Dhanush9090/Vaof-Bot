const { MessageEmbed, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js");
const DB = require("../../structures/schemas/TicketSetup.js");

module.exports = {
    name: "ticketsetup",
    description: "Setup your ticketing system.",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "channel",
            description: "Select the ticket creation channel.",
            required: true,
            type: "CHANNEL",
            channelTypes: ["GUILD_TEXT"],
        },
        {
            name: "category",
            description: "Select the ticket channel's creation category.",
            required: true,
            type: "CHANNEL",
            channelTypes: ["GUILD_CATEGORY"],
        },
        {
            name: "transcripts",
            description: "Select the transcripts channel.",
            required: true,
            type: "CHANNEL",
            channelTypes: ["GUILD_TEXT"],
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

        const { guild, options } = interaction;

        try {
            const Channel = options.getChannel("channel");
            const Category = options.getChannel("category");
            const Transcripts = options.getChannel("transcripts");
            const Logging = options.getChannel("logging") || 0;
            const Handlers = options.getRole("handlers");
            const Everyone = options.getRole("everyone");

            const Description = options.getString("description");

            const Button1 = options.getString("firstbutton");
            const Button2 = options.getString("secondbutton");
            const Button3 = options.getString("thirdbutton");


            await DB.findOneAndUpdate(
                { GuildID: guild.id },
                {
                    Channel: Channel.id,
                    Category: Category.id,
                    Transcripts: Transcripts.id,
                    Logging: Logging.id,
                    Handlers: Handlers.id,
                    Everyone: Everyone.id,
                    Description: Description,
                    Buttons: [Button1, Button2, Button3]
                },
                {
                    new: true,
                    upsert: true
                }
            );

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

            const setupEmbed = new MessageEmbed()
                .setTitle("Ticket Log")
                .addFields(
                    { name: "Action", value: "Setup", inline: true },
                    { name: "Main Channel", value: `${Channel}`, inline: true },
                    { name: "Tickets Category", value: `${Category}`, inline: true },
                    { name: "Transcripts Channel", value: `${Transcripts}`, inline: true },
                    { name: "Logging Channel", value: `${Logging}`, inline: true },
                    { name: "Ticket Handlers", value: `${Handlers}`, inline: true },
                    { name: "Button 1", value: `${Button1}`, inline: true },
                    { name: "Button 2", value: `${Button2}`, inline: true },
                    { name: "Button 3", value: `${Button3}`, inline: true },
                    { name: "Initiated by", value: `<@${interaction.user.id}> - ${interaction.user.id}`, inline: true }
                )
                .setColor("YELLOW")
                .setFooter("Setup successful")
                .setTimestamp()

            await guild.channels.cache.get(Channel.id).send({ embeds: [Embed], components: [Buttons] });
            interaction.reply({ content: "Setup successful :)", ephemeral: true });
            if (!Logging == 0) return Logging.send({ embeds: [setupEmbed] });


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
    },
};