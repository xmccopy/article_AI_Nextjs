// 'use client'

// import axios from 'axios';
// import { useRouter, useSearchParams } from 'next/navigation';
// import React, { createContext, useState, useEffect, useContext } from 'react';
// interface User {
//     id: string;
//     username: string;
//     email: string;
//     company: string;
//     credits: number;
// }

// interface AuthContextType {
//     user: User | null;
//     setUser: (user: User | null) => void;
//     logout: () => void;
//     isLoading: boolean;
//     updateCredits: (newCredits: number) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const router = useRouter();
//     const [user, setUser] = useState<User | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const searchParams = useSearchParams();

//     const token = searchParams.get('token');
//     console.log('token', token)
//     if (token) {
//       // Save the token to local storage
//       localStorage.setItem('token', token);

//       // Redirect to the desired page
//       router.push('/kwgenerate'); // Change to your desired page
//     } else {
//       // Check if token is already in local storage
//       const storedToken = localStorage.getItem('token');
//       if (!storedToken) {
//         // If no token, redirect to login
//         router.push('/login');
//       }
//     }
//     useEffect(() => {
//         const checkUser = async () => {

//             const storedUser = localStorage.getItem('user');
//             console.log("------------------", storedUser);

//             if (storedUser) {
//                 setUser(JSON.parse(storedUser));
//             }
//             setIsLoading(false);
//         };
//         checkUser();
//     }, []);

//     const updateCredits = (newCredits: number) => {
//         setUser(prevUser => prevUser ? { ...prevUser, credits: newCredits } : null);
//     };

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 console.log("authcontext", token);

//                 if (!token) {
//                     throw new Error('No authentication token found');
//                 }

//                 const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL!}/user`, {
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 });
//                 console.log("auth_user", response.data)

//                 setUser(response.data);
//             } catch (error) {
//                 console.error('Failed to fetch user:', error);
//             }
//         };

//         fetchUser();
//     }, []);

//     useEffect(() => {
//         if (!isLoading && !user) {
//             router.push('/login');
//         }
//     }, [user, isLoading, router])

//     const setUserAndStore = (newUser: User | null) => {
//         setUser(newUser);
//         if (newUser) {
//             localStorage.setItem('user', JSON.stringify(newUser));
//         } else {
//             localStorage.removeItem('user');
//         }
//     };

//     const logout = () => {
//         setUser(null);
//         localStorage.removeItem('user');
//         localStorage.removeItem('token');
//         router.push('/login')
//     }

//     return (
//         <AuthContext.Provider value={{ user, setUser: setUserAndStore, logout, isLoading, updateCredits }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     const context = useContext(AuthContext);

//     if (context === undefined) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };


'use client'

import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userString = searchParams.get('user');
        const backendTokensString = searchParams.get('backendTokens');

        if (userString && backendTokensString) {
            // Parse the JSON strings
            const userInfor = JSON.parse(decodeURIComponent(userString));
            const backendTokens = JSON.parse(decodeURIComponent(backendTokensString));

            // Save the tokens and user info to local storage
            localStorage.setItem('token', backendTokens.accessToken);
            localStorage.setItem('user', JSON.stringify(userInfor));
            localStorage.setItem('backendTokens', JSON.stringify(backendTokens));

            // Update the user state
            setUser(userInfor);

            // Redirect to the desired page
            router.push('/kwgenerate');
        } else {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) {
                router.push('/login');
            } else {
                // Fetch user data if token exists in local storage
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
            router.push('/login');
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
        if (!isLoading && !user) {
            router.push('/login');
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
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('backendTokens');
        router.push('/login');
    };

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
