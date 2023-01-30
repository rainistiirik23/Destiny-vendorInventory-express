const request = require("request");
const { client_id, password, username } = require('../Config/config.json')
const fetch = require('node-fetch');
const { default: puppeteer, HTTPResponse, HTTPRequest } = require("puppeteer");
const fs = require('fs');
const authCodeRequest = async () => {
    try {
        const url = `https://www.bungie.net/en/oauth/authorize?client_id=${client_id}&response_type=code&state=6i0mkLx79Hp91nzWVeHrzHG4`;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        await page.click('a[href="/en/User/SignIn/SteamId?bru=%252Fen%252Foauth%252Fauthorize%253Fclient_id%253D42688%2526response_type%253Dcode%2526state%253D6i0mkLx79Hp91nzWVeHrzHG4&flowStart=1"]');
        const loginUrl = await page.url();
        const userNameElement = await page.waitForSelector('input[class="newlogindialog_TextInput_2eKVn"][type="text"]');
        const passwordElement = await page.waitForSelector('input[class="newlogindialog_TextInput_2eKVn"][type="password"]');
        await userNameElement.type(username, { delay: 100 });
        await passwordElement.type(password, { delay: 100 });
        await page.click('button[class="newlogindialog_SubmitButton_2QgFE"][type="submit"]');
        await page.waitForNavigation();
        await page.click('input[id="imageLogin"][type="submit"]')
        const getAuthCode = () => {
            return (
                new Promise((resolve, reject) => {
                    page.on('response', response => {
                        const status = response.status()
                        const redirectUrlExists = response.headers()['location'].includes('https://localhost:3000/')
                        if ((status >= 300) && (status <= 399) && (redirectUrlExists)) {
                            console.log('Redirect from', response.url(), 'to', response.headers()['location'])
                            const redirectUrl = response.headers()['location'];
                            resolve(redirectUrl);
                        }
                    });
                }));
        }
        let authCode = await getAuthCode();

        authCode = authCode.slice(29, 61);
        console.log(authCode);
        browser.close();
        return authCode;

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};


const getConfig = () => {
    return (
        new Promise((resolve, reject) => {
            fs.readFile('Config/config.json', 'utf8', (err, res) => {
                const resultAsJson = JSON.parse(res)
                if (err) {
                    reject(err);
                }
                else {
                    resolve(resultAsJson)
                }
            });
        }));
};
const replaceAuthCode = (config, authCode) => new Promise((resolve, reject) => {
    config['code'] = authCode;
    fs.writeFile('Config/config.json', JSON.stringify(config), (err, result) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(console.log('Authorization code was replaced in config'));
        }
    })
});
const getNewAuthCode = async () => {
    try {
        const Config = await getConfig();
        const authCodeFromRequest = await authCodeRequest();
        await replaceAuthCode(Config, authCodeFromRequest);
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit();
    }
}
getNewAuthCode();
