import { useTranslation } from 'react-i18next'
import { CartDrawer } from './cart/CartDrawer'
import { useCart } from './cart/useCart'
import { CataloguePage } from './catalogue/CataloguePage'
import { ProductDetailPage } from './catalogue/ProductDetailPage'
import type { SupportedLanguage } from './config'
import { IdentityPanel } from './identity/IdentityPanel'
import { useIdentity } from './identity/useIdentity'
import { changeLanguage } from './i18n'
import { navigateFromLink, useBrowserLocation } from './navigation'
import { productSlugFromPath, routes } from './routes'
import './App.css'

const App = () => {
  const { t, i18n } = useTranslation()
  const location = useBrowserLocation()
  const bag = useCart()
  const identity = useIdentity()
  const productSlug = productSlugFromPath(location.pathname)

  return (
    <div className="site-shell">
      <header className="site-header">
        <a
          className="brand"
          href={routes.home}
          onClick={(event) => navigateFromLink(event, routes.home)}
          aria-label="CartCraft home"
        >
          <span className="brand-mark" aria-hidden="true">
            C
          </span>
          <span>CartCraft</span>
        </a>
        <nav className="primary-nav" aria-label={t('nav.primary')}>
          <a
            href={routes.collection}
            onClick={(event) => navigateFromLink(event, routes.collection)}
          >
            {t('nav.collection')}
          </a>
          <a
            href={routes.principles}
            onClick={(event) => navigateFromLink(event, routes.principles)}
          >
            {t('nav.principles')}
          </a>
        </nav>
        <div className="header-actions">
          <label className="language-picker">
            <span className="visually-hidden">{t('language.label')}</span>
            <select
              aria-label={t('language.label')}
              value={i18n.language.split('-')[0] as SupportedLanguage}
              onChange={(event) => void changeLanguage(event.target.value as SupportedLanguage)}
            >
              <option value="en">{t('language.english')}</option>
              <option value="hi">{t('language.hindi')}</option>
              <option value="te">{t('language.telugu')}</option>
            </select>
          </label>
          {identity.customer ? (
            <div className="account-menu">
              <span>{t('account.greeting', { name: identity.customer.displayName })}</span>
              <button type="button" onClick={() => void identity.logout()}>
                {t('account.signOut')}
              </button>
            </div>
          ) : (
            <button className="account-button" type="button" onClick={() => identity.open('login')}>
              {t('account.button')}
            </button>
          )}
          <button
            className="bag-button"
            type="button"
            onClick={bag.open}
            aria-label={t('cart.bagLabel', { count: bag.cart?.totalQuantity ?? 0 })}
          >
            <span>{t('cart.bag')}</span>
            <span className="bag-count">{bag.cart?.totalQuantity ?? 0}</span>
          </button>
        </div>
      </header>

      {productSlug ? (
        <ProductDetailPage
          slug={productSlug}
          isAdding={bag.isUpdating}
          onAdd={(product) => void bag.addProduct(product)}
        />
      ) : location.pathname === '/' ? (
        <CataloguePage
          isAdding={bag.isUpdating}
          onAdd={(product) => void bag.addProduct(product)}
        />
      ) : (
        <main className="product-detail-state">
          <h1>{t('errors.pageNotFound')}</h1>
          <a href={routes.home} onClick={(event) => navigateFromLink(event, routes.home)}>
            {t('catalogue.backToCollection')}
          </a>
        </main>
      )}

      <footer className="site-footer">
        <div className="brand footer-brand">
          <span className="brand-mark" aria-hidden="true">
            C
          </span>
          <span>CartCraft</span>
        </div>
        <p>{t('footer.message')}</p>
        <span>{t('footer.copyright')}</span>
      </footer>
      <CartDrawer
        cart={bag.cart}
        error={bag.error}
        isOpen={bag.isOpen}
        isUpdating={bag.isUpdating}
        onClose={bag.close}
        onRemove={(productId) => void bag.removeProduct(productId)}
        onUpdateQuantity={(productId, quantity) => void bag.updateQuantity(productId, quantity)}
      />
      <IdentityPanel
        error={identity.error}
        isOpen={identity.isOpen}
        isSubmitting={identity.isSubmitting}
        mode={identity.mode}
        onClose={identity.close}
        onModeChange={identity.setMode}
        onSubmit={(email, password, displayName) =>
          void identity.submit(email, password, displayName)
        }
      />
    </div>
  )
}

export default App
