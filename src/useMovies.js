import { useEffect, useState } from 'react'

const KEY = 'bb268ed2'

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  function Reset() {
    setMovies([])
    setError('')
    setIsLoading(false)
  }

  async function fetchMovies(abort = null) {
    try {
      setIsLoading(true)
      setError('')

      const res = await fetch(`http://www.omdbapi.com/?s=${query?.trim()}&apikey=${KEY}`, { signal: abort?.signal })

      if (!res.ok) throw new Error('Something went wong with fetching movies')

      const data = await res.json()

      if (data?.Error) throw new Error(data.Error)

      setMovies(data.Search)
      setError('')
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (query.length < 3) {
      Reset()
      return
    }

    const controller = new AbortController()

    // throttle input onchange calls
    const timeoutId = setTimeout(() => {
      callback?.()
      fetchMovies(controller)
    }, 200)

    //fetchMovies(controller) /* too many requests without delay */

    // clear timeout on unmount => this is a cleaning up function: clear side effects and memory leaking
    return () => {
      controller.abort()
      clearTimeout(timeoutId)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return { movies, isLoading, error }
}
