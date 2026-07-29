import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { appConfig } from '../config'
import { localeFor } from '../i18n'
import { navigateFromLink } from '../navigation'
import { routes } from '../routes'
import { fetchProduct } from './api'
import type { Product } from './types'

type ProductDetailPageProps = {
  slug: string
  isAdding: boolean
  onAdd: (product: Product) => void
}

export const ProductDetailPage = ({ slug, isAdding, onAdd }: ProductDetailPageProps) => {
  const { t, i18n } = useTranslation()
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    fetchProduct(slug, controller.signal)
      .then(setProduct)
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(requestError instanceof Error ? requestError.message : 'errors.catalogueLoad')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [slug])

  const currency = new Intl.NumberFormat(localeFor(i18n.language), {
    style: 'currency',
    currency: appConfig.currency,
    maximumFractionDigits: 0,
  })

  if (loading)
    return (
      <main className="product-detail-state" aria-busy="true">
        {t('catalogue.loading')}
      </main>
    )
  if (error || !product)
    return (
      <main className="product-detail-state">
        <h1>{t(error ?? 'errors.productNotFound')}</h1>
        <a href={routes.collection} onClick={(event) => navigateFromLink(event, routes.collection)}>
          {t('catalogue.backToCollection')}
        </a>
      </main>
    )

  return (
    <main className="product-detail-page" id="top">
      <a
        className="product-detail-back"
        href={routes.collection}
        onClick={(event) => navigateFromLink(event, routes.collection)}
      >
        {t('catalogue.backToCollection')}
      </a>
      <div className="product-detail-layout">
        <div className="product-detail-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="product-detail-copy">
          <p className="eyebrow">{t('catalogue.productDetail')}</p>
          <h1>{product.name}</h1>
          <p className="product-detail-description">{product.description}</p>
          <strong>{currency.format(product.price)}</strong>
          <button type="button" disabled={isAdding} onClick={() => onAdd(product)}>
            {isAdding ? t('catalogue.adding') : t('catalogue.add')}
          </button>
        </div>
      </div>
    </main>
  )
}
