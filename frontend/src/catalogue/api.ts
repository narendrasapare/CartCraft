import type { Product } from './types'
import { apiRoutes } from '../routes'

export const fetchProducts = async (signal?: AbortSignal): Promise<Product[]> => {
  const response = await fetch(apiRoutes.products, {
    headers: { Accept: 'application/json' },
    signal,
  })
  if (!response.ok) throw new Error('errors.catalogueLoad')
  return response.json() as Promise<Product[]>
}
