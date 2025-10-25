import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, auth } from '../firebaseConfig';
import { UserAccount } from '../types';
// Fix: Use scoped firebase packages for consistency.
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User as FirebaseUser } from '@firebase/auth';
import { collection, query, where, getDocs } from '@firebase/firestore';


interface AuthContextType {
    user: UserAccount | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (identifier: string, password?: string) => Promise<true | string>;
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

    const login = async (identifier: string, password?: string): Promise<true | string> => {
        if (!password || !identifier) {
            return "Username and password are required.";
        }
        setIsLoading(true);

        try {
            let userEmail = identifier;

            // If the identifier doesn't look like an email, assume it's a name and find the corresponding email.
            if (!identifier.includes('@')) {
                const usersRef = collection(db, "users");
                // Use an efficient, case-insensitive query against the 'searchableName' field.
                const q = query(usersRef, where("searchableName", "==", identifier.toLowerCase()));
                const querySnapshot = await getDocs(q);
                
                if (querySnapshot.empty) {
                    const errorMessage = `No user found with the name "${identifier}". Please use your exact full name or your email address.`;
                    console.error("Login failed:", errorMessage);
                    setIsLoading(false);
                    return errorMessage;
                }

                if (querySnapshot.size > 1) {
                    // This is an edge case if names aren't unique, but good to handle.
                    const errorMessage = `Ambiguous login: Multiple users found with the name "${identifier}". Please use your email or contact an administrator.`;
                    console.error("Login failed:", errorMessage);
                    setIsLoading(false);
                    return errorMessage;
                }
                
                userEmail = querySnapshot.docs[0].data().email;
            }

            await signInWithEmailAndPassword(auth, userEmail, password);
            // onAuthStateChanged will handle setting the user state and clearing loading state
            return true;
        } catch (error) {
            console.error("Firebase login failed:", error);
            setIsLoading(false);
            return "Invalid username/email or password.";
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