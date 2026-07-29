import { useEffect, useState, type MouseEvent } from 'react'

export type BrowserLocation = {
  pathname: string
  search: string
  hash: string
}

const currentLocation = (): BrowserLocation => ({
  pathname: window.location.pathname,
  search: window.location.search,
  hash: window.location.hash,
})

export const navigate = (destination: string, options?: { replace?: boolean }) => {
  const method = options?.replace ? 'replaceState' : 'pushState'
  window.history[method](null, '', destination)
  window.dispatchEvent(new PopStateEvent('popstate'))
  const hash = new URL(destination, window.location.origin).hash
  if (hash) {
    window.requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView?.()
    })
  } else {
    document.getElementById('top')?.scrollIntoView?.()
  }
}

export const navigateFromLink = (event: MouseEvent<HTMLAnchorElement>, destination: string) => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  navigate(destination)
}

export const useBrowserLocation = () => {
  const [location, setLocation] = useState(currentLocation)

  useEffect(() => {
    const updateLocation = () => setLocation(currentLocation())
    window.addEventListener('popstate', updateLocation)
    return () => window.removeEventListener('popstate', updateLocation)
  }, [])

  return location
}
