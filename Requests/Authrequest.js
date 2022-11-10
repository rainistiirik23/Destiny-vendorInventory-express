const request = require("request");

const fetch = require('node-fetch');
const Authrequest = async () => {
    try {
        const response = await fetch('https://www.bungie.net/en/oauth/authorize?client_id=39169&response_type=code&state=6i0mkLx79Hp91nzWVeHrzHG4',
            {
                method: 'GET',
            });

        const data = await response.text();

        console.log(response.ok);
        console.log(response.status);
        console.log(response.statusText);
        console.log(response);

    }
    catch (error) {
        console.log(error)
    }



};

Authrequest();
