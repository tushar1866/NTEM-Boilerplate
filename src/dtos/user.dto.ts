export type CreateUserDTO = {
    name: string;
    email: string;
    password: string;
};
export type UpdateUserDTO = {
    name?: string;
    email?: string;
    password?: string;
    isEmailVerified?: boolean;
};
