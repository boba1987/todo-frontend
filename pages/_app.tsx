import '../lib/axios';
import { Provider } from 'next-auth/client';
import React from 'react';
import Auth from '../lib/authentication';

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
