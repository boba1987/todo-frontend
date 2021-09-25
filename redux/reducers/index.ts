import * as t from './types';
import { TodoItemInterface } from '../../pages/todo';

const main = (state = {}, action: {type: string, payload: TodoItemInterface}) => {
    switch (action.type) {
    case t.SAVE_TODO:
        return {
            ...state,
            todo: action.payload
        };
	
    default:
        return {...state};
    }
};

export default main;