export type Product = {
  id: number
  name: string
  slug: string
  description: string
  price: number
  imageUrl: string
  categoryId: number
}

export type ProductPage = {
  items: Product[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export type ProductSort = 'NAME' | 'PRICE_ASC' | 'PRICE_DESC' | 'NEWEST'

export type ProductQuery = {
  categoryId?: number
  page: number
  query: string
  size: number
  sort: ProductSort
}
