import type { Cart } from './types'

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

type CartDrawerProps = {
  cart: Cart | null
  error: string | null
  isOpen: boolean
  isUpdating: boolean
  onClose: () => void
  onRemove: (productId: number) => void
  onUpdateQuantity: (productId: number, quantity: number) => void
}

export const CartDrawer = ({ cart, error, isOpen, isUpdating, onClose, onRemove, onUpdateQuantity }: CartDrawerProps) => {
  return <>
    <button className={`cart-backdrop ${isOpen ? 'is-open' : ''}`} aria-label="Close shopping bag" onClick={onClose} tabIndex={isOpen ? 0 : -1} />
    <aside className={`cart-drawer ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen} aria-label="Shopping bag">
      <div className="cart-drawer-header"><div><p className="eyebrow">Your selection</p><h2>Shopping bag</h2></div><button type="button" onClick={onClose} aria-label="Close shopping bag">×</button></div>
      {error && <p className="cart-error" role="alert">{error}</p>}
      {!cart?.items.length ? <div className="empty-cart"><p>Your bag is still empty.</p><button type="button" onClick={onClose}>Continue exploring</button></div> : <>
        <div className="cart-items">
          {cart.items.map((item) => <article className="cart-item" key={item.productId}>
            <img src={item.imageUrl} alt="" />
            <div><h3>{item.name}</h3><p>{currency.format(item.unitPrice)}</p>
              <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                <button type="button" disabled={isUpdating || item.quantity === 1} onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button type="button" disabled={isUpdating || item.quantity === 99} onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}>+</button>
              </div>
              <button className="remove-item" type="button" disabled={isUpdating} onClick={() => onRemove(item.productId)}>Remove</button>
            </div>
            <strong>{currency.format(item.lineTotal)}</strong>
          </article>)}
        </div>
        <div className="cart-summary"><div><span>Subtotal</span><strong>{currency.format(cart.subtotal)}</strong></div><p>Taxes and delivery are calculated at checkout.</p><button type="button" disabled>Checkout coming next</button></div>
      </>}
    </aside>
  </>
}
