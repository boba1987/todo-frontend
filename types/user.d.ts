export enum UserRoles {
	Admin = 'admin',
	RegularUser = 'user'
};

export type User = {
	id: number;
	userName: string;
	email: string;
	roles: UserRoles[];
};