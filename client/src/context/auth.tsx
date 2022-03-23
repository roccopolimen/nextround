import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import firebase from 'firebase/compat/app';
import firebaseApp from 'api/firebase';
import Loading from 'pages/Loading';

export type AuthContent = firebase.User | null;
export const AuthContext = createContext<AuthContent>(null);
export const useAuthContext = () => useContext(AuthContext);

interface PropType { children: ReactNode };
export const AuthProvider = ({ children }: PropType) => {
    const [user, setUser] = useState<AuthContent>(null);
    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {
        setLoading(true);
        firebaseApp.auth().onAuthStateChanged((newUser) => {
            setUser(newUser);
            setLoading(false);
        });
    }, []);

    if(loading) return  <Loading />;
    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
};