const { ContextMenuInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "userinfo",
    type: "USER",
    context: true,
    /**
     * 
     * @param {ContextMenuInteraction} interaction 
     */
    async execute(interaction) {
        
        const target = await interaction.guild.members.fetch(interaction.targetId);

        const Response = new MessageEmbed()
            .setColor("AQUA")
            .setAuthor(target.user.tag, target.user.avatarURL({ dynamic: true, size: 512 }))
            .setThumbnail(target.user.avatarURL({ dynamic: true, size: 512 }))
            .setFields(
                { name: "Roles", value: `${target.roles.cache.map(r => r).join(" ").replace("@everyone", "") || "None"}`, inline: true },
                { name: "Member Since", value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: "Discord User Since", value: `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: "Joined at", value: `${target.joinedAt}`, inline: true },
                { name: "Created at", value: `${target.user.createdAt}`, inline: true }
            )
            .setFooter(`ID: ${target.user.id}`)
            
        interaction.reply({ embeds: [Response], ephemeral: true })
    }
}