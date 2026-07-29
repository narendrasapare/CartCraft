import { useEffect, useState, type SubmitEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { navigate, navigateFromLink, useBrowserLocation } from '../navigation'
import { routes } from '../routes'
import { fetchProducts } from './api'
import { ProductCard } from './ProductCard'
import type { Product, ProductPage, ProductSort } from './types'

const categories = [
  { id: 'all', labelKey: 'catalogue.all' },
  { id: 1, labelKey: 'catalogue.electronics' },
  { id: 2, labelKey: 'catalogue.accessories' },
] as const

const pageSize = 6
const productSorts: ProductSort[] = ['NAME', 'PRICE_ASC', 'PRICE_DESC', 'NEWEST']

type CataloguePageProps = {
  isAdding: boolean
  onAdd: (product: Product) => void
}

export const CataloguePage = ({ isAdding, onAdd }: CataloguePageProps) => {
  const { t } = useTranslation()
  const location = useBrowserLocation()
  const searchParams = new URLSearchParams(location.search)
  const query = searchParams.get('query') ?? ''
  const categoryValue = searchParams.get('category')
  const categoryId = categoryValue ? Number(categoryValue) : undefined
  const page = Math.max(0, Number(searchParams.get('page') ?? 0) || 0)
  const requestedSort = searchParams.get('sort') as ProductSort | null
  const sort = requestedSort && productSorts.includes(requestedSort) ? requestedSort : 'NAME'
  const [draftQuery, setDraftQuery] = useState(query)
  const [productPage, setProductPage] = useState<ProductPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requestKey, setRequestKey] = useState(0)

  useEffect(() => setDraftQuery(query), [query])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    fetchProducts({ categoryId, page, query, size: pageSize, sort }, controller.signal)
      .then(setProductPage)
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(requestError instanceof Error ? requestError.message : 'errors.catalogueLoad')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [categoryId, page, query, requestKey, sort])

  const updateSearch = (updates: Record<string, string | undefined>, keepPage = false) => {
    const nextParams = new URLSearchParams(location.search)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) nextParams.set(key, value)
      else nextParams.delete(key)
    })
    if (!keepPage) nextParams.delete('page')
    const nextSearch = nextParams.toString()
    navigate(`/${nextSearch ? `?${nextSearch}` : ''}#collection`)
  }

  const submitSearch = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateSearch({ query: draftQuery.trim() || undefined })
  }

  return (
    <main id="top">
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">{t('hero.eyebrow')}</p>
          <h1 id="hero-title">{t('hero.title')}</h1>
          <p className="hero-intro">{t('hero.intro')}</p>
          <a
            className="hero-link"
            href={routes.collection}
            onClick={(event) => navigateFromLink(event, routes.collection)}
          >
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
          <p>{t('catalogue.pieces', { count: productPage?.totalItems ?? 0 })}</p>
        </div>
        <div className="catalogue-tools">
          <form className="catalogue-search" onSubmit={submitSearch}>
            <label className="visually-hidden" htmlFor="catalogue-query">
              {t('catalogue.searchLabel')}
            </label>
            <input
              id="catalogue-query"
              type="search"
              value={draftQuery}
              placeholder={t('catalogue.searchPlaceholder')}
              onChange={(event) => setDraftQuery(event.target.value)}
            />
            <button type="submit">{t('catalogue.search')}</button>
          </form>
          <label className="catalogue-sort">
            {t('catalogue.sortLabel')}
            <select
              value={sort}
              onChange={(event) =>
                updateSearch({
                  sort: event.target.value === 'NAME' ? undefined : event.target.value,
                })
              }
            >
              <option value="NAME">{t('catalogue.sortName')}</option>
              <option value="PRICE_ASC">{t('catalogue.sortPriceLow')}</option>
              <option value="PRICE_DESC">{t('catalogue.sortPriceHigh')}</option>
              <option value="NEWEST">{t('catalogue.sortNewest')}</option>
            </select>
          </label>
        </div>
        <div className="category-filter" aria-label={t('catalogue.filterLabel')}>
          {categories.map((category) => (
            <button
              className={
                (category.id === 'all' && !categoryId) || category.id === categoryId
                  ? 'is-active'
                  : ''
              }
              key={category.id}
              type="button"
              onClick={() =>
                updateSearch({ category: category.id === 'all' ? undefined : String(category.id) })
              }
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
            <p>{t(error)}</p>
            <button type="button" onClick={() => setRequestKey((key) => key + 1)}>
              {t('catalogue.retry')}
            </button>
          </div>
        )}
        {!loading && !error && productPage?.items.length === 0 && (
          <div className="empty-catalogue">
            <p>{t('catalogue.noResults')}</p>
            <button type="button" onClick={() => navigate(routes.collection)}>
              {t('catalogue.clearFilters')}
            </button>
          </div>
        )}
        {!loading && !error && productPage && (
          <>
            <div className="product-grid">
              {productPage.items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAdding={isAdding}
                  onAdd={() => onAdd(product)}
                />
              ))}
            </div>
            {productPage.totalPages > 1 && (
              <nav className="pagination" aria-label={t('catalogue.pagination')}>
                <button
                  type="button"
                  disabled={productPage.page === 0}
                  onClick={() => updateSearch({ page: String(productPage.page - 1) }, true)}
                >
                  {t('catalogue.previous')}
                </button>
                <span>
                  {t('catalogue.pageStatus', {
                    current: productPage.page + 1,
                    total: productPage.totalPages,
                  })}
                </span>
                <button
                  type="button"
                  disabled={productPage.page + 1 >= productPage.totalPages}
                  onClick={() => updateSearch({ page: String(productPage.page + 1) }, true)}
                >
                  {t('catalogue.next')}
                </button>
              </nav>
            )}
          </>
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
  )
}
