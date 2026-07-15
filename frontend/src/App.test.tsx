import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const products = [
  { id: 1, name: 'Everyday Backpack', slug: 'everyday-backpack', description: 'Daily carry.', price: 1899, imageUrl: '/images/products/everyday-backpack.webp', categoryId: 2 },
  { id: 2, name: 'Mechanical Keyboard', slug: 'mechanical-keyboard', description: 'Compact keyboard.', price: 4499, imageUrl: '/images/products/mechanical-keyboard.webp', categoryId: 1 },
  { id: 3, name: 'Wireless Headphones', slug: 'wireless-headphones', description: 'Everyday listening.', price: 2999, imageUrl: '/images/products/wireless-headphones.webp', categoryId: 1 },
]

describe('App', () => {
  afterEach(() => vi.restoreAllMocks())

  it('loads catalogue products and updates the bag', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => products }))
    const user = userEvent.setup()
    render(<App />)
    expect(await screen.findByText('Everyday Backpack')).toBeInTheDocument()
    expect(screen.getByText('Mechanical Keyboard')).toBeInTheDocument()
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: 'Add to bag' })[0])
    expect(screen.getByRole('button', { name: 'Shopping bag with 1 items' })).toBeInTheDocument()
  })
})
