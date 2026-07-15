import type { Product } from './types'

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
const categoryNames: Record<number, string> = { 1: 'Electronics', 2: 'Accessories' }

export const ProductCard = ({ product, onAdd }: { product: Product; onAdd: () => void }) => {
  return <article className="product-card">
    <div className="product-image-wrap"><img src={product.imageUrl} alt={product.name} loading="lazy" /><span className="product-category">{categoryNames[product.categoryId] ?? 'Collection'}</span></div>
    <div className="product-details"><div><h3>{product.name}</h3><p className="product-description">{product.description}</p></div><div className="product-action"><span className="product-price">{currency.format(product.price)}</span><button className="add-button" type="button" onClick={onAdd}>Add to bag</button></div></div>
  </article>
}
