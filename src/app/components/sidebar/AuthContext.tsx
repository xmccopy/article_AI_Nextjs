'use client'

import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface User {
    username: string;
    email: string;
    credits: number;
    image: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
    isLoading: boolean;
    updateCredits: (newCredits: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userString = searchParams.get('user');
        const backendTokensString = searchParams.get('backendTokens');
        const imageUrl = searchParams.get('image');

        if (userString && backendTokensString && imageUrl) {
            const userInfor = JSON.parse(decodeURIComponent(userString));
            const backendTokens = JSON.parse(decodeURIComponent(backendTokensString));

            localStorage.setItem('token', backendTokens.accessToken);
            localStorage.setItem('user', JSON.stringify(userInfor));
            localStorage.setItem('backendTokens', JSON.stringify(backendTokens));

            setUser(userInfor);
            router.push('/kwgenerate');
        } else {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) {
                setIsLoading(false); // No token, stop loading
                // router.push('/login'); // Redirect to login
            } else {
                fetchUserData(storedToken);
            }
        }
    }, [searchParams, router]);

    const fetchUserData = async (token: string) => {
        try {
            const response = await axios.get<User>(`${process.env.NEXT_PUBLIC_API_URL!}/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            router.push('/register');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token && !isLoading && !user) {
            router.push('/register');
        }

    }, [user, isLoading, router]);

    const setUserAndStore = (newUser: User | null) => {
        setUser(newUser);
        if (newUser) {
            localStorage.setItem('user', JSON.stringify(newUser));
        } else {
            localStorage.removeItem('user');
        }
    };


    const updateCredits = (newCredits: number) => {
        setUser(prevUser => prevUser ? { ...prevUser, credits: newCredits } : null);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, setUser: setUserAndStore, logout, isLoading, updateCredits }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
