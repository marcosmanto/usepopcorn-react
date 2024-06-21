import { useEffect } from 'react'

export function useKey({ key = 'Escape', action }) {
  useEffect(
    function () {
      function callback(e) {
        if (e.code.toLowerCase() === key.toLocaleLowerCase()) {
          action()
        }
      }

      document.addEventListener('keydown', callback)

      return () => {
        document.removeEventListener('keydown', callback)
      }
    },
    [action, key]
  )
}
