import { NextApiRequest } from 'next';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import {User, UserRoles} from '../../../types/user.d';

export default NextAuth({
	providers: [
		Providers.Credentials({
			name: 'Credentials',
			async authorize(credentials: Record<"password" | "username", string>, req: NextApiRequest): Promise<User | null> {
				// Add logic here to look up the user from the credentials supplied
				const users = [
					{ 
						id: 1,
						userName: 'boba',
						fullName: 'Boba Dj',
						email: 'boba@example.com',
						roles: [
							UserRoles.Admin,
							UserRoles.RegularUser
						],  
						accessToken: 'aysfy8ho282gqtbfwioG08we98sag98sibsbgaw4btkmxzbc',
						refreshToken: '98y89asg9usbgnq0238risjdosbdafibuig'
					},
					{ 
						id: 2,
						userName: 'jsmith',
						fullName: 'J Smith',
						email: 'jsmith@example.com',
						roles: [
							UserRoles.RegularUser
						],
						accessToken: 'aysfy8ho282gqtbfwioG08we98sag98sibsbgaw4btkmxzbc',
						refreshToken: '98y89asg9usbgnq0238risjdosbdafibuig'
					}
				];

				const userFound = users.find(user => credentials.username === user.userName );

				if (userFound) {
				  // Any object returned will be saved in `user` property of the JWT
					return userFound;
				} else {
				  // If you return null or false then the credentials will be rejected
					return null;
				  // You can also Reject this callback with an Error or with a URL:
				  // throw new Error('error message') // Redirect to error page
				  // throw '/path/to/redirect'        // Redirect to a URL
				}
			}
		})
	],
	callbacks: {
		async redirect(url, baseUrl) {
			return url.startsWith(baseUrl)
				? url
				: `${baseUrl}${url}`
		},
		async session(session, token) {
			session.accessToken = token.accessToken
			session.refreshToken = token.refreshToken
			session.user = token.user as User;
			return Promise.resolve(session)
		},
		async jwt(token, user, account) {
			if (account?.accessToken) {
				token.accessToken = account.accessToken
			}
			if (account?.refreshToken) {
				token.refreshToken = account.refreshToken
			}
			
			user && (token.user = user);
			return Promise.resolve(token);
		}
	},
	pages: {
		signIn: '/sign-in'
	}
});