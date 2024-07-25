import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/sidebar/AuthContext';
import SpinSetting from './Spin';

const withAuth = (WrappedComponent: React.ComponentType) => {
    const Wrapper: React.FC = (props) => {
        const user = useAuth();
        const router = useRouter();
        useEffect(() => {
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/login');
            }
        }, [router]);

        return <WrappedComponent {...props} />;
    };

    return Wrapper;
};

export default withAuth;
