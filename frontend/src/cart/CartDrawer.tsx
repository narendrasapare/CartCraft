import type { Cart } from './types'
import { useTranslation } from 'react-i18next'
import { localeFor } from '../i18n'
import { appConfig } from '../config'

type CartDrawerProps = {
  cart: Cart | null
  error: string | null
  isOpen: boolean
  isUpdating: boolean
  onClose: () => void
  onRemove: (productId: number) => void
  onUpdateQuantity: (productId: number, quantity: number) => void
}

export const CartDrawer = ({
  cart,
  error,
  isOpen,
  isUpdating,
  onClose,
  onRemove,
  onUpdateQuantity,
}: CartDrawerProps) => {
  const { t, i18n } = useTranslation()
  const currency = new Intl.NumberFormat(localeFor(i18n.language), {
    style: 'currency',
    currency: appConfig.currency,
    maximumFractionDigits: 0,
  })

  return (
    <>
      <button
        className={`cart-backdrop ${isOpen ? 'is-open' : ''}`}
        aria-label={t('cart.close')}
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
      />
      <aside
        className={`cart-drawer ${isOpen ? 'is-open' : ''}`}
        aria-hidden={!isOpen}
        aria-label={t('cart.title')}
      >
        <div className="cart-drawer-header">
          <div>
            <p className="eyebrow">{t('cart.selection')}</p>
            <h2>{t('cart.title')}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label={t('cart.close')}>
            ×
          </button>
        </div>
        {error && (
          <p className="cart-error" role="alert">
            {error}
          </p>
        )}
        {!cart?.items.length ? (
          <div className="empty-cart">
            <p>{t('cart.empty')}</p>
            <button type="button" onClick={onClose}>
              {t('cart.continue')}
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.items.map((item) => (
                <article className="cart-item" key={item.productId}>
                  <img src={item.imageUrl} alt="" />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{currency.format(item.unitPrice)}</p>
                    <div
                      className="quantity-control"
                      aria-label={t('cart.quantity', { name: item.name })}
                    >
                      <button
                        type="button"
                        disabled={isUpdating || item.quantity === appConfig.limits.cartQuantity.min}
                        onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        disabled={isUpdating || item.quantity === appConfig.limits.cartQuantity.max}
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-item"
                      type="button"
                      disabled={isUpdating}
                      onClick={() => onRemove(item.productId)}
                    >
                      {t('cart.remove')}
                    </button>
                  </div>
                  <strong>{currency.format(item.lineTotal)}</strong>
                </article>
              ))}
            </div>
            <div className="cart-summary">
              <div>
                <span>{t('cart.subtotal')}</span>
                <strong>{currency.format(cart.subtotal)}</strong>
              </div>
              <p>{t('cart.checkoutNote')}</p>
              <button type="button" disabled>
                {t('cart.checkout')}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
