import React from "react";
import Link from "next/link";

export default function Home() {
	return (
		<>
			Welcome to TODO application
			<br />
			<Link href="/sign-in">Sign in</Link>
		</>
	)
}
