require('dotenv').config();

async function fetchUser(token) {
    const fetchRes = await fetch(`${process.env.BASE_URL}/api/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    });

    const { user } = await fetchRes.json();

    return user;
}

export { fetchUser };
