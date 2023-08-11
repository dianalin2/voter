const { User } = require('../../db');

export default async function handler(req, res) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token)
        return res.status(401).json({ error: 'Missing token' });

    let dbUser = await User.findOne({ 'session.token': token });

    if (!dbUser)
        return res.status(401).json({ error: 'Invalid token' });

    if (!dbUser.validateSessionToken(token))
        return res.status(401).json({ error: 'Invalid token' });

    dbUser = await dbUser.populate('polls');

    const fetchRes = await fetch('https://discord.com/api/users/@me', {
        headers: {
            'Authorization': `${dbUser.discordToken.token_type} ${dbUser.discordToken.access_token}`
        }
    });

    const discordUser = await fetchRes.json();

    if (discordUser.code === 0)
        return res.status(401).json({ error: 'Invalid token' });

    return res.status(200).json({
        user: {
            id: dbUser._id,
            token: dbUser.token,
            discordId: discordUser.id,
            username: discordUser.username,
            avatar: discordUser.avatar,
            discriminator: discordUser.discriminator,
            polls: dbUser.polls
        }
    });
}
