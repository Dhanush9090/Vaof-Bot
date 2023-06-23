const { ButtonInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
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
        const { guild, member, customId } = interaction;

        const Data = await TicketSetupData.findOne({ GuildID: guild.id });
        if (!Data) return;

        if (!Data.Buttons.includes(customId)) return;

        const TicketSetup = await TicketSetupData.findOne({ GuildID: guild.id });

        const logChannel = await guild.channels.cache.get(TicketSetup.Logging);

        


        const ID = Math.floor(Math.random() * 90000) + 10000;

        await guild.channels
            .create(`${interaction.user.tag + "-" + customId + "-" + ID}`, {
                type: "GUILD_TEXT",
                parent: Data.Category,
                permissionOverwrites: [
                    {
                        id: member.id,
                        allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                    },
                    {
                        id: Data.Everyone,
                        deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                    },
                ],
            })
            .then(async (channel) => {
                await DB.create({
                    GuildID: guild.id,
                    MembersID: member.id,
                    TicketID: ID,
                    ChannelID: channel.id,
                    Closed: false,
                    Locked: false,
                    Type: customId,
                    Claimed: false
                });

                const Embed = new MessageEmbed()
                    .setColor("#e9b3f8")
                    .setAuthor({
                        name: `${guild.name} | Ticket: ${ID}`,
                        iconURL: guild.iconURL({ dynamic: true })
                    })
                    .setDescription("Please wait patiently for a response from the Staff team, in the mean while describe your issue in as much detail as possible.")
                    .setFooter({ text: `The buttons below are STAFF ONLY buttons.` });

                const Buttons = new MessageActionRow();
                Buttons.addComponents(
                    new MessageButton()
                        .setCustomId("close")
                        .setLabel("Save & Close Ticket")
                        .setStyle("PRIMARY")
                        .setEmoji("💾"),
                    new MessageButton()
                        .setCustomId("lock")
                        .setLabel("Lock")
                        .setStyle("SECONDARY")
                        .setEmoji("🔒"),
                    new MessageButton()
                        .setCustomId("unlock")
                        .setLabel("Unlock")
                        .setStyle("SUCCESS")
                        .setEmoji("🔓"),
                    new MessageButton()
                        .setCustomId("claim")
                        .setLabel("Claim")
                        .setStyle("PRIMARY")
                        .setEmoji("🛄")
                );


                const openEmbed = new MessageEmbed()
                    .setTitle("Ticket Log")
                    .addFields(
                        { name: "Action", value: "Open", inline: true },
                        { name: "Case", value: `${customId}`, inline: true },
                        { name: "Channel", value: `${channel.name} ( ${channel.id} )` },
                        { name: "Ticket Owner", value: `<@${interaction.user.id}> - ${interaction.user.id}` }
                    )
                    .setFooter("Opening successful")
                    .setColor("GREEN")
                    .setTimestamp()


                channel.send({ embeds: [Embed], components: [Buttons] });
                channel.send({ content: `${member} here is your ticket` }).then((m) => {
                    setTimeout(() => {
                        m.delete().catch(() => { });
                    }, 1 * 5000);
                });

                interaction.reply({ content: `${member} your ticket has been created: ${channel}`, ephemeral: true });
                if (!logChannel == 0) logChannel.send({ embeds: [openEmbed] });
                
            });
    },
};