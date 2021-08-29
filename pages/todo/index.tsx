import { signOut, useSession, getSession } from 'next-auth/client';
import { UserRoles } from '../../types/user.d';
import type { NextPageContext } from 'next';
import { selectDBProps } from '../../lib/helpers';

interface TodoItemInterface {
    id: number,
    done: boolean,
    title: string,
    description: string
};

export default function ToDoList(props: {todos: {data: TodoItemInterface[]}}) {
    const [session] = useSession();

    const todoItem = (item: TodoItemInterface) => {
        const itemKeys = Object.keys(item) as Array<keyof typeof item>;

        return <>
            {
                itemKeys.map((key, index) => <p key={index}>{key}: {`${item[key]}`}</p>)
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
                    props.todos.data.map((item: TodoItemInterface, index: number) => <li key={index}>{todoItem(item)}</li>)
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
        const todos = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todo?${selectDBProps(['id', 'done', 'title', 'description'])}`, {
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
