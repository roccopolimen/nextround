import { fetcher } from "./fetcher";

export const serverSignIn = async () => {
    return await fetcher.post('/users/signIn');
};

export const serverSignUp = async () => {
    return await fetcher.post('/users/signUp');
};

export const serverSignOut = async () => {
    return await fetcher.get('/users/signOut');
};