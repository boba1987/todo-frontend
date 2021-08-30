import { TextField } from '@material-ui/core';
import React from 'react';
import { Button, DialogActions } from '@material-ui/core';

export function AddTodoForm(props: {
    onSubmit: (fields: {[key: string]: string}) => void, 
    handleClose: () => void, 
    errors?: {[key: string]: string}
}) {
    function onSubmit(event: any) {
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
                <TextField id="todo-form-title" name="title" label="Title" required error={!!props.errors?.title} helperText={props.errors?.title} />
            </div>
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