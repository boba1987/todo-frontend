import { TextField } from '@material-ui/core';
import React from 'react';
import { Button, DialogActions } from '@material-ui/core';

interface FieldInterface {
    id: string,
    name: string,
    label: string,
    type?: string,
    required?: boolean,
    error?: boolean,
    helperText?: string,
    multiline?: boolean,
    rows?: number,
    validator?: (value: string) => boolean | string
}

export function FormBody(props: {
    onSubmit: (fields: {values: {[key: string]: string}, errors: {[key: string]: string}}) => void, 
    handleClose: () => void, 
    errors?: {[key: string]: string},
    fields: FieldInterface[]
}) {
    function onSubmit(event: any) {
        event.preventDefault();
        props.onSubmit(
            [...event.target].reduce((accumulator, current)=> {
                if (!current.name) return accumulator;

                const field = props.fields.find(field => field.name === current.name)!;

                if (field.validator) {
                    try {
                        field.validator(current.value);
                    } catch (error) {
                        accumulator.errors = {
                            ...accumulator.errors,
                            [current.name]: error
                        };
                    }
                }

                accumulator.values[current.name] = current.value;
                return accumulator;
            }, {values: {}, errors: {}})
        );
    };

    function renderInputFields(fields: FieldInterface[]) {
        const resolveInputType = (field: FieldInterface)=> {
            switch (field.type) {
            default:
                return <TextField 
                    id={field.id} 
                    name={field.name} 
                    label={field.label} 
                    required={field.required} 
                    error={props.errors && !!props.errors[field.name]} 
                    helperText={props.errors && props.errors[field.name]} 
                    multiline={field.multiline}
                    rows={field.rows}
                />;
            }
        };

        return fields.map((field: any, index: number) => (
            <div key={index}>
                {
                    resolveInputType(field)
                }
            </div>
        ));
    }

    return <>
        <form noValidate autoComplete="off" onSubmit={onSubmit}>
            {
                renderInputFields(props.fields)
            }
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