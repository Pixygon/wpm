/**
 * Protects against QuotaExceededError when localStorage is full.
 * Call installSafeLocalStorage() once in main.tsx before rendering.
 */
export function installSafeLocalStorage() {
  const originalSetItem = localStorage.setItem.bind(localStorage)
  localStorage.setItem = (key: string, value: string) => {
    try {
      originalSetItem(key, value)
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        console.warn('localStorage full, clearing old data')
        localStorage.clear()
        try {
          originalSetItem(key, value)
        } catch {
          // Storage completely broken - silently fail
        }
      }
    }
  }
}
