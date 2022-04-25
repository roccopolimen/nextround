import firebase from 'firebase/compat/app';
import firebaseApp from '.';

export const doEmailSignUp = async (email: string, password: string, displayName: string): Promise<void> => {
    await firebaseApp.auth().createUserWithEmailAndPassword(email, password);
    await firebaseApp.auth().currentUser?.updateProfile({ displayName: displayName });
};

export const doEmailSignIn = async (email: string, password: string): Promise<void> => {
    await firebaseApp.auth().signInWithEmailAndPassword(email, password);
};

export const doGoogleSignIn = async (): Promise<void> => {
    const socialProvider = new firebase.auth.GoogleAuthProvider();
    await firebaseApp.auth().signInWithPopup(socialProvider);
};

export const doSignOut = async (): Promise<void> => {
    await firebaseApp.auth().signOut();
};