const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "serverinfo",
    description: "Displays info about the server",
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    execute(interaction) {
        const { guild } = interaction;

        const { createdTimestamp, ownerId, members, memberCount, channels, emojis, stickers } = guild;

        const Embed = new MessageEmbed()
            .setColor("PURPLE")
            .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                {
                    name: "GENERAL",
                    value: [
                        `Name: ${guild.name}`,
                        `Created: <t:${parseInt(createdTimestamp / 1000)}:R>`,
                        `Owner: <@${ownerId}>`,
                    ].join("\n"),
                    inline: true
                },
                {
                    name: "💡  |  USERS",
                    value: [
                        `- Members: ${members.cache.filter((m) => !m.user.bot).size}`,
                        `- Bots: ${members.cache.filter((m) => m.user.bot).size}`,
                        `- Roles: ${guild.roles.cache.size}`,
                        ``,
                        `Total: ${memberCount}`
                    ].join("\n"),
                    inline: true
                },
                {
                    name: "📔  |  CHANNELS",
                    value: [
                        `- Text: ${channels.cache.filter((c) => c.type === "GUILD_TEXT").size}`,
                        `- Voice: ${channels.cache.filter((c) => c.type === "GUILD_VOICE").size}`,
                        `- Threads: ${channels.cache.filter((c) => c.type === "GUILD_NEWS_THREAD" && "GUILD_PUBLIC_THREAD" && "GUILD_PRIVATE_THREAD").size}`,
                        `- Categories: ${channels.cache.filter((c) => c.type === "GUILD_CATEGORY").size}`,
                        `- Stages: ${channels.cache.filter((c) => c.type == "GUILD_STAGE_VOICE").size}`,
                        `- News: ${channels.cache.filter((c) => c.type === "GUILD_NEWS").size}`,
                        ``,
                        `Total: ${channels.cache.size}`
                    ].join("\n"),

                },

                {
                    name: "😁  |  EMOJIS & STICKERS",
                    value: [

                        `- Animated: ${emojis.cache.filter((e) => e.animated).size}`,
                        `- Static: ${emojis.cache.filter((e) => !e.animated).size}`,
                        `- Stickers: ${stickers.cache.size}`,
                        ``,
                        `Total: ${stickers.cache.size + emojis.cache.size}`
                    ].join("\n"),
                    inline: true
                },
                {
                    name: "✨  |  NITRO STATISTICS",
                    value: [
                        `- Tier: ${guild.premiumTier.replace("TIER_", "")}`,
                        `- Boosts: ${guild.premiumSubscriptionCount}`,
                        `- Boosters: ${members.cache.filter((m) => m.premiumSince).size}`,
                    ].join("\n"),
                    inline: true
                }
            )
            .setFooter("Last Checked")
            .setTimestamp()


        interaction.reply({ embeds: [Embed] })
    }
}