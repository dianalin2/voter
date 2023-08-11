async function fetchUser(token) {
    const fetchRes = await fetch('http://localhost:3000/api/user', {
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
