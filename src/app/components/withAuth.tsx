import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/sidebar/AuthContext';
import SpinSetting from './Spin';

const withAuth = (WrappedComponent: React.ComponentType) => {
    const Wrapper: React.FC = (props) => {
        const { user, isLoading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!isLoading && !user) {
                router.push('/login');
            }
        }, [user, router, isLoading]);

        if (isLoading) {
            return <SpinSetting />;
        }

        if (!user) {
            return null; // or a loading spinner or message
        }

        return <WrappedComponent {...props} />;
    };

    return Wrapper;
};

export default withAuth;
