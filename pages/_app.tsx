import { Provider, signIn, useSession } from 'next-auth/client';
import React, { useEffect } from 'react';
import axios from 'axios';

// For GET requests
axios.interceptors.request.use(
    (req) => {
        // Add configurations here
        console.log('Get Successfully');
        return req;
    },
    (err) => {
        return Promise.reject(err);
    }
);

// For POST requests
axios.interceptors.response.use(
    (res) => {
        // Add configurations here
        if (res.status === 201) {
            console.log('Posted Successfully');
        }
        return res;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export default function MyApp(
    { Component, pageProps }: { Component: any, pageProps: any }
): JSX.Element {
    return (
        <Provider session={pageProps.session}>
            {Component.auth ? (
                <Auth>
                    <Component {...pageProps} />
                </Auth>
            ) : (
                <Component {...pageProps} />
            )}
        </Provider>
    );
}

function Auth({ children }: { children: JSX.Element }) {
    const [session, loading] = useSession();
    const isUser = !!session?.user;
    useEffect(() => {
        if (loading) return; // Do nothing while loading
        if (!isUser) signIn(); // If not authenticated, force log in
    }, [isUser, loading]);

    if (isUser) {
        return children;
    }

    // Session is being fetched, or no user.
    // If no user, useEffect() will redirect.
    return <div>Loading...</div>;
}