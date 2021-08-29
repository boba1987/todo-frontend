import { TextField } from '@material-ui/core';
import React from 'react';
import { Button, DialogActions } from '@material-ui/core';

export function AddTodoForm(props: {onSubmit: (fields: any) => void, handleClose: () => void}) {
    const onSubmit = (event: any) => {
        event.preventDefault();
        props.onSubmit(
            [...event.target].reduce((accumulator, current)=> {
                if (!current.name) return accumulator;

                accumulator[current.name] = current.value;
                return accumulator;
            }, {})
        );
    };

    return <>
        <form noValidate autoComplete="off" onSubmit={onSubmit}>
            <div>
                <TextField id="todo-form-title" name="title" label="Title" />
            </div>
            <br />
            <div>
                <TextField id="todo-form-description" name="description" label="Description" multiline rows={4}/>
            </div>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                        Cancel
                </Button>
                <Button type="submit" color="primary">
                        Add
                </Button>
            </DialogActions>
        </form>
    </>;
}