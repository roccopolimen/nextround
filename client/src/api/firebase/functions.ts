import firebase from 'firebase/compat/app';

async function doSignIn() {
    const socialProvider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(socialProvider);
}

async function doSignOut() {
    await firebase.auth().signOut();
}

export {
    doSignIn,
    doSignOut
};