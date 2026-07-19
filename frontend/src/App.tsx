import { useEffect, useMemo, useState } from 'react'
import { fetchProducts } from './catalogue/api'
import { ProductCard } from './catalogue/ProductCard'
import type { Product } from './catalogue/types'
import { CartDrawer } from './cart/CartDrawer'
import { useCart } from './cart/useCart'
import { IdentityPanel } from './identity/IdentityPanel'
import { useIdentity } from './identity/useIdentity'
import './App.css'

const categories = [
  { id: 'all', label: 'All essentials' },
  { id: 1, label: 'Electronics' },
  { id: 2, label: 'Accessories' },
] as const

const App = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | number>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
          setError(requestError instanceof Error ? requestError.message : 'The catalogue is unavailable right now.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void loadProducts()
    return () => controller.abort()
  }, [requestKey])

  const visibleProducts = useMemo(
    () => selectedCategory === 'all' ? products : products.filter((product) => product.categoryId === selectedCategory),
    [products, selectedCategory],
  )

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="CartCraft home"><span className="brand-mark" aria-hidden="true">C</span><span>CartCraft</span></a>
        <nav className="primary-nav" aria-label="Primary navigation"><a href="#collection">Collection</a><a href="#principles">Our standard</a></nav>
        <div className="header-actions">
          {identity.customer ? <div className="account-menu"><span>Hi, {identity.customer.displayName}</span><button type="button" onClick={() => void identity.logout()}>Sign out</button></div> : <button className="account-button" type="button" onClick={() => identity.open('login')}>Account</button>}
          <button className="bag-button" type="button" onClick={bag.open} aria-label={`Shopping bag with ${bag.cart?.totalQuantity ?? 0} items`}><span>Bag</span><span className="bag-count">{bag.cart?.totalQuantity ?? 0}</span></button>
        </div>
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Considered goods for everyday life</p>
            <h1 id="hero-title">Objects that earn their place.</h1>
            <p className="hero-intro">A small collection of useful things, selected for thoughtful design, honest materials and the rhythm of daily use.</p>
            <a className="hero-link" href="#collection">Explore the collection <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-note" aria-label="Collection note"><span>Edition 01</span><p>Tools for moving, making and listening.</p></div>
        </section>

        <section className="collection-section" id="collection" aria-labelledby="collection-title">
          <div className="section-heading"><div><p className="eyebrow">The first edit</p><h2 id="collection-title">Everyday essentials</h2></div><p>{visibleProducts.length} pieces</p></div>
          <div className="category-filter" aria-label="Filter products by category">
            {categories.map((category) => <button className={selectedCategory === category.id ? 'is-active' : ''} key={category.id} type="button" onClick={() => setSelectedCategory(category.id)}>{category.label}</button>)}
          </div>
          {loading && <div className="product-grid" aria-label="Loading products" aria-busy="true">{[1, 2, 3].map((item) => <div className="product-skeleton" key={item} />)}</div>}
          {error && <div className="error-state" role="alert"><p>{error}</p><button type="button" onClick={() => setRequestKey((key) => key + 1)}>Try again</button></div>}
          {!loading && !error && <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} isAdding={bag.isUpdating} onAdd={() => void bag.addProduct(product)} />)}</div>}
        </section>

        <section className="principles-section" id="principles" aria-labelledby="principles-title">
          <p className="eyebrow">Our standard</p><h2 id="principles-title">Less, but considered.</h2>
          <div className="principles-grid">
            <article><span>01</span><h3>Useful by design</h3><p>Every detail should make the object easier or more enjoyable to use.</p></article>
            <article><span>02</span><h3>Made to stay</h3><p>Quiet forms and durable materials outlast short-lived trends.</p></article>
            <article><span>03</span><h3>Clearly described</h3><p>Honest details help you choose with confidence, without the noise.</p></article>
          </div>
        </section>
      </main>
      <footer className="site-footer"><div className="brand footer-brand"><span className="brand-mark" aria-hidden="true">C</span><span>CartCraft</span></div><p>Thoughtful commerce, built one useful object at a time.</p><span>© 2026 CartCraft</span></footer>
      <CartDrawer cart={bag.cart} error={bag.error} isOpen={bag.isOpen} isUpdating={bag.isUpdating} onClose={bag.close} onRemove={(productId) => void bag.removeProduct(productId)} onUpdateQuantity={(productId, quantity) => void bag.updateQuantity(productId, quantity)} />
      <IdentityPanel error={identity.error} isOpen={identity.isOpen} isSubmitting={identity.isSubmitting} mode={identity.mode} onClose={identity.close} onModeChange={identity.setMode} onSubmit={(email, password, displayName) => void identity.submit(email, password, displayName)} />
    </div>
  )
}

export default App
