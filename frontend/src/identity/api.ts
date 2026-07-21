import { clearCsrfToken, secureFetch } from './csrf'
import type { Customer } from './types'
import { apiRoutes } from '../routes'

const readCustomer = async (response: Response): Promise<Customer> => {
  if (response.status === 401) throw new Error('errors.invalidCredentials')
  if (response.status === 409) throw new Error('errors.accountExists')
  if (!response.ok) throw new Error('errors.requestFailed')
  return response.json() as Promise<Customer>
}

export const fetchCurrentCustomer = async (): Promise<Customer | null> => {
  const response = await fetch(apiRoutes.auth.currentCustomer)
  if (response.status === 401) return null
  return readCustomer(response)
}

export const registerCustomer = async (
  email: string,
  displayName: string,
  password: string,
): Promise<Customer> =>
  readCustomer(
    await secureFetch(apiRoutes.auth.register, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, displayName, password }),
    }),
  )

export const loginCustomer = async (email: string, password: string): Promise<Customer> =>
  readCustomer(
    await secureFetch(apiRoutes.auth.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),
  )

export const logoutCustomer = async (): Promise<void> => {
  const response = await secureFetch(apiRoutes.auth.logout, { method: 'POST' })
  if (!response.ok) throw new Error('errors.signOut')
  clearCsrfToken()
}
