const { default: puppeteer } = require("puppeteer");
const fs = require("fs");

const readConfig = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("Server/Config/config.json", (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(JSON.parse(result));
    });
  });
};
const authCodeRequest = async (client_id, username, password) => {
  try {
    const authCodeUrl = `https://www.bungie.net/en/oauth/authorize?client_id=${client_id}&response_type=code&state=6i0mkLx79Hp91nzWVeHrzHG4`;
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

    await page.evaluate(
      (selector) => document.querySelector(selector).click(),
      'button[class="DjSvCZoKKfoNSmarsEcTS"]'
    );
    await page.waitForNavigation(),
      await page.evaluate((selector) => document.querySelector(selector).click(), 'input[id="imageLogin"]');

    const getAuthCode = () => {
      return new Promise((resolve, reject) => {
        page.on("response", (response) => {
          /*
            Page recieves multiple response events,
            the one we want has the "location" header.
            */
          if (!response.headers()["location"]) {
            return;
          }
          const status = response.status();
          const redirectUrlExists = response.headers()["location"].includes("https://localhost:8000/");
          /*
          Response has to have status code 302,
          The HTTP 302 Found redirection response status code indicates that the requested resource has been temporarily moved to the URL in the Location header.
          A browser receiving this status will automatically request the resource at the URL in the Location header,
          redirecting the user to the new page.
          Redirect url will have the authorization code
          */
          if (status >= 300 && status <= 399 && redirectUrlExists) {
            console.log("Redirect from", response.url(), "to", response.headers()["location"]);
            const redirectUrl = response.headers()["location"];
            resolve(redirectUrl);
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

const replaceAuthCode = (authCode, config) =>
  new Promise((resolve, reject) => {
    const configClone = Object.assign({}, config);
    configClone.Api.code = authCode;
    fs.writeFile("Server/Config/config.json", JSON.stringify(configClone), (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(console.log("Authorization code was replaced in config"));
      }
    });
  });
async function AuthRequest() {
  try {
    const config = await readConfig();

    const {
      Api: { client_id },
      SteamAccount: { username, password },
    } = config;
    const authCodeFromRequest = await authCodeRequest(client_id, username, password);
    await replaceAuthCode(authCodeFromRequest, config);
  } catch (error) {
    console.log(error);
  }
}

module.exports = AuthRequest;
