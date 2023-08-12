const { authClient, SCOPE } = require('../../auth-config');
require('dotenv').config();

export default async function handler(req, res) {
    const redirect = req.query.redirect ?? '/';

    const authUri = authClient.authorizeURL({
        redirect_uri: `${process.env.BASE_URL}/api/auth/callback`,
        scope: SCOPE,
        state: JSON.stringify({ redirect })
    });

    res.redirect(authUri);
}
