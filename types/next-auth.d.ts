import NextAuth from "next-auth"
import {UserRoles} from './user';

declare module "next-auth" {
	/**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
	interface Session {
		user: {
			id: number;
			userName: string;
			email: string;
			roles: UserRoles[];
		}
	}
}