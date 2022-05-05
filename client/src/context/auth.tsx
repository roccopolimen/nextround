import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import firebase from 'firebase/compat/app';
import firebaseApp from 'api/firebase';

export type AuthContent = firebase.User | null;
export const AuthContext = createContext<AuthContent>(null);
export const useAuthContext = () => useContext(AuthContext);

interface PropType { children: ReactNode };
export const AuthProvider = ({ children }: PropType) => {
    const [user, setUser] = useState<AuthContent>(null);

    useEffect(() => {
        firebaseApp.auth().onAuthStateChanged((newUser) => {
            setUser(newUser);
        });
    }, []);

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
};