import { getCsrfToken, CtxOrReq, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';

export default function SignIn({ csrfToken }: {csrfToken: string}) {
    const errorCodes = {
        'CredentialsSignin': 'Invalid credentials'
    } as { [key: string]: string; };
    const router = useRouter();
    const { error } = router.query;
    const onSubmit = (event: any): void => {
        event.preventDefault();
        signIn('credentials', { 
            username: event.target.username.value,
            password: event.target.password.value,
            callbackUrl: '/todo' 
        });
    };

    return (
        <>
            <form method='post' onSubmit={onSubmit}>
                <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
                <label>
					Username
                    <input name='username' type='text' />
                </label>
                <label>
					Password
                    <input name='password' type='password' />
                </label>
                <button type='submit'>Sign in</button>
            </form>
            {
                error && errorCodes[error as string]
            }
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
