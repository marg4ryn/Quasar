import { request } from '@/services/restApi'

export interface RegisterPayload {
  email: string
  password: string
  name: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface User {
  userId: string
  email: string
  name: string
  role: string
}

export async function register(data: RegisterPayload): Promise<User> {
  return request<User>('auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function login(data: LoginPayload): Promise<User> {
  return request<User>('auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function logout(): Promise<void> {
  return request('auth/logout', { method: 'POST' })
}

export function googleAuth(): void {
  window.location.href = '/api/oauth2/authorization/google'
}

export async function getCurrentUser(): Promise<User> {
  return request('user/me')
}
