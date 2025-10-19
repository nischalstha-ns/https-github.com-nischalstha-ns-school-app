import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { UserAccount } from '../types';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';

interface AuthContextType {
    user: UserAccount | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password?: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserAccount | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser && firebaseUser.email) {
                // User is signed in, find their profile in Firestore.
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("email", "==", firebaseUser.email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const userData = { id: userDoc.id, ...userDoc.data() } as UserAccount;
                    setUser(userData);
                } else {
                    // Firestore profile not found for authenticated user.
                    console.warn(`No profile found for authenticated user: ${firebaseUser.email}`);
                    setUser(null);
                }
            } else {
                // User is signed out.
                setUser(null);
            }
            setIsLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password?: string): Promise<boolean> => {
        if (!password) {
            return false;
        }
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged will handle setting the user state and clearing loading state
            return true;
        } catch (error) {
            console.error("Firebase login failed:", error);
            setIsLoading(false); // Ensure loading is stopped on error
            return false;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            // onAuthStateChanged will handle setting user to null
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};