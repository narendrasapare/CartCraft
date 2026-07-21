export type CartItem = {
  productId: number
  name: string
  slug: string
  unitPrice: number
  imageUrl: string
  quantity: number
  lineTotal: number
}

export type Cart = {
  id: string
  items: CartItem[]
  totalQuantity: number
  subtotal: number
}
