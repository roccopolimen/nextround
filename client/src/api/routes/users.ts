import { useQuery, UseQueryResult } from "react-query";
import { fetcher } from "api/fetcher";
import { doEmailSignIn, doEmailSignUp, doGoogleSignIn, doSignOut } from "api/firebase/functions";
import { Failure, UserObject } from "typings";

/**
 * @description retrieves information on the currently signed in user.
 * @returns the current user's information
 * @throws if fails
 */
export const useGetUser = (): UseQueryResult<UserObject> => {
    return useQuery('getUser', async () => {
        const { data, status } = await fetcher.get<UserObject | Failure>('/users');
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return (data as UserObject);
    });
};

/**
 * @description POST /users/signIn with email & password
 * @param {string} email 
 * @param {string} password 
 * @returns {UseQueryResult<boolean>} true on success, throws if fails
 */
export const useSignInWithEmail = (email: string, password: string): UseQueryResult<boolean> => {
    return useQuery('signInWithEmail', async () => {
        await doEmailSignIn(email, password);
        try {
            const { status } = await fetcher.post<Failure>('/users/signIn');
            if(status === 200) return true;
        } catch(e) {
            await doSignOut();
            throw new Error('could not log in');
        }
    });
};

/**
 * @description POST /users/signIn with Google Auth
 * @returns {UseQueryResult<boolean>} true on success, throws if fails
 */
export const useSignInWithGoogle = (): UseQueryResult<boolean> => {
    return useQuery('signInWithGoogle', async () => {
        await doGoogleSignIn();
        try {
            const { status } = await fetcher.post<Failure>('/users/signIn');
            if(status === 200) return true;
        } catch(e) {
            await doSignOut();
            throw new Error('could not log in');
        }
    });
};

/**
 * @description POST /users/signUp with email & password
 * @param {string} email 
 * @param {string} password 
 * @param {string} displayName
 * @returns {UseQueryResult<boolean>} true on success, throws if fails
 */
export const useSignUpWithEmail = (email: string, password: string, displayName: string): UseQueryResult<boolean> => {
    return useQuery('signUpWithEmail', async () => {
        await doEmailSignUp(email, password, displayName);
        try {
            const { status } = await fetcher.post<Failure>('/users/signUp');
            if(status === 200) return true;
        } catch(e) {
            await doSignOut();
            throw new Error('could not sign up');
        }
    });
};

/**
 * @description POST /users/signUp with Google Auth
 * @returns {UseQueryResult<boolean>} true on success, throws if fails
 */
export const useSignUpWithGoogle = (): UseQueryResult<boolean> => {
    return useQuery('signUpWithGoogle', async () => {
        await doGoogleSignIn();
        try {
            const { status } = await fetcher.post<Failure>('/users/signUp');
            if(status === 200) return true;
        } catch(e) {
            await doSignOut();
            throw new Error('could not sign up');
        }
    });
};

/**
 * @description POST /users/signOut
 * @returns {UseQueryResult<boolean>} true on success, throws if fails
 */
export const useSignOut = (): UseQueryResult<boolean> => {
    return useQuery('signOut', async () => {
        await doSignOut();
        const { data, status } = await fetcher.get<Failure>('/users/signOut');
        if(status !== 200) throw new Error(`${data.message}\n\n${data.error}`);
        return true;
    });
};

/**
 * @description DELETE /users
 * @returns {UseQueryResult<boolean>}
 */
export const useDeleteUser = (): UseQueryResult<boolean> => {
    return useQuery('deleteUser', async () => {
        const { data, status } = await fetcher.delete<Failure>('/users');
        if(status !== 200) throw new Error(`${data.message}\n\n${data.error}`);
        return true;
    });
};