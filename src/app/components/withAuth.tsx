import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './sidebar/AuthContext';
import SpinSetting from './Spin';

const withAuth = (WrappedComponent: React.ComponentType) => {
    const Wrapper = (props: any) => {
        const { user, isLoading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!isLoading) {
                if (!user) {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        router.push('/login');
                    } else {
                        // Fetch user data or validate token here if necessary
                    }
                }
            }
        }, [user, router, isLoading]);

        if (isLoading) {
            return (
                <SpinSetting />
            )
        }

        if (!user) {
            return null; // or a loading spinner or message
        }

        return <WrappedComponent {...props} />;
    };

    return Wrapper;
};

export default withAuth;
