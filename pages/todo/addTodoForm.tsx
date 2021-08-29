import { TextField } from '@material-ui/core';
import React from 'react';
import { Button, DialogActions } from '@material-ui/core';

export function AddTodoForm(props: {onSubmit: (fields: any) => void, handleClose: () => void}) {
    const onSubmit = (event: any) => {
        event.preventDefault();
        props.onSubmit(
            [...event.target.elements].map((field: any) => field.name ? {name: field.name, value: field.value} : false).filter(Boolean)
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