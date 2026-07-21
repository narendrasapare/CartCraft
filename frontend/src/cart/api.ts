import type { Cart } from './types'
import { secureFetch } from '../identity/csrf'

const readCart = async (response: Response): Promise<Cart> => {
  if (!response.ok) throw new Error('We could not update your bag. Please try again.')
  return response.json() as Promise<Cart>
}

export const createCart = async (): Promise<Cart> => readCart(await secureFetch('/api/carts', { method: 'POST' }))

export const fetchCart = async (cartId: string, signal?: AbortSignal): Promise<Cart> =>
  readCart(await fetch(`/api/carts/${cartId}`, { signal }))

export const setCartItemQuantity = async (cartId: string, productId: number, quantity: number): Promise<Cart> =>
  readCart(await secureFetch(`/api/carts/${cartId}/items/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  }))

export const removeCartItem = async (cartId: string, productId: number): Promise<Cart> =>
  readCart(await secureFetch(`/api/carts/${cartId}/items/${productId}`, { method: 'DELETE' }))
