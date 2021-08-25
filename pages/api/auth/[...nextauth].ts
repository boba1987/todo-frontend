import { NextApiRequest } from 'next';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import {User, UserRoles} from '../../../types/user.d';

export default NextAuth({
    providers: [
        Providers.Credentials({
            name: 'Credentials',
            async authorize(credentials: Record<'password' | 'email', string>, req: NextApiRequest): Promise<User | null> {
                try {
                    // Add logic here to look up the user from the credentials supplied
                    const payload = {...credentials, strategy: process.env.AUTH_STRATEGY};
                    const response = await fetch(`${process.env.BACKEND_URL}/authentication`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });

                    if (response.status == 401) {
                        return null;
                    }

                    const user = await response.json();

                    if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                        return user;
                    } else {
                    // If you return null or false then the credentials will be rejected
                        return null;
                    // You can also Reject this callback with an Error or with a URL:
                    // throw new Error('error message') // Redirect to error page
                    // throw '/path/to/redirect'        // Redirect to a URL
                    }
                } catch (error) {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async redirect(url, baseUrl) {
            return url.startsWith(baseUrl)
                ? url
                : `${baseUrl}${url}`;
        },
        async session(session, token: any) {
            session.accessToken = token.accessToken;
            session.expires = new Date(token.authentication.payload.exp * 1000).toISOString();
            session.user = token.user as User;
            return Promise.resolve(session);
        },
        async jwt(token, user) {
            user && (token = {...token, ...user});
            return Promise.resolve(token);
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        maxAge: 24 * 60 * 60,
        jwt: true
    },
    debug: true
});