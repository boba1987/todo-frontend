import { signOut, useSession, getSession } from 'next-auth/client';
import { UserRoles } from '../../types/user.d';
import type { NextPageContext } from 'next';
import { selectDBProps } from '../../lib/helpers';
import Dialog from '@material-ui/core/Dialog';
import React, { useState } from 'react';
import { DialogContent, DialogTitle } from '@material-ui/core';
import { FormBody } from '../../lib/formBody';
import axios from 'axios';
import { connect } from 'react-redux';
import { saveTodo } from '../../redux/actions';

const SELECT_TODO_FIELDS = ['id', 'done', 'title', 'description'];
const SORT_ORDER = '$sort[createdAt]=-1';
export interface TodoItemInterface {
    id: number,
    done: boolean,
    title: string,
    description: string
};

export default function ToDoList(props: {todos: {data: TodoItemInterface[]}}) {
    const [session] = useSession();
    const [open, setOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [serverErrors, setServerErrors] = useState([]);
    const fields = [
        {
            id: 'todo-form-title',
            name:'title',
            label:'Title',
            required: true,
            validator: (value: string) => {
                if (!value.trim()) throw 'title field is required';
                return true;
            }
        },
        {
            id: 'todo-form-description',
            name: 'description',
            label:'Description',
            multiline: true,
            rows: 4
        }
    ];
    
    function handleClose() {
        setOpen(false);
        setValidationErrors({});
        setServerErrors([]);
    };

    async function handleSubmit (fields: {values: {[key: string]: string}, errors: {[key: string]: string}}) {
        if (Object.keys(fields.errors).length) {
            setValidationErrors(fields.errors);
            return;
        }

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todo`, fields.values);
            const {data: todos} = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todo?${selectDBProps(SELECT_TODO_FIELDS)}&${SORT_ORDER}`);
            props.todos.data = todos.data;
            handleClose();
        } catch(error: any) {
            setServerErrors(
                error.data.errors.map((error: {message: String}) => error.message)
            );
        }
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
			Welcome {session?.user?.email}. { session?.user.roles && <>Roles: {session?.user.roles?.join(', ')}</>} 
            <button onClick={() => signOut({callbackUrl: '/'})}>Sign out</button> <br />

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
                        <FormBody onSubmit={handleSubmit} handleClose={handleClose} errors={validationErrors} fields={fields}/>
                    }
                    {
                        serverErrors && <div style={{color: 'red', maxWidth: 174, textAlign: 'center'}}>{serverErrors}</div>
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
        const todos = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todo?${selectDBProps(SELECT_TODO_FIELDS)}&${SORT_ORDER}`, {
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
