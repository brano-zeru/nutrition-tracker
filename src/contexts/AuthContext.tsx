'use client';

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react';
import { UserDetails } from '@/types';
import { fetchApi } from '@/services/fetchApi';

interface AuthContextType {
    userDetails: UserDetails | null;
    setUserDetails: (user: UserDetails | null) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { userDetails } = await fetchApi<{
                    message: string;
                    userDetails: UserDetails;
                }>('/api/auth/me', 'GET');
                if (userDetails) setUserDetails(userDetails);
            } catch {
                setUserDetails(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                userDetails,
                setUserDetails,
                isAuthenticated: !!userDetails,
                isLoading,
            }}
        >
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
