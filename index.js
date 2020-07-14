const puppeteer = require("puppeteer"),
    accounts = require("./accounts"),
    { lastContacts, appendContacts } = require("./scripts/googleSheets"),
    extractProfiles = require("./scripts/extractProfiles");

let { sessionCookie, gSheetID } = accounts.users.royMartin;

(async () => {
    try {
        // get last 2 contacts from Google=Sheets
        let gSheetContacts = {};
        gSheetContacts = await lastContacts(gSheetID);

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });

        // robot detection incognito - console.log(navigator.userAgent);
        page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
        );

        await page.setCookie({
            name: "li_at",
            value: sessionCookie,
            domain: "www.linkedin.com/",
        });

        // navigate to linkedIn connectiosn page
        await page.goto("https://www.linkedin.com/mynetwork/invite-connect/connections/", {
            waitUntil: "networkidle2",
        });
        console.log(`Logged in as ${gSheetContacts.user}`);

        // check if first connection is record in GoogleSheets
        let lastContact = await page.evaluate(() => {
            let [contact] = document.querySelectorAll(".mn-connection-card__details > a");
            return contact.href;
        });

        if (lastContact !== (gSheetContacts.lastContact || gSheetContacts.secondLastContact)) {
            // collect array of contacts urls
            let contactProfiles = await extractProfiles(page, gSheetContacts);
            contactProfiles.reverse();

            // close browser
            await browser.close();
            console.log("Browser closed");

            // append contacts to Google-Sheets
            await appendContacts(gSheetID, contactProfiles);
        } else {
            console.log("No new friends");
        }
    } catch (error) {
        console.log(`linkedInScraper.js error = ${error}`);

        // take screenshot to analyze problem
        // await page.screenshot({ path: "./image.jpg", type: "jpeg" });
    }
})();
