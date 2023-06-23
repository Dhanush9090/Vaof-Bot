const { MessageEmbed, WebhookClient, GuildMember } = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    /**
     * 
     * @param {GuildMember} member 
     */
    execute(member) {

        const { user, guild } = member;

        const Logger = new WebhookClient({
            id: "939216494439567462",
            token: "vYJD8ejFWKTS7saBPprY4PbDG_BmYhehXI2B5-YFwbMK6vlhwEiAQMrSsGDs6M2EtLcC",
        });

        const LoggerEmbed = new MessageEmbed()
            .setColor("RED")
            .setAuthor(user.tag, user.avatarURL({ dynamic: true, size: 512 }))
            .setThumbnail(user.avatarURL({ dynamic: true, size: 512 }))
            .setDescription(`
            ${member} has left the server.\n
            Joined: <t:${parseInt(member.joinedTimestamp / 1000)}:R>\nLatest Member Count: **${guild.memberCount}**`)
            .setFooter(`ID: ${user.id}`)

        Logger.send({ embeds: [LoggerEmbed] })
    }
}