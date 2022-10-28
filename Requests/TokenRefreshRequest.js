const fs = require('fs');
const request = require("request");
const credentials = require('../Config/config.json')
const { ApiKey, client_id, client_secret, refresh_token } = credentials

/* While it's possible to log in again and again to bungie.net with the account to get the access token and make a VendorRequest,
rather let's use the refresh token to get the access token,without having to log in for each VendorRequest.
NB!! refresh token has an expiration date of 90 days,after that you will  have to log in again.
*/
const X = btoa(client_id + ":" + client_secret);

const postRequest = () => new Promise((resolve, reject) => {
    request.post({
        url: 'https://www.bungie.net/Platform/App/OAuth/Token/',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-API-Key': ApiKey,
            'Authorization': 'Basic ' + X,
        },
        form: {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,

        }

    }, (err, res, body) => {
        const bodyAsJSon = JSON.parse(body);
        if (err) {
            reject(err);
        }
        else {
            resolve(bodyAsJSon);
        }
    });
});

const readTokenConfig = () => {
    return (
        fs.readFileSync('Config/config.json', 'utf8', (err, res) => {

            if (err) {
                console.log(err);
            }

        }));
};
const writeTokens = Tokens => new Promise((resolve, reject) => {
    fs.writeFile('Config/config.json', JSON.stringify(Tokens), (err, result) => {
        if (err) {
            reject(err);
        }
        else {
            resolve('Tokens are written');
        }
    })
});

const refreshToken = async () => {
    try {
        const tokensFromRequest = await postRequest();
        const tokenFromConfig = JSON.parse(readTokenConfig());
        tokenFromConfig['access_token'] = tokensFromRequest['access_token']
        tokenFromConfig[' refresh_token'] = tokensFromRequest[' refresh_token']
        await writeTokens(tokenFromConfig);

    }
    catch (err) {
        console.log(err);
    }
}
refreshToken();
