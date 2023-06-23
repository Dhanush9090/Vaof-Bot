const { MessageEmbed, Message, WebhookClient } = require("discord.js");

module.exports = {
    name: "messageDelete",
    /**
     * 
     * @param {Message} Message 
     */
    execute(message) {
        if (message.author.bot) return;

        const Log = new MessageEmbed()
            .setColor("RED")
            .setDescription(` A [message](${message.url}) was **deleted** in ${message.channel} by ${message.author}.\n 
        **Deleted Message(s):**\n ${message.content ? message.content : "None"}`.slice(0, 4096) )
            .setFooter(`Member: ${message.author.tag} | ID: ${message.author.id}`);

        if (message.attachments.size >= 1) {
            Log.addField(`Attachments:`, `${message.attachments.map(a => a.url)}`, true)
        }

        new WebhookClient({ url: "" }
        ).send({ embeds: [Log] }).catch((err) => console.log(err));
    }
}
