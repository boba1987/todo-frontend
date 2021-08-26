import { signIn, signOut } from 'next-auth/client';
import axios from 'axios';

export function handleError(status: number) {
    switch (status) {
    case 401:
        signOut();
        signIn();
        break;
    }
}

axios.interceptors.response.use(
    (res) => {
        return res;
    },
    (err) => {
        handleError(err.response.status);
        return err;
    }
);

export default axios;