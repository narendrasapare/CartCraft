export type Customer = {
  id: string
  email: string
  displayName: string
  role: 'CUSTOMER'
}

export type IdentityMode = 'login' | 'register'
