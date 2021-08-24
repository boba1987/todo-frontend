import Link from 'next/link';
import React, { SyntheticEvent } from 'react';
import { Credentials } from '../../types/auth.d';

export default function SignIn() {
    const onSubmit = (event: SyntheticEvent): void => {
        event.preventDefault();
        const target = event.target as typeof event.target & Credentials;

        console.log({
            username: target.email.value,
            password: target.password.value
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

            Already have account? <Link href="/sign-in">Sign in</Link>
        </>
    );
}