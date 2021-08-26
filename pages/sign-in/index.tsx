import { getCsrfToken, CtxOrReq, signIn } from 'next-auth/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { SyntheticEvent } from 'react';
import { Credentials } from '../../types/auth.d';

export default function SignIn({ csrfToken }: {csrfToken: string}) {
    const errorCodes = {
        'CredentialsSignin': 'Invalid credentials'
    } as { [key: string]: string; };
    const router = useRouter();
    const { error } = router.query;
    const onSubmit = (event: SyntheticEvent): void => {
        event.preventDefault();
        const target = event.target as typeof event.target & Credentials;

        signIn('credentials', { 
            email: target.email.value,
            password: target.password.value,
            callbackUrl: '/todo' 
        });
    };

    return (
        <>
            <h2>Sign In</h2>
            <form method='post' onSubmit={onSubmit}>
                <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
                <label>
					Email
                    <input name='email' type='email' required />
                </label>
                <label>
					Password
                    <input name='password' type='password' required />
                </label>
                <button type='submit'>Sign in</button>
            </form>
            {
                error && errorCodes[error as string]
            }
            <p>Dont have account? <Link href="/sign-up">Sign up</Link></p>
        </>
    );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context: CtxOrReq | undefined) {
    return {
        props: {
            csrfToken: await getCsrfToken(context)
        }
    };
}
