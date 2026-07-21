import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { clearCsrfToken } from './identity/csrf'

const products = [
  { id: 1, name: 'Everyday Backpack', slug: 'everyday-backpack', description: 'Daily carry.', price: 1899, imageUrl: '/images/products/everyday-backpack.webp', categoryId: 2 },
  { id: 2, name: 'Mechanical Keyboard', slug: 'mechanical-keyboard', description: 'Compact keyboard.', price: 4499, imageUrl: '/images/products/mechanical-keyboard.webp', categoryId: 1 },
  { id: 3, name: 'Wireless Headphones', slug: 'wireless-headphones', description: 'Everyday listening.', price: 2999, imageUrl: '/images/products/wireless-headphones.webp', categoryId: 1 },
]

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    clearCsrfToken()
  })
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('loads catalogue products and persists an item in the bag', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input.toString()
      if (url === '/api/products') return { ok: true, json: async () => products }
      if (url === '/api/auth/me') return { ok: false, status: 401 }
      if (url === '/api/auth/csrf') return { ok: true, json: async () => ({ headerName: 'X-CSRF-TOKEN', token: 'test-token' }) }
      if (url === '/api/carts' && init?.method === 'POST') {
        return { ok: true, json: async () => ({ id: 'cart-1', items: [], totalQuantity: 0, subtotal: 0 }) }
      }
      if (url === '/api/carts/cart-1/items/1' && init?.method === 'PUT') {
        return { ok: true, json: async () => ({
          id: 'cart-1',
          items: [{ productId: 1, name: 'Everyday Backpack', slug: 'everyday-backpack', unitPrice: 1899, imageUrl: products[0].imageUrl, quantity: 1, lineTotal: 1899 }],
          totalQuantity: 1,
          subtotal: 1899,
        }) }
      }
      throw new Error(`Unexpected request: ${init?.method ?? 'GET'} ${url}`)
    }))
    const user = userEvent.setup()
    render(<App />)
    expect(await screen.findByText('Everyday Backpack')).toBeInTheDocument()
    expect(screen.getByText('Mechanical Keyboard')).toBeInTheDocument()
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: 'Add to bag' })[0])
    expect(await screen.findByRole('button', { name: 'Shopping bag with 1 items' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Shopping bag' })).toBeInTheDocument()
    expect(localStorage.getItem('cartcraft.cartId')).toBe('cart-1')
  }, 15000)

  it('signs a customer in and displays their identity', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input.toString()
      if (url === '/api/products') return { ok: true, json: async () => products }
      if (url === '/api/auth/me') return { ok: false, status: 401 }
      if (url === '/api/auth/csrf') return { ok: true, json: async () => ({ headerName: 'X-CSRF-TOKEN', token: 'identity-token' }) }
      if (url === '/api/auth/login' && init?.method === 'POST') {
        return { ok: true, status: 200, json: async () => ({ id: 'customer-1', email: 'divya@example.com', displayName: 'Divya', role: 'CUSTOMER' }) }
      }
      throw new Error(`Unexpected request: ${init?.method ?? 'GET'} ${url}`)
    }))

    const user = userEvent.setup()
    render(<App />)
    await screen.findByRole('heading', { name: 'Everyday Backpack' })
    await user.click(screen.getByRole('button', { name: 'Account' }))
    await user.type(screen.getByLabelText('Email address'), 'divya@example.com')
    await user.type(screen.getByLabelText('Password'), 'SecurePass123!')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByText('Hi, Divya')).toBeInTheDocument()
  }, 15000)
})
