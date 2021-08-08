import { Provider, signIn, useSession } from "next-auth/client";
import React, { useEffect } from "react";

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
	)
}

function Auth({ children }: { children: JSX.Element }) {
	const [session, loading] = useSession();
	const isUser = !!session?.user;
	useEffect(() => {
		if (loading) return // Do nothing while loading
		if (!isUser) signIn() // If not authenticated, force log in
	}, [isUser, loading])

	if (isUser) {
		return children
	}

	// Session is being fetched, or no user.
	// If no user, useEffect() will redirect.
	return <div>Loading...</div>
}