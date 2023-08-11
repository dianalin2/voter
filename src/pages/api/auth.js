const { authClient, SCOPE } = require('../../auth-config');

export default async function handler(req, res) {
    const authUri = authClient.authorizeURL({
        redirect_uri: 'http://localhost:3000/api/auth/callback',
        scope: SCOPE
    });

    res.redirect(authUri);
}
