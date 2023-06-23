const { ButtonInteraction, MessageEmbed } = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");

const DB = require("../../structures/schemas/Ticket");
const TicketSetupData = require("../../structures/schemas/TicketSetup");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {
        if (!interaction.isButton()) return;
        const { guild, customId, channel, member } = interaction;
        if (!["close", "lock", "unlock", "claim"].includes(customId)) return;

        const TicketSetup = await TicketSetupData.findOne({ GuildID: guild.id });
        if (!TicketSetup)
            return interaction.reply({ content: "The data for this system is outdated." });

        if (!member.roles.cache.find((r) => r.id === TicketSetup.Handlers))
            return interaction.reply({
                content: "You cant use this command cause you lack the ticket handler role BRUH.",
                ephemeral: true
            });

        const logChannel = await guild.channels.cache.get(TicketSetup.Logging);

        const Embed = new MessageEmbed().setColor("BLUE");

        DB.findOne({ ChannelID: channel.id }, async (err, docs) => {
            if (err) throw err;
            if (!docs) return interaction.reply({ content: "No data was found related to this ticket, please delete manual.", ephemeral: true });
            switch (customId) {
                case "lock":
                    if (docs.Locked == true)
                        return interaction.reply({ content: "This ticket is already locked.", ephemeral: true });
                    await DB.updateOne({ ChannelID: channel.id }, { Locked: true });
                    Embed.setDescription("🔒 | This ticket is now locked for reviewing.");

                    const lockEmbed = new MessageEmbed()
                        .setTitle("Ticket Log")
                        .addFields(
                            { name: "Action", value: "Lock", inline: true },
                            { name: "Channel", value: `${channel.name} ( ${channel.id} )` },
                            { name: "Ticket Members(s)", value: `${docs.MembersID}` },
                            { name: "Locked by", value: `<@${interaction.user.id}> - ${interaction.user.id}` }
                        )
                        .setFooter("Locking successful")
                        .setColor("RED")
                        .setTimestamp()

                    docs.MembersID.forEach((m) => {
                        channel.permissionOverwrites.edit(m, {
                            SEND_MESSAGES: false,
                        });
                    });
                    if (!logChannel == 0) logChannel.send({ embeds: [lockEmbed] });;

                    interaction.reply({ embeds: [Embed] });

                    break;
                case "unlock":
                    if (docs.Locked == false)
                        return interaction.reply({ content: "This ticket is already locked.", ephemeral: true });
                    await DB.updateOne({ ChannelID: channel.id }, { Locked: false });
                    Embed.setDescription("🔓 | This ticket is now unlocked.");

                    const unlockEmbed = new MessageEmbed()
                        .setTitle("Ticket Log")
                        .addFields(
                            { name: "Action", value: "Unlock", inline: true },
                            { name: "Channel", value: `${channel.name} ( ${channel.id} )` },
                            { name: "Ticket Members(s)", value: `${docs.MembersID}` },
                            { name: "Unlocked by", value: `<@${interaction.user.id}> - ${interaction.user.id}` }
                        )
                        .setFooter("Unlocking successful")
                        .setColor("#35e2a7")
                        .setTimestamp()

                    docs.MembersID.forEach((m) => {
                        channel.permissionOverwrites.edit(m, {
                            SEND_MESSAGES: true,
                        });
                    });
                    if (!logChannel == 0) logChannel.send({ embeds: [unlockEmbed] });;

                    interaction.reply({ embeds: [Embed] });
                    break;
                case "close":
                    if (docs.Closed == true)
                        return interaction.reply({ content: "Ticket is already closed, please wait for it to get deleted.", ephemeral: true });
                    const attachment = await createTranscript(channel, {
                        limit: -1,
                        returnBuffer: false,
                        fileName: `${docs.Type} - ${docs.TicketID}.html`,
                    });

                    await DB.updateOne({ ChannelID: channel.id }, { Closed: true });


                    const closeEmbed = new MessageEmbed()
                        .setTitle("Ticket Log")
                        .addFields(
                            { name: "Action", value: "Close", inline: true },
                            { name: "Channel", value: `${channel.name} ( ${channel.id} )` },
                            { name: "Ticket Member(s)", value: `${docs.MembersID}` },
                            { name: "Closed by", value: `<@${interaction.user.id}> - ${interaction.user.id}` }
                        )
                        .setFooter("Closing successful")
                        .setColor("WHITE")
                        .setTimestamp()


                    const Message = await guild.channels.cache.get(TicketSetup.Transcripts).send({
                        embeds: [Embed.setTitle(`Transcript Case: ${docs.Type}\nID: ${docs.TicketID}\nMember(s): ${docs.MembersID}`)],
                        files: [attachment]
                    });


                    const dmEmbed = new MessageEmbed()
                        .setTitle("Ticket info")
                        .setColor("BLUE")
                        .setDescription(`Ticket Case: ${docs.Type}\nTicket ID: ${docs.TicketID}\nMember(s): ${docs.MembersID}`)


                    if (!logChannel == 0) logChannel.send({ embeds: [closeEmbed] });

                    member.send({
                        embeds: [dmEmbed],
                        files: [attachment]
                    });

                    interaction.reply({
                        embeds: [
                            Embed.setDescription(
                                `The transcript is now saved [here](${Message.url})
                                Deleting the channel in 10 seconds.`
                            ),
                        ],
                    });

                    setTimeout(() => {
                        channel.delete();
                    }, 10 * 1000);
                    break;

                case "claim":
                    if (docs.Claimed == true)
                        return interaction.reply({
                            content: `This ticket has aready been claimbed by <@${docs.ClaimedBy}>`,
                            ephemeral: true,
                        });

                    await DB.updateOne({ ChannelID: channel.id }, { Claimed: true, ClaimedBy: member.id });

                    Embed.setDescription(`🛄 | This ticket is now claimed by ${member}`);

                    const claimEmbed = new MessageEmbed()
                        .setTitle("Ticket Log")
                        .addFields(
                            { name: "Action", value: "Claim", inline: true },
                            { name: "Channel", value: `${channel.name} ( ${channel.id} )` },
                            { name: "Ticket Member(s)", value: `${docs.MembersID}` },
                            { name: "Claimed by", value: `<@${interaction.user.id}> - ${interaction.user.id}` }
                        )
                        .setFooter("Claiming successful")
                        .setColor("BLUE")
                        .setTimestamp()

                    interaction.reply({ embeds: [Embed] });
                    if (!logChannel == 0) logChannel.send({ embeds: [claimEmbed] });;
                    break;
            }
        });
    },
};