import { signOut, useSession, getSession } from 'next-auth/client';
import { UserRoles } from '../../types/user.d';
import type { NextPageContext } from 'next';
export default function ToDoList(props: any) {
    const [session] = useSession();

    const todoItem = (item: any) => {
        const itemKeys = Object.keys(item);

        return <>
            {
                itemKeys.map((key: string) => <p key={key}>{key}: {`${item[key]}`}</p>)
            }
        </>;
    }; 

    return (
        <>
			Welcome {session?.user?.email}. { session?.user.roles && <>Roles: {session?.user.roles?.join(', ')}</>} <button onClick={() => signOut({callbackUrl: '/'})}>Sign out</button> <br />
            { session?.user.roles?.includes(UserRoles.Admin) && <><button>Edit list as admin</button> <br /></>}
			This is your todo list: 
            <ul>
                {
                    props.todos.data.map((item: any) => <li key={item.id}>{todoItem(item)}</li>)
                }
            </ul>
        </>
    );
};

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession({req: context.req});
    const pageProps = {
        props: {
            todos: []
        }
    };

    try {
        const todos = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todo`, {
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        });
        pageProps.props = {
            todos: await todos.json()
        };
    } catch (error) {
        console.error(error);
    }

    return pageProps;
};

ToDoList.auth = true;
