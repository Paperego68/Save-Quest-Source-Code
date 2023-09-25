const axios = require('axios');
const prompt = require('prompt');

const composeMCP = async (operation, profileId, accountId, body, accessToken) => {

    const { data } = await axios({
        method: 'post',
        url: `https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/game/v2/profile/${accountId}/client/${operation}?profileId=${profileId}&rvn=-1`,
        headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(body)
    })
    .catch(e => {  // Error handling
        console.log(e);
        throw new Error('API Error while making API request');
    });

    return data;
};

(async () => {

    console.log('Welcome! Get authorizationCode here: https://www.epicgames.com/id/api/redirect?clientId=3446cd72694c4a4485d81b77adbb2141&responseType=code')

    prompt.start();

	let { question } = await prompt.get([{
		authorizationCode: "input"
	}]);


    const response = await axios({
        method: 'post',
        url: 'https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token',
        headers: {
            Authorization: 'basic MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE=',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: `grant_type=authorization_code&code=${question}`
    })
    .catch(error => {
        throw new Error('Authorization Code is invalid!');
    });

    console.log(`Logged in as ${response.data.displayName}`);
    console.log('Save Quest...')

    await composeMCP('ClientQuestLogin', 'campaign', response.data.account_id, {}, response.data.access_token);

    console.log('✅ Request Saved Successfully!')



})();
