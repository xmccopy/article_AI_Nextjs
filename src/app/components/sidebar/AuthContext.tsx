'use client'

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { createContext, useState, useEffect, useContext } from 'react';
interface User {
    id: string;
    username: string;
    email: string;
    company: string;
    credits: number;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
    isLoading: boolean;
    updateCredits: (newCredits: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const storedUser = localStorage.getItem('user');
            console.log("------------------", storedUser);

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setIsLoading(false);
        };
        checkUser();
    }, []);

    const updateCredits = (newCredits: number) => {
        setUser(prevUser => prevUser ? { ...prevUser, credits: newCredits } : null);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL!}/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setUser(response.data);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router])

    const setUserAndStore = (newUser: User | null) => {
        setUser(newUser);
        if (newUser) {
            localStorage.setItem('user', JSON.stringify(newUser));
        } else {
            localStorage.removeItem('user');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login')
    }

    return (
        <AuthContext.Provider value={{ user, setUser: setUserAndStore, logout, isLoading, updateCredits }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
