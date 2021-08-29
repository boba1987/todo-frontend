import { signOut, useSession, getSession } from 'next-auth/client';
import { UserRoles } from '../../types/user.d';
import type { NextPageContext } from 'next';
import { selectDBProps } from '../../lib/helpers';
import Dialog from '@material-ui/core/Dialog';
import React, { useState } from 'react';
import { DialogContent, DialogTitle } from '@material-ui/core';
import { AddTodoForm } from './addTodoForm';
import axios from 'axios';

const SELECT_TODO_FIELDS = ['id', 'done', 'title', 'description'];
interface TodoItemInterface {
    id: number,
    done: boolean,
    title: string,
    description: string
};

export default function ToDoList(props: {todos: {data: TodoItemInterface[]}}) {
    const [session] = useSession();
    const [open, setOpen] = useState(false);
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (fields: {name: string, value: any}[]) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todo`, fields);
            const {data: todos} = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todo?${selectDBProps(SELECT_TODO_FIELDS)}&$sort[createdAt]=-1`);
            props.todos.data = todos.data;
        } catch(error) {
            console.error(error);
        }

        handleClose();
    };

    const todoItem = (item: TodoItemInterface) =>
        <>
            <p>id: {item.id}</p>
            <p>Title: {item.title}</p>
            <p>Description: {item.description}</p>
            <p>Done: {item.done.toString()}</p>
        </>;

    return (
        <>
			Welcome {session?.user?.email}. { session?.user.roles && <>Roles: {session?.user.roles?.join(', ')}</>} <button onClick={() => signOut({callbackUrl: '/'})}>Sign out</button> <br />
            { session?.user.roles?.includes(UserRoles.Admin) && <><button>Edit list as admin</button> <br /></>}
            <button onClick={() => setOpen(true)}>Add todo</button>
            <hr />
			This is your todo list: 
            <ul>
                {
                    props.todos.data.map((item: TodoItemInterface, index: number) => <li key={index}>{todoItem(item)}</li>)
                }
            </ul>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add todo</DialogTitle>
                <DialogContent>
                    {
                        <AddTodoForm onSubmit={handleSubmit} handleClose={handleClose}/>
                    }
                </DialogContent>
            </Dialog>
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
        const todos = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todo?${selectDBProps(SELECT_TODO_FIELDS)}&$sort[createdAt]=-1`, {
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
