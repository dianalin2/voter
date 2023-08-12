import { fetchUser } from '../../../../api'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'
import Form from './form';
import dotenv from 'dotenv';

dotenv.config();

export default async function Page(req) {
    const { id } = req.params;
    const user = await fetchUser(cookies().get('token')?.value) ?? null;

    if (!user)
        redirect('/api/auth?redirect=' + encodeURIComponent(`/poll/${id}/vote`));


    const res = await fetch(`${process.env.BASE_URL}/api/poll/${id}`, {
        headers: {
            authorization: `Bearer ${cookies().get('token')?.value}`
        }
    });

    const { poll } = await res.json();

    return (
        <Form poll={poll} token={cookies().get('token')?.value} baseUrl={process.env.BASE_URL} />
    );
}
