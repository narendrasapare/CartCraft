import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Product } from '../catalogue/types'
import { createCart, fetchCart, removeCartItem, setCartItemQuantity } from './api'
import type { Cart } from './types'
import { appConfig } from '../config'

export const useCart = () => {
  const { t } = useTranslation()
  const [cart, setCart] = useState<Cart | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cartId = localStorage.getItem(appConfig.storageKeys.cartId)
    if (!cartId) return
    const controller = new AbortController()
    fetchCart(cartId, controller.signal)
      .then(setCart)
      .catch(() => localStorage.removeItem(appConfig.storageKeys.cartId))
    return () => controller.abort()
  }, [])

  const ensureCart = async (): Promise<Cart> => {
    if (cart) return cart
    const createdCart = await createCart()
    localStorage.setItem(appConfig.storageKeys.cartId, createdCart.id)
    setCart(createdCart)
    return createdCart
  }

  const updateQuantity = async (productId: number, quantity: number) => {
    if (
      quantity < appConfig.limits.cartQuantity.min ||
      quantity > appConfig.limits.cartQuantity.max
    )
      return
    setIsUpdating(true)
    setError(null)
    try {
      const currentCart = await ensureCart()
      setCart(await setCartItemQuantity(currentCart.id, productId, quantity))
    } catch (requestError) {
      setError(requestError instanceof Error ? t(requestError.message) : t('cart.updateError'))
    } finally {
      setIsUpdating(false)
    }
  }

  const addProduct = async (product: Product) => {
    const currentQuantity = cart?.items.find((item) => item.productId === product.id)?.quantity ?? 0
    await updateQuantity(product.id, currentQuantity + 1)
    setIsOpen(true)
  }

  const removeProduct = async (productId: number) => {
    if (!cart) return
    setIsUpdating(true)
    setError(null)
    try {
      setCart(await removeCartItem(cart.id, productId))
    } catch (requestError) {
      setError(requestError instanceof Error ? t(requestError.message) : t('cart.updateError'))
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    cart,
    error,
    isOpen,
    isUpdating,
    addProduct,
    close: () => setIsOpen(false),
    open: () => setIsOpen(true),
    removeProduct,
    updateQuantity,
  }
}
