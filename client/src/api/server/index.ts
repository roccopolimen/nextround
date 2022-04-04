import { fetcher } from "./fetcher";
import firebase from 'firebase/compat/app';

export const serverSignIn = async () => {
    return await fetcher.post('/users/signIn');
};

export const serverSignUp = async (userCredentials: firebase.auth.UserCredential) => {
    return await fetcher.post<firebase.auth.UserCredential>('/users/signUp', userCredentials);
};

export const serverSignOut = async () => {
    return await fetcher.post('/users/signOut');
};