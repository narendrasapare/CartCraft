import type { Cart } from './types'
import { secureFetch } from '../identity/csrf'
import { apiRoutes } from '../routes'

const readCart = async (response: Response): Promise<Cart> => {
  if (!response.ok) throw new Error('errors.cartUpdate')
  return response.json() as Promise<Cart>
}

export const createCart = async (): Promise<Cart> =>
  readCart(await secureFetch(apiRoutes.carts, { method: 'POST' }))

export const fetchCart = async (cartId: string, signal?: AbortSignal): Promise<Cart> =>
  readCart(await fetch(apiRoutes.cart(cartId), { signal }))

export const setCartItemQuantity = async (
  cartId: string,
  productId: number,
  quantity: number,
): Promise<Cart> =>
  readCart(
    await secureFetch(apiRoutes.cartItem(cartId, productId), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    }),
  )

export const removeCartItem = async (cartId: string, productId: number): Promise<Cart> =>
  readCart(await secureFetch(apiRoutes.cartItem(cartId, productId), { method: 'DELETE' }))
