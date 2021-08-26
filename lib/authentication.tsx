import { signIn, useSession, signOut } from 'next-auth/client';
import React, { useEffect } from 'react';
import axios from '../lib/axios';

function Auth({ children }: { children: JSX.Element }) {
    const [session, loading] = useSession();
    const isUser = !!session?.user;
    useEffect(() => {
        if (loading) return;
        if (!isUser) signIn();
        if (new Date(session?.expires!).getTime() < new Date().getTime()) {
            signOut();
            signIn();
        }
    }, [isUser, loading, session]);

    if (isUser) {
        return children;
    }

    return <div>Loading...</div>;
}

export default Auth;