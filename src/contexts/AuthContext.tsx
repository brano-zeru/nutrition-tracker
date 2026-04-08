'use client';

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react';
import { UserDetails, UserDTO } from '@/types';
import { fetchApi } from '@/services/fetchApi';

interface AuthContextType {
    user: UserDTO | null;
    setUser: (user: UserDTO | null) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { user } = await fetchApi<{
                    message: string;
                    user: UserDTO;
                }>('/api/auth/me', 'GET');
                if (user) setUser(user);
            } catch {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isAuthenticated: !!user,
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
