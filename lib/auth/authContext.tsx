'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { User, AuthResult, SignUpData, LoginData, IAuthService } from './types'
import { authService as defaultAuthService } from './authService'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signUp: (data: SignUpData) => Promise<AuthResult>
  login: (data: LoginData) => Promise<AuthResult>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
  // Allow injecting a different auth service implementation (dependency inversion)
  authService?: IAuthService
}

export function AuthProvider({ 
  children, 
  authService = defaultAuthService 
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [authService])

  const signUp = useCallback(async (data: SignUpData): Promise<AuthResult> => {
    setIsLoading(true)
    try {
      const result = await authService.signUp(data)
      if (result.success && result.user) {
        setUser(result.user)
      }
      return result
    } finally {
      setIsLoading(false)
    }
  }, [authService])

  const login = useCallback(async (data: LoginData): Promise<AuthResult> => {
    setIsLoading(true)
    try {
      const result = await authService.login(data)
      if (result.success && result.user) {
        setUser(result.user)
      }
      return result
    } finally {
      setIsLoading(false)
    }
  }, [authService])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [authService])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
