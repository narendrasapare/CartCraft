import { useState, type SubmitEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { IdentityMode } from './types'
import { appConfig } from '../config'

type IdentityPanelProps = {
  error: string | null
  isOpen: boolean
  isSubmitting: boolean
  mode: IdentityMode
  onClose: () => void
  onModeChange: (mode: IdentityMode) => void
  onSubmit: (email: string, password: string, displayName?: string) => void
}

export const IdentityPanel = ({
  error,
  isOpen,
  isSubmitting,
  mode,
  onClose,
  onModeChange,
  onSubmit,
}: IdentityPanelProps) => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(email, password, displayName)
  }

  return (
    <>
      <button
        className={`identity-backdrop ${isOpen ? 'is-open' : ''}`}
        aria-label={t('account.close')}
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
      />
      <aside
        className={`identity-panel ${isOpen ? 'is-open' : ''}`}
        aria-hidden={!isOpen}
        aria-label={t('account.panel')}
      >
        <div className="identity-panel-header">
          <div>
            <p className="eyebrow">{t('account.panel')}</p>
            <h2>{mode === 'login' ? t('account.welcome') : t('account.join')}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label={t('account.close')}>
            ×
          </button>
        </div>
        <p className="identity-intro">
          {mode === 'login' ? t('account.loginIntro') : t('account.registerIntro')}
        </p>
        {error && (
          <p className="identity-error" role="alert">
            {error}
          </p>
        )}
        <form className="identity-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              {t('account.displayName')}
              <input
                name="displayName"
                autoComplete="name"
                minLength={appConfig.limits.displayName.minLength}
                maxLength={appConfig.limits.displayName.maxLength}
                required
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />
            </label>
          )}
          <label>
            {t('account.email')}
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            {t('account.password')}
            <input
              name="password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={appConfig.limits.password.minLength}
              maxLength={appConfig.limits.password.maxLength}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {mode === 'register' && <p className="password-guidance">{t('account.passwordHelp')}</p>}
          <button className="identity-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? t('account.waiting')
              : mode === 'login'
                ? t('account.signIn')
                : t('account.create')}
          </button>
        </form>
        <button
          className="identity-switch"
          type="button"
          onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? t('account.createPrompt') : t('account.signInPrompt')}
        </button>
      </aside>
    </>
  )
}
