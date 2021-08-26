import { signIn, signOut, getSession } from 'next-auth/client';
import axios from 'axios';

export function handleAuthError(status: number) {
    switch (status) {
    case 401:
        signOut();
        signIn();
        break;
    }
}

(async ()=> {
    const session = await getSession();
    axios.defaults.headers.common = {'Authorization': `Bearer ${session?.accessToken}`};
	
    axios.interceptors.response.use(
        (res) => {
            return res;
        },
        (err) => {
            handleAuthError(err.response.status);
            return err;
        }
    );
})();

export default axios;