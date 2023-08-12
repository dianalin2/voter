const { authClient, SCOPE } = require('../../auth-config');
require('dotenv').config();

export default async function handler(req, res) {
    const authUri = authClient.authorizeURL({
        redirect_uri: `${BASE_URL}/api/auth/callback`,
        scope: SCOPE
    });

    res.redirect(authUri);
}
