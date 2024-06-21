import { useState, useEffect } from 'react'

export function useLocalStorageState({ initialState = [], key }) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key)
    return JSON.parse(storedValue) ?? initialState ?? [] // with default value to initialState prop the "?? []" is unnecessary
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue]
}
