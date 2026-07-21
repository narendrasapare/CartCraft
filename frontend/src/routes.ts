export const routes = {
  home: '#top',
  collection: '#collection',
  principles: '#principles',
} as const

const apiRoot = '/api'

export const apiRoutes = {
  products: `${apiRoot}/products`,
  carts: `${apiRoot}/carts`,
  cart: (cartId: string) => `${apiRoot}/carts/${cartId}`,
  cartItem: (cartId: string, productId: number) => `${apiRoot}/carts/${cartId}/items/${productId}`,
  auth: {
    csrf: `${apiRoot}/auth/csrf`,
    currentCustomer: `${apiRoot}/auth/me`,
    register: `${apiRoot}/auth/register`,
    login: `${apiRoot}/auth/login`,
    logout: `${apiRoot}/auth/logout`,
  },
} as const
