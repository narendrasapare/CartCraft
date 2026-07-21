import { useEffect, useState } from 'react'
import { fetchCurrentCustomer, loginCustomer, logoutCustomer, registerCustomer } from './api'
import type { Customer, IdentityMode } from './types'

export const useIdentity = () => {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [mode, setMode] = useState<IdentityMode>('login')
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCurrentCustomer().then(setCustomer).catch(() => setCustomer(null))
  }, [])

  const open = (nextMode: IdentityMode = 'login') => {
    setMode(nextMode)
    setError(null)
    setIsOpen(true)
  }

  const submit = async (email: string, password: string, displayName?: string) => {
    setIsSubmitting(true)
    setError(null)
    try {
      if (mode === 'register') {
        await registerCustomer(email, displayName ?? '', password)
      }
      setCustomer(await loginCustomer(email, password))
      setIsOpen(false)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Authentication failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const logout = async () => {
    setError(null)
    try {
      await logoutCustomer()
      setCustomer(null)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Sign out failed.')
    }
  }

  return {
    customer,
    error,
    isOpen,
    isSubmitting,
    mode,
    close: () => setIsOpen(false),
    logout,
    open,
    setMode,
    submit,
  }
}
