const { model, Schema } = require("mongoose");

module.exports = model("TicketSetup", new Schema({
    GuildID: String,
    Buttons: [String],
    Category: String,
    Channel: String,
    Description: String,
    Everyone: String,
    Handlers: String,
    Transcripts: String,
    Logging: String,
}));