const { MessageEmbed, CommandInteraction } = require("discord.js");
const DB = require("../../structures/schemas/Ticket");
const TicketSetupData = require("../../structures/schemas/TicketSetup");

module.exports = {
    name: "ticket",
    description: "Ticket Actions.",
    options: [
        {
            name: "action",
            type: "STRING",
            description: "Add or Remove a member from the ticket.",
            required: true,
            choices: [
                { name: "Add", value: "add" },
                { name: "Remove", value: "remove" },
            ],
        },
        {
            name: "member",
            description: "Select a member.",
            type: "USER",
            required: true,
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { guild, guildId, options, channel, member } = interaction;

        const Action = options.getString("action");
        const Member = options.getMember("member");

        const Embed = new MessageEmbed();

        const TicketSetup = await TicketSetupData.findOne({ GuildID: guild.id });
        const logChannel = await guild.channels.cache.get(TicketSetup.Logging);


        if (!interaction.member.roles.cache.find((r) => r.id === TicketSetup.Handlers))
            return interaction.reply({
                content: "You cant use this command cause you lack the ticket handler role",
                ephemeral: true
            });


        switch (Action) {
            case "add":
                DB.findOne(
                    { GuildID: guildId, ChannelID: channel.id },
                    async (err, docs) => {
                        if (err) throw err;
                        if (!docs)
                            return interaction.reply({
                                embeds: [
                                    Embed.setColor("RED").setDescription(
                                        "⛔ | This channel is not tied with a ticket."
                                    ),
                                ],
                                ephemeral: true
                            });
                        if (docs.MembersID.includes(Member.id))
                            return interaction.reply({
                                embeds: [
                                    Embed.setColor("RED").setDescription(
                                        "⛔ | This member is already added to this ticket."
                                    ),
                                ],
                                ephemeral: true
                            });
                        docs.MembersID.push(Member.id);

                        channel.permissionOverwrites.edit(Member.id, {
                            SEND_MESSAGES: true,
                            VIEW_CHANNEL: true,
                            READ_MESSAGE_HISTORY: true
                        });

                        const addEmbed = new MessageEmbed()
                            .setTitle("Ticket Log")
                            .addFields(
                                { name: "Action", value: "Member add", inline: true },
                                { name: "Added Member(s)", value: `<@${Member.id}> - ${Member.id}` },
                                { name: "Channel", value: `${channel.name} ( ${channel.id} )` },
                                { name: "Added by", value: `<@${interaction.user.id}> - ${interaction.user.id}` }
                            )
                            .setFooter("Adding successful")
                            .setColor("ORANGE")
                            .setTimestamp()


                        interaction.reply({ embeds: [Embed.setColor("GREEN").setDescription(`✅ | ${Member} has been added to this ticket.`)] });
                        docs.save();
                        if (!logChannel == 0) logChannel.send({ embeds: [addEmbed] });;
                    }
                );
                break;
            case "remove":
                DB.findOne(
                    { GuildID: guildId, ChannelID: channel.id },
                    async (err, docs) => {
                        if (err) throw err;
                        if (!docs)
                            return interaction.reply({
                                embeds: [
                                    Embed.setColor("RED").setDescription(
                                        "⛔ | This channel is not tied with a ticket."
                                    ),
                                ],
                                ephemeral: true
                            });
                        if (!docs.MembersID.includes(Member.id))
                            return interaction.reply({
                                embeds: [
                                    Embed.setColor("RED").setDescription(
                                        "⛔ | This member is not in this ticket."
                                    ),
                                ],
                                ephemeral: true
                            });
                        docs.MembersID.remove(Member.id);

                        channel.permissionOverwrites.edit(Member.id, {
                            VIEW_CHANNEL: false,
                        });

                        const removeEmbed = new MessageEmbed()
                            .setTitle("Ticket Log")
                            .addFields(
                                { name: "Action", value: "Member remove", inline: true },
                                { name: "Removed Member(s)", value: `<@${Member.id}> - ${Member.id}` },
                                { name: "Channel", value: `${channel.name} ( ${channel.id} )` },
                                { name: "Removed by", value: `<@${interaction.user.id}> - ${interaction.user.id}` }
                            )
                            .setFooter("Removing successful")
                            .setColor("BLURPLE")
                            .setTimestamp()


                        interaction.reply({ embeds: [Embed.setColor("GREEN").setDescription(`✅ | ${Member} has been removed from the ticket.`)] });
                        docs.save();
                        if (!logChannel == 0) logChannel.send({ embeds: [removeEmbed] });;
                    }
                )
                break;
        }
    },
};