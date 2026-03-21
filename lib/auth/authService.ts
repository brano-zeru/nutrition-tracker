// In-memory auth service implementation
// This can be swapped for a real auth provider (Supabase, Firebase, etc.) later
// by implementing the IAuthService interface

import { IAuthService, User, AuthResult, SignUpData, LoginData } from './types'

interface StoredUser extends User {
  passwordHash: string
}

// Simple hash function for demo purposes - in production use bcrypt or similar
function simpleHash(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString(16)
}

class InMemoryAuthService implements IAuthService {
  private users: StoredUser[] = []
  private currentUser: User | null = null

  async signUp(data: SignUpData): Promise<AuthResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Check if user already exists
    const existingUser = this.users.find(u => u.email.toLowerCase() === data.email.toLowerCase())
    if (existingUser) {
      return {
        success: false,
        error: 'An account with this email already exists'
      }
    }

    // Validate password strength
    if (data.password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters'
      }
    }

    // Create new user
    const newUser: StoredUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      email: data.email.toLowerCase(),
      name: data.name,
      passwordHash: simpleHash(data.password),
      createdAt: new Date()
    }

    this.users.push(newUser)
    
    // Auto login after signup
    const { passwordHash: _, ...userWithoutPassword } = newUser
    this.currentUser = userWithoutPassword

    return {
      success: true,
      user: userWithoutPassword
    }
  }

  async login(data: LoginData): Promise<AuthResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const user = this.users.find(u => u.email.toLowerCase() === data.email.toLowerCase())
    
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password'
      }
    }

    if (user.passwordHash !== simpleHash(data.password)) {
      return {
        success: false,
        error: 'Invalid email or password'
      }
    }

    const { passwordHash: _, ...userWithoutPassword } = user
    this.currentUser = userWithoutPassword

    return {
      success: true,
      user: userWithoutPassword
    }
  }

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200))
    this.currentUser = null
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }
}

// Export a singleton instance - this can be replaced with a different implementation
export const authService: IAuthService = new InMemoryAuthService()
