import { fetcher } from "./fetcher";
import { useQuery } from "react-query";
import { doEmailSignIn, doEmailSignUp, doGoogleSignIn, doSignOut } from "api/firebase/functions";

export const useSignInWithEmail = (email: string, password: string) => {
    return useQuery('signInWithEmail', async () => {
        await doEmailSignIn(email, password);
        const { data, status } = await fetcher.post('/users/signIn');
        if(status === 200) return data;
        await doSignOut();
        throw new Error(`${data.message}\n\n${data.error}`);
    }, { enabled: false });
};

export const useSignInWithGoogle = () => {
    return useQuery('signInWithGoogle', async () => {
        await doGoogleSignIn();
        const { data, status } = await fetcher.post('/users/signIn');
        if(status === 200) return data;
        await doSignOut();
        throw new Error(`${data.message}\n\n${data.error}`);
    }, { enabled: false });
};

export const useSignUpWithEmail = (email: string, password: string, displayName: string) => {
    return useQuery('signUpWithEmail', async () => {
        await doEmailSignUp(email, password, displayName);
        const { data, status } = await fetcher.post('/users/signUp');
        if(status === 200) return data;
        await doSignOut();
        throw new Error(`${data.message}\n\n${data.error}`);
    }, { enabled: false });
};

export const useSignUpWithGoogle = () => {
    return useQuery('signUpWithGoogle', async () => {
        await doGoogleSignIn();
        const { data, status } = await fetcher.post('/users/signUp');
        if(status === 200) return data;
        await doSignOut();
        throw new Error(`${data.message}\n\n${data.error}`);
    }, { enabled: false });
};

export const useSignOut = () => {
    return useQuery('signOut', async () => {
        await doSignOut();
        await fetcher.post('/users/signOut');
    }, { enabled: false });
};