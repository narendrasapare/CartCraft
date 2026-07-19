import { useState, type FormEvent } from 'react'
import type { IdentityMode } from './types'

type IdentityPanelProps = {
  error: string | null
  isOpen: boolean
  isSubmitting: boolean
  mode: IdentityMode
  onClose: () => void
  onModeChange: (mode: IdentityMode) => void
  onSubmit: (email: string, password: string, displayName?: string) => void
}

export const IdentityPanel = ({ error, isOpen, isSubmitting, mode, onClose, onModeChange, onSubmit }: IdentityPanelProps) => {
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(email, password, displayName)
  }

  return <>
    <button className={`identity-backdrop ${isOpen ? 'is-open' : ''}`} aria-label="Close account panel" onClick={onClose} tabIndex={isOpen ? 0 : -1} />
    <aside className={`identity-panel ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen} aria-label="Customer account">
      <div className="identity-panel-header"><div><p className="eyebrow">Customer account</p><h2>{mode === 'login' ? 'Welcome back.' : 'Join CartCraft.'}</h2></div><button type="button" onClick={onClose} aria-label="Close account panel">×</button></div>
      <p className="identity-intro">{mode === 'login' ? 'Sign in to continue with your account.' : 'Create an account for a more personal CartCraft experience.'}</p>
      {error && <p className="identity-error" role="alert">{error}</p>}
      <form className="identity-form" onSubmit={handleSubmit}>
        {mode === 'register' && <label>Display name<input name="displayName" autoComplete="name" minLength={2} maxLength={100} required value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label>}
        <label>Email address<input name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Password<input name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={12} maxLength={72} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {mode === 'register' && <p className="password-guidance">Use at least 12 characters. A password manager is recommended.</p>}
        <button className="identity-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
      </form>
      <button className="identity-switch" type="button" onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'New here? Create an account' : 'Already registered? Sign in'}</button>
    </aside>
  </>
}
