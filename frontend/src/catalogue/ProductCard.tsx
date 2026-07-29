import type { Product } from './types'
import { useTranslation } from 'react-i18next'
import { localeFor } from '../i18n'
import { appConfig } from '../config'
import { navigateFromLink } from '../navigation'
import { routes } from '../routes'

export const ProductCard = ({
  product,
  isAdding,
  onAdd,
}: {
  product: Product
  isAdding: boolean
  onAdd: () => void
}) => {
  const { t, i18n } = useTranslation()
  const currency = new Intl.NumberFormat(localeFor(i18n.language), {
    style: 'currency',
    currency: appConfig.currency,
    maximumFractionDigits: 0,
  })
  const categoryNames: Record<number, string> = {
    1: t('catalogue.electronics'),
    2: t('catalogue.accessories'),
  }

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <a
          href={routes.product(product.slug)}
          onClick={(event) => navigateFromLink(event, routes.product(product.slug))}
        >
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        </a>
        <span className="product-category">
          {categoryNames[product.categoryId] ?? t('catalogue.collection')}
        </span>
      </div>
      <div className="product-details">
        <div>
          <h3>
            <a
              href={routes.product(product.slug)}
              onClick={(event) => navigateFromLink(event, routes.product(product.slug))}
            >
              {product.name}
            </a>
          </h3>
          <p className="product-description">{product.description}</p>
        </div>
        <div className="product-action">
          <span className="product-price">{currency.format(product.price)}</span>
          <button className="add-button" type="button" disabled={isAdding} onClick={onAdd}>
            {isAdding ? t('catalogue.adding') : t('catalogue.add')}
          </button>
        </div>
      </div>
    </article>
  )
}
