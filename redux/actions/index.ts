import * as t from '../reducers/types';
import {TodoItemInterface} from '../../pages/todo';

export const saveTodo = (payload: TodoItemInterface) => (dispatch: any) => {
    dispatch({
        type: t.SAVE_TODO,
        payload
    });
};