import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'
import { fetchUser } from '../api'
import styles from './page.module.css';

export default async function Home() {
  const user = await fetchUser(cookies().get('token')?.value) ?? null;

  if (!user)
    redirect('/api/auth');

  const pollDivs = user.polls?.map((poll) => (
    <div className={styles.PollDiv} key={poll._id}>
      <h2>
        {poll.title}
      </h2>
      <span>
        <a href={`/poll/${poll._id}/vote`}>
          Vote
        </a>
        &nbsp;•&nbsp;
        <a href={`/poll/${poll._id}/edit`}>
          Edit
        </a>
      </span>
    </div>
  )) || <span>No created polls</span>;

  return (
    <div className={styles.container + ' MainWidth VertCenter'}>
      {
        user ? pollDivs : (
          <div>
            <h2>Not logged in</h2>
          </div>
        )
      }
    </div>
  );
}
