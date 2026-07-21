type CsrfToken = { headerName: string; token: string }

let csrfToken: CsrfToken | null = null

export const ensureCsrfToken = async (): Promise<CsrfToken> => {
  if (csrfToken) return csrfToken
  const response = await fetch(apiRoutes.auth.csrf)
  if (!response.ok) throw new Error('errors.securityUnavailable')
  csrfToken = (await response.json()) as CsrfToken
  return csrfToken
}

export const secureFetch = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> => {
  const csrf = await ensureCsrfToken()
  const headers = new Headers(init.headers)
  headers.set(csrf.headerName, csrf.token)
  return fetch(input, { ...init, headers })
}

export const clearCsrfToken = () => {
  csrfToken = null
}
import { apiRoutes } from '../routes'
