require('dotenv').config();

const SCOPE = 'identify';

const authConfig = {
    client: {
        id: process.env.CLIENT_ID,
        secret: process.env.CLIENT_SECRET,
    },
    auth: {
        tokenHost: process.env.TOKEN_HOST,
        tokenPath: process.env.TOKEN_PATH,
        revokePath: process.env.REVOKE_PATH,
        authorizePath: process.env.AUTHORIZE_PATH,
    }
}

const { AuthorizationCode } = require('simple-oauth2');

const authClient = new AuthorizationCode(authConfig);

module.exports = {
    authClient,
    SCOPE
};
