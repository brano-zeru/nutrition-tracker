// Auth types - following SOLID dependency inversion principle
// These interfaces allow swapping implementations without changing consumers

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
}

export interface SignUpData {
  email: string
  password: string
  name: string
}

export interface LoginData {
  email: string
  password: string
}

// Abstract interface for auth service - any implementation must follow this contract
export interface IAuthService {
  signUp(data: SignUpData): Promise<AuthResult>
  login(data: LoginData): Promise<AuthResult>
  logout(): Promise<void>
  getCurrentUser(): User | null
}
