import { fetchUser } from '../../../../api'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'
import Form from './form';

export default async function Page(req) {
    const { id } = req.params;
    const user = await fetchUser(cookies().get('token')?.value) ?? null;

    if (!user)
        redirect('/api/auth');


    const res = await fetch(`http://localhost:3000/api/poll/${id}`, {
        headers: {
            authorization: `Bearer ${cookies().get('token')?.value}`
        }
    });

    const { poll } = await res.json();

    return (
        <Form poll={poll} token={cookies().get('token')?.value} />
    );
}
