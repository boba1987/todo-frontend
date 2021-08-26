import Link from 'next/link';
import React, { SyntheticEvent, useState } from 'react';
import { Credentials } from '../../types/auth.d';
import axios from 'axios';
import { BadRequest } from '@feathersjs/errors';
import { signIn } from 'next-auth/client';

export default function SignIn() {
    const [error, setError] = useState('');

    const onSubmit = async (event: SyntheticEvent): Promise<void> => {
        event.preventDefault();
        const {email, password} = event.target as typeof event.target & Credentials;

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {email: email.value, password: password.value});
            signIn();
        } catch (error) {
            setError(error.data.errors.map((error: BadRequest)=> error.message).join('\n'));
        }
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
            {error && <>{ error } <br /></>}
            <p>Already have account? <Link href="/sign-in">Sign in</Link></p>
        </>
    );
}