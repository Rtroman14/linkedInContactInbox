const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user: String,
    lastRuntime: Date.now,
    sessionCookie: String,
    googleSheetID: Number,
    contacts: {
        contactsToScrape: Array,
        scrapedContacts: [
            {
                firstName: String,
                lastName: String,
                job: String,
                city: String,
                company: String,
                email: String,
                phone: String,
                profile: String,
                connected: String,
                birthday: String,
            },
        ],
    },
});

module.exports = mongoose.model("User", userSchema);
