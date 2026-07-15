import type { Product } from './types'

export const fetchProducts = async (signal?: AbortSignal): Promise<Product[]> => {
  const response = await fetch('/api/products', { headers: { Accept: 'application/json' }, signal })
  if (!response.ok) throw new Error('We could not load the collection. Please try again.')
  return response.json() as Promise<Product[]>
}
