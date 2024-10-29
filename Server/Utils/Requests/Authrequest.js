const {
  Api: { client_id, AuthCodeUrl },
  SteamAccount: { username, password },
} = require("../../Config/config.json");

const { default: puppeteer } = require("puppeteer");
const fs = require("fs");
const authCodeUrl = `https://www.bungie.net/en/oauth/authorize?client_id=${client_id}&response_type=code&state=6i0mkLx79Hp91nzWVeHrzHG4`;
const authCodeRequest = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(authCodeUrl);

    await page.click(
      'a[href="/en/User/SignIn/SteamId?bru=%252Fen%252Foauth%252Fauthorize%253Fclient_id%253D46155%2526response_type%253Dcode%2526state%253D6i0mkLx79Hp91nzWVeHrzHG4&flowStart=1"]'
    );

    const userNameElement = await page.waitForSelector('input[type="text"]');
    const passwordElement = await page.waitForSelector('input[type="password"]');
    await userNameElement.type(username, { delay: 100 });
    await passwordElement.type(password, { delay: 100 });
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    await page.click('input[type="submit"]');

    const getAuthCode = () => {
      return new Promise((resolve, reject) => {
        page.on("response", (response) => {
          if (!response.headers()["location"]) {
            reject("Location header is missing");
            return;
          }

          const status = response.status();
          console.log(response.headers());
          const redirectUrlExists = response.headers()["location"].includes("https://localhost:8000/");
          if (status >= 300 && status <= 399 && redirectUrlExists) {
            console.log("Redirect from", response.url(), "to", response.headers()["location"]);
            const redirectUrl = response.headers()["location"];
            resolve(redirectUrl);
          } else {
            reject("redirecting to specified url failed");
            return;
          }
        });
      });
    };
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

const replaceAuthCode = (authCode) =>
  new Promise((resolve, reject) => {
    const config = Object.assign({}, config);
    config.Api.code = authCode;
    fs.writeFile("Server/Config/config.json", JSON.stringify(config), (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(console.log("Authorization code was replaced in config"));
      }
    });
  });

const getNewAuthCode = async () => {
  try {
    const authCodeFromRequest = await authCodeRequest();
    await replaceAuthCode(authCodeFromRequest);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};
getNewAuthCode();
