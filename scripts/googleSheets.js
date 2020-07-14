require("dotenv").config();

const { GoogleSpreadsheet } = require("google-spreadsheet");

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);

// exports.googleSheets = async (gSheetID, scriptType) => {
// exports.lastContacts = async (gSheetID) => {
let lastContacts = async (gSheetID) => {
    try {
        let gSheet = {};
        await doc.useServiceAccountAuth(require("../google-sheets-api/keys.json"));

        await doc.loadInfo();
        let sheet = doc.sheetsById[gSheetID];

        await sheet.loadCells("A:A");
        let lastContactRow = sheet.cellStats.nonEmpty;
        let secondLastContactRow = sheet.cellStats.nonEmpty - 1;

        // if (secondLastContactRow < 1) {
        //     gSheet.lastContact = sheet.getCellByA1(`A${lastContactRow}`).formattedValue;
        //     gSheet.secondLastContact = "";
        // } else {
        //     gSheet.lastContact = sheet.getCellByA1(`A${lastContactRow}`).formattedValue;
        //     gSheet.secondLastContact = sheet.getCellByA1(`A${secondLastContactRow}`).formattedValue;
        // }
        console.log(sheet.title);
        console.log(lastContactRow);
        console.log(secondLastContactRow);

        // gSheet.user = sheet.title;
        return gSheet;
    } catch (error) {
        console.log(`Error while retrieving last contacts from Google-Sheets = ${error}`);
    }
};

exports.appendContacts = async (gSheetID, contactProfiles) => {
    try {
        await doc.useServiceAccountAuth(require("../google-sheets-api/keys.json"));
        await doc.loadInfo();
        let sheet = doc.sheetsById[gSheetID];

        // wait 1 second before appending each contact to Google-Sheets
        for (const contactProfile of contactProfiles) {
            await new Promise((r) => setTimeout(r, 1000));
            await sheet.addRow([contactProfile], (error) => {
                console.log(`Error appending contacts to Google-Sheets = ${error}`);
            });
        }
    } catch (error) {
        console.log(`Error appending contacts to Google-Sheets = ${error}`);
    }
};

lastContacts(0);
