import { serverSignIn, serverSignOut, serverSignUp } from 'api/server';
import firebase from 'firebase/compat/app';

export const doEmailSignUp = async (email: string, password: string, displayName: string) => {
    const userCreds: firebase.auth.UserCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    firebase.auth().currentUser?.updateProfile({displayName: displayName});
    try {
        serverSignUp(userCreds);
    } catch(e: any) {
        console.log(e);
        await doSignOut();
    }
};

export const doEmailSignIn = async (email: string, password: string) => {
    const userCreds: firebase.auth.UserCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    try {
        serverSignIn();
    } catch(e: any) {
        console.log(e);
        await doSignOut();
    }
};

export const doGoogleSignIn = async () => {
    const socialProvider = new firebase.auth.GoogleAuthProvider();
    const userCreds: firebase.auth.UserCredential = await firebase.auth().signInWithPopup(socialProvider);
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