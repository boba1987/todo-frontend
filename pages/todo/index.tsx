import { signOut, useSession } from 'next-auth/client';
import { UserRoles } from '../../types/user.d';

export default function ToDoList() {
    const [session] = useSession();

    return (
        <>
			Welcome {session?.user?.userName}. Roles: {session?.user?.roles.join(', ')} <button onClick={() => signOut({callbackUrl: '/'})}>Sign out</button> <br />
            { session?.user?.roles.includes(UserRoles.Admin) && <><button>Edit list as admin</button> <br /></>}
			This is your todo list:
        </>
    );
};

ToDoList.auth = true;
