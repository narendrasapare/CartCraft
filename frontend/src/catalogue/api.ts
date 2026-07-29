import type { Product, ProductPage, ProductQuery } from './types'
import { apiRoutes } from '../routes'

export const fetchProducts = async (
  productQuery: ProductQuery,
  signal?: AbortSignal,
): Promise<ProductPage> => {
  const searchParams = new URLSearchParams({
    page: productQuery.page.toString(),
    size: productQuery.size.toString(),
    sort: productQuery.sort,
  })
  if (productQuery.query) searchParams.set('query', productQuery.query)
  if (productQuery.categoryId) searchParams.set('categoryId', productQuery.categoryId.toString())

  const response = await fetch(`${apiRoutes.products}?${searchParams}`, {
    headers: { Accept: 'application/json' },
    signal,
  })
  if (!response.ok) throw new Error('errors.catalogueLoad')
  return response.json() as Promise<ProductPage>
}

export const fetchProduct = async (slug: string, signal?: AbortSignal): Promise<Product> => {
  const response = await fetch(apiRoutes.product(slug), {
    headers: { Accept: 'application/json' },
    signal,
  })
  if (response.status === 404) throw new Error('errors.productNotFound')
  if (!response.ok) throw new Error('errors.catalogueLoad')
  return response.json() as Promise<Product>
}
