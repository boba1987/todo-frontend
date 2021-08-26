import { signIn, signOut } from 'next-auth/client';
import axios, { AxiosResponse } from 'axios';

export function handleError(status: number) {
    switch (status) {
    case 401:
        signOut();
        signIn();
        break;
    }
}

axios.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (err) => {
        handleError(err.response.status);
        return Promise.reject(err.response);
    }
);

export default axios;