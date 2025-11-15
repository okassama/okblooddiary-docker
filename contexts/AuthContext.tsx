import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    OAuthProvider,
    sendPasswordResetEmail,
    UserCredential,
    deleteUser as deleteFirebaseAuthUser,
} from 'firebase/auth';
import { auth, firebaseConfigExists } from '../services/firebase';
import * as firestoreService from '../services/firestoreService';

const LOCAL_MODE_KEY = 'ok-blood-diary-local-mode';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    isLocalMode: boolean;
    firebaseEnabled: boolean;
    signup: (email: string, pass: string) => Promise<UserCredential>;
    login: (email: string, pass: string) => Promise<UserCredential>;
    logout: () => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    loginWithApple: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    continueLocally: () => void;
    deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const firebaseEnabled = firebaseConfigExists;

    // Only enter local mode if the user has explicitly chosen it.
    const [isLocalMode, setIsLocalMode] = useState(() => {
        try {
            // If firebase isn't configured, the UI will be disabled, but we still show the AuthPage first.
            return localStorage.getItem(LOCAL_MODE_KEY) === 'true';
        } catch {
            return false; // Default to cloud mode / auth screen
        }
    });
    
    const ensureAuth = () => {
        if (!auth) {
            // This error will be caught by the UI forms if initialization failed
            throw new Error("Firebase is not configured or failed to initialize. Cloud functions are unavailable.");
        }
        return auth;
    }

    const signup = (email: string, pass: string) => {
        setIsLocalMode(false);
        localStorage.removeItem(LOCAL_MODE_KEY);
        return createUserWithEmailAndPassword(ensureAuth(), email, pass);
    };

    const login = (email: string, pass: string) => {
        setIsLocalMode(false);
        localStorage.removeItem(LOCAL_MODE_KEY);
        return signInWithEmailAndPassword(ensureAuth(), email, pass);
    };

    const logout = () => {
        if (!auth) return Promise.resolve();
        setIsLocalMode(false);
        localStorage.removeItem(LOCAL_MODE_KEY);
        return signOut(ensureAuth());
    };
    
    const socialSignIn = async (provider: GoogleAuthProvider | OAuthProvider) => {
        setIsLocalMode(false);
        localStorage.removeItem(LOCAL_MODE_KEY);
        await signInWithPopup(ensureAuth(), provider);
    };

    const loginWithGoogle = () => socialSignIn(new GoogleAuthProvider());
    const loginWithApple = () => socialSignIn(new OAuthProvider('apple.com'));
    
    const resetPassword = (email: string) => {
        return sendPasswordResetEmail(ensureAuth(), email);
    }
    
    const deleteAccount = async () => {
        const authInstance = ensureAuth();
        if (authInstance.currentUser) {
            // First, delete all associated Firestore data
            await firestoreService.deleteUser(authInstance.currentUser.uid);
            // Then, delete the Firebase Auth user
            await deleteFirebaseAuthUser(authInstance.currentUser);
        } else {
            throw new Error("No user is currently signed in to delete.");
        }
    };
    
    const continueLocally = () => {
        setIsLocalMode(true);
        try {
            localStorage.setItem(LOCAL_MODE_KEY, 'true');
        } catch (e) {
            console.error("Could not save local mode preference", e);
        }
        setCurrentUser(null); // No user in local mode
    };


    useEffect(() => {
        // If the user has chosen local mode, we don't need to check for auth.
        if (isLocalMode) {
            setCurrentUser(null);
            setLoading(false);
            return;
        }
        
        // If Firebase isn't configured (or failed to init), and we are not in local mode,
        // we stay on the AuthPage. We can stop the loading indicator.
        if (!auth) {
            setLoading(false);
            return;
        }

        // Firebase is available, and we are not in local mode. Listen for auth changes.
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
        
    }, [isLocalMode]);

    const value: AuthContextType = {
        currentUser,
        loading,
        isLocalMode,
        firebaseEnabled,
        signup,
        login,
        logout,
        loginWithGoogle,
        loginWithApple,
        resetPassword,
        continueLocally,
        deleteAccount,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};