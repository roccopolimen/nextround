import { serverSignIn, serverSignOut, serverSignUp } from 'api/server';
import firebase from 'firebase/compat/app';

export const doEmailSignUp = async (email: string, password: string, displayName: string) => {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    await firebase.auth().currentUser?.updateProfile({ displayName: displayName });
    try {
        serverSignUp();
    } catch(e: any) {
        console.log(e);
        await doSignOut();
    }
};

export const doEmailSignIn = async (email: string, password: string) => {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    try {
        serverSignIn();
    } catch(e: any) {
        console.log(e);
        await doSignOut();
    }
};

export const doGoogleSignIn = async () => {
    const socialProvider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(socialProvider);
    try {
        serverSignIn();
    } catch(e: any) {
        console.log(e);
        await doSignOut();
    }
};

export const doSignOut = async () => {
    await firebase.auth().signOut();
    await serverSignOut();
};

// TODO: learn linkedin auth work-in since it is not native