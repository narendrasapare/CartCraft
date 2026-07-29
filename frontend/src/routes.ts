export const routes = {
  home: '/',
  collection: '/#collection',
  principles: '/#principles',
  product: (slug: string) => `/products/${slug}`,
} as const

export const productSlugFromPath = (pathname: string) => {
  const match = pathname.match(/^\/products\/([^/]+)$/)
  return match ? decodeURIComponent(match[1]) : null
}

const apiRoot = '/api'

export const apiRoutes = {
  products: `${apiRoot}/products`,
  product: (slug: string) => `${apiRoot}/products/${encodeURIComponent(slug)}`,
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
