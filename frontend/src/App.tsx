import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchProducts } from './catalogue/api'
import { ProductCard } from './catalogue/ProductCard'
import type { Product } from './catalogue/types'
import { CartDrawer } from './cart/CartDrawer'
import { useCart } from './cart/useCart'
import { IdentityPanel } from './identity/IdentityPanel'
import { useIdentity } from './identity/useIdentity'
import { changeLanguage } from './i18n'
import { routes } from './routes'
import type { SupportedLanguage } from './config'
import './App.css'

const categories = [
  { id: 'all', labelKey: 'catalogue.all' },
  { id: 1, labelKey: 'catalogue.electronics' },
  { id: 2, labelKey: 'catalogue.accessories' },
] as const

const App = () => {
  const { t, i18n } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | number>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{ message?: string } | null>(null)
  const [requestKey, setRequestKey] = useState(0)
  const bag = useCart()
  const identity = useIdentity()

  useEffect(() => {
    const controller = new AbortController()
    const loadProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        setProducts(await fetchProducts(controller.signal))
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(requestError instanceof Error ? { message: requestError.message } : {})
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void loadProducts()
    return () => controller.abort()
  }, [requestKey])

  const visibleProducts = useMemo(
    () =>
      selectedCategory === 'all'
        ? products
        : products.filter((product) => product.categoryId === selectedCategory),
    [products, selectedCategory],
  )

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href={routes.home} aria-label="CartCraft home">
          <span className="brand-mark" aria-hidden="true">
            C
          </span>
          <span>CartCraft</span>
        </a>
        <nav className="primary-nav" aria-label={t('nav.primary')}>
          <a href={routes.collection}>{t('nav.collection')}</a>
          <a href={routes.principles}>{t('nav.principles')}</a>
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

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">{t('hero.eyebrow')}</p>
            <h1 id="hero-title">{t('hero.title')}</h1>
            <p className="hero-intro">{t('hero.intro')}</p>
            <a className="hero-link" href={routes.collection}>
              {t('hero.explore')} <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-note" aria-label={t('hero.noteLabel')}>
            <span>{t('hero.edition')}</span>
            <p>{t('hero.note')}</p>
          </div>
        </section>

        <section className="collection-section" id="collection" aria-labelledby="collection-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t('catalogue.eyebrow')}</p>
              <h2 id="collection-title">{t('catalogue.title')}</h2>
            </div>
            <p>{t('catalogue.pieces', { count: visibleProducts.length })}</p>
          </div>
          <div className="category-filter" aria-label={t('catalogue.filterLabel')}>
            {categories.map((category) => (
              <button
                className={selectedCategory === category.id ? 'is-active' : ''}
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
              >
                {t(category.labelKey)}
              </button>
            ))}
          </div>
          {loading && (
            <div className="product-grid" aria-label={t('catalogue.loading')} aria-busy="true">
              {[1, 2, 3].map((item) => (
                <div className="product-skeleton" key={item} />
              ))}
            </div>
          )}
          {error && (
            <div className="error-state" role="alert">
              <p>{error.message ? t(error.message) : t('catalogue.unavailable')}</p>
              <button type="button" onClick={() => setRequestKey((key) => key + 1)}>
                {t('catalogue.retry')}
              </button>
            </div>
          )}
          {!loading && !error && (
            <div className="product-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAdding={bag.isUpdating}
                  onAdd={() => void bag.addProduct(product)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="principles-section" id="principles" aria-labelledby="principles-title">
          <p className="eyebrow">{t('principles.eyebrow')}</p>
          <h2 id="principles-title">{t('principles.title')}</h2>
          <div className="principles-grid">
            <article>
              <span>01</span>
              <h3>{t('principles.usefulTitle')}</h3>
              <p>{t('principles.usefulText')}</p>
            </article>
            <article>
              <span>02</span>
              <h3>{t('principles.stayTitle')}</h3>
              <p>{t('principles.stayText')}</p>
            </article>
            <article>
              <span>03</span>
              <h3>{t('principles.clearTitle')}</h3>
              <p>{t('principles.clearText')}</p>
            </article>
          </div>
        </section>
      </main>
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
