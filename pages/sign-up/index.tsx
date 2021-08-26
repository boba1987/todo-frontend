import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { SyntheticEvent, useState } from 'react';
import { Credentials } from '../../types/auth.d';
import axios from 'axios';
import { BadRequest } from '@feathersjs/errors';

export default function SignIn() {
    const router = useRouter();
    const [error, setError] = useState('');

    const onSubmit = (event: SyntheticEvent): void => {
        event.preventDefault();
        const {email, password} = event.target as typeof event.target & Credentials;
        axios
            .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {email: email.value, password: password.value})
            .then((res: any) => {
                if (res.response?.status >= 400) throw new Error(res.response.data.errors.map((error: BadRequest) => error.message).join('\n'));
                router.push('/todo');
            })
            .catch( err => {
                setError(err.message);
            });
    };

    return (
        <>
            <h2>Sing Up</h2>
            <form method="post" onSubmit={onSubmit}>
                <label>
					Username
                    <input name='email' type='email' required />
                </label>
                <label>
					Password
                    <input name='password' type='password' required />
                </label>
                <button type='submit'>Sign up</button>
            </form>
            {error && <>{ error }<br /></>}
            Already have account? <Link href="/sign-in">Sign in</Link>
        </>
    );
}