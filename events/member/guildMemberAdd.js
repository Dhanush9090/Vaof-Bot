const { MessageEmbed, WebhookClient, GuildMember } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    /**
     * 
     * @param {GuildMember} member 
     */
    execute(member) {

        const { user, guild } = member;

        member.roles.add("930865739093671976");

        const Welcomer = new WebhookClient({
            id: "938735915453517884",
            token: "hf_ONtHjxnxQzAXGvGb4gJPJQ7TBGN-k_shFJ8LTnS2sNOvf1-PVu48BgdWqGuE6H6tE",
        });

        const WelcomeEmbed = new MessageEmbed()
            .setColor("AQUA")
            .setAuthor(user.tag, user.avatarURL({ dynamic: true, size: 512 }))
            .setThumbnail(user.avatarURL({ dynamic: true, size: 512 }))
            .setDescription(`
            Welcome ${member} to the **${guild.name}**!\n
            Account Created: <t:${parseInt(user.createdTimestamp / 1000)}:R>\nLatest Member Count: **${guild.memberCount}**`)
            .setFooter(`ID: ${user.id}`)

        Welcomer.send({ embeds: [WelcomeEmbed] })
    }
}