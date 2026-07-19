import { clearCsrfToken, secureFetch } from './csrf'
import type { Customer } from './types'

const readCustomer = async (response: Response): Promise<Customer> => {
  if (response.status === 401) throw new Error('The email or password is incorrect.')
  if (response.status === 409) throw new Error('An account already exists for this email.')
  if (!response.ok) throw new Error('We could not complete that request. Please try again.')
  return response.json() as Promise<Customer>
}

export const fetchCurrentCustomer = async (): Promise<Customer | null> => {
  const response = await fetch('/api/auth/me')
  if (response.status === 401) return null
  return readCustomer(response)
}

export const registerCustomer = async (email: string, displayName: string, password: string): Promise<Customer> =>
  readCustomer(await secureFetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, displayName, password }),
  }))

export const loginCustomer = async (email: string, password: string): Promise<Customer> =>
  readCustomer(await secureFetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }))

export const logoutCustomer = async (): Promise<void> => {
  const response = await secureFetch('/api/auth/logout', { method: 'POST' })
  if (!response.ok) throw new Error('We could not sign you out. Please try again.')
  clearCsrfToken()
}
