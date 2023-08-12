const { authClient, SCOPE } = require('../../../auth-config');
const { User } = require('../../../db');

require('dotenv').config();

export default async function handler(req, res) {
    const tokenParams = {
        code: req.query.code,
        redirect_uri: `${process.env.BASE_URL}/api/auth/callback`,
        scope: SCOPE
    }

    try {
        const accessToken = await authClient.getToken(tokenParams);

        const discordUser = await (await fetch('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `${accessToken.token.token_type} ${accessToken.token.access_token}`
            },
        })).json();

        const dbUser = (await User.findOne({ discordId: discordUser.id })) ?? (
            await User.create({
                discordId: discordUser.id,
                polls: [],
                discordToken: accessToken.token,
            })
        );

        // update discord token
        dbUser.discordToken = accessToken.token;
        await dbUser.save();

        if (!dbUser.session || !dbUser.validateSessionToken(dbUser.session.token))
            await dbUser.generateSessionToken();

        res.setHeader('Set-Cookie', `token=${dbUser.session.token}; Path=/; HttpOnly`);
        res.redirect('/');
    } catch (error) {
        console.log('Access Token Error', error.message);
    }
}
