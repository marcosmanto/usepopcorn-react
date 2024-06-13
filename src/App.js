import { useEffect, useState } from 'react'
import StarRating from './StarRating'

const tempMovieData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg'
  },
  {
    imdbID: 'tt0133093',
    Title: 'The Matrix',
    Year: '1999',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg'
  },
  {
    imdbID: 'tt6751668',
    Title: 'Parasite',
    Year: '2019',
    Poster: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg'
  }
]

const tempWatchedData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10
  },
  {
    imdbID: 'tt0088763',
    Title: 'Back to the Future',
    Year: '1985',
    Poster: 'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9
  }
]

const average = arr => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0)

const KEY = 'bb268ed2'

export default function App() {
  const [movies, setMovies] = useState([])
  const [watched, setWatched] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  function renderMovieList() {
    if (isLoading) {
      return <Loader />
    }

    if (error) {
      return <ErrorMessage message={error} />
    }

    return (
      <MovieList
        movies={movies}
        selectedId={selectedId}
        onSelectMovie={id => {
          setSelectedId(prev => (id === prev ? null : id))
        }}
      />
    )
  }

  function Reset() {
    setMovies([])
    setError('')
    setIsLoading(false)
  }

  async function fetchMovies() {
    try {
      setIsLoading(true)
      setError('')

      const res = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=${KEY}`)

      if (!res.ok) throw new Error('Something went wong with fetching movies')

      const data = await res.json()

      if (data?.Error) throw new Error(data.Error)

      setMovies(data.Search)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (query.length < 3) {
      Reset()
      return
    }
    // throttle input onchange calls
    const timeoutId = setTimeout(() => fetchMovies(), 500)

    //fetchMovies() /* too many requests without delay */

    // clear timeout on unmount
    return () => clearTimeout(timeoutId)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  function handleAddWatched(movie) {
    setWatched(prev => [...prev, movie])
  }

  function handleDeleteWatched(id) {
    setWatched(prev => prev.filter(watched => watched.imdbID !== id))
  }

  return (
    <>
      <NavBar>
        <Logo key={3} />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {renderMovieList()}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails watched={watched} selectedId={selectedId} onCloseMovie={() => setSelectedId(null)} onAddWatched={handleAddWatched} /> //key={selectedId}
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} onDeleteWatched={handleDeleteWatched} />
            </>
          )}
        </Box>
      </Main>
    </>
  )
}

function Loader() {
  return <p className="loader">Loading...</p>
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>💣</span> {message}
    </p>
  )
}

function Search({ query, setQuery }) {
  return <input className="search" type="text" placeholder="Search movies..." value={query} onChange={e => setQuery(e.target.value)} autoComplete />
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  )
}

function Main({ children }) {
  return <main className="main">{children}</main>
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen(open => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  )
}

function MovieList({ movies, selectedId, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map(movie => (
        <Movie movie={movie} key={movie.imdbID} selectedId={selectedId} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  )
}

function Movie({ movie, selectedId, onSelectMovie }) {
  return (
    <li className={movie.imdbID === selectedId ? 'movie-selected' : null} onClick={() => onSelectMovie(movie.imdbID)}>
      <img
        src={movie.Poster === 'N/A' ? 'img/image-not-found.png' : movie.Poster}
        alt={`${movie.Title} poster`}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null // prevents looping
          currentTarget.src = 'img/image-not-found.png'
        }}
      />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

function MovieDetails({ selectedId, onCloseMovie, watched, onAddWatched }) {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [userRating, setUserRating] = useState('')

  const isWatched = watched.map(movie => movie.imdbID).includes(selectedId)

  const { Title: title, Year: year, Poster: poster, Runtime: runtime, imdbRating, Plot: plot, Released: released, Actors: actors, Director: director, Genre: genre } = movie

  const getMovieDetails = async function () {
    try {
      setIsLoading(true)
      setError('')
      const res = await fetch(`http://www.omdbapi.com/?i=${selectedId}&apikey=${KEY}`)
      if (!res.ok) throw new Error('Something went wong when loading the movie')
      const data = await res.json()
      if (data?.Error) throw new Error(data.Error)
      setMovie(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(
    function () {
      getMovieDetails()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedId]
  )

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating
    }
    onAddWatched(newWatchedMovie)
    onCloseMovie()
  }

  return error ? (
    <ErrorMessage message={error} />
  ) : isLoading ? (
    <Loader />
  ) : (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onCloseMovie}>
          <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M244 400L100 256l144-144M120 256h292" />
          </svg>
        </button>
        <img
          src={poster}
          alt={`Poster of ${title} movie`}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null // prevents looping
            currentTarget.src = 'img/image-not-found.png'
          }}
        />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} {!isNaN(runtime) ? `&bull; ${runtime}` : ''}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMDb rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          {!isWatched ? (
            <>
              <StarRating onSetRating={setUserRating} maxRating={10} size={24} />
              {userRating > 0 && (
                <button className="btn-add" onClick={handleAdd}>
                  + Add to list
                </button>
              )}
            </>
          ) : (
            <p style={{ textAlign: 'center' }}>
              You rated this movie already with <strong>{watched.find(movie => movie.imdbID === selectedId).userRating}</strong> <span>⭐</span>
            </p>
          )}
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  )
}

function WatchedMovieList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map(movie => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />
      ))}
    </ul>
  )
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        {!isNaN(movie.runtime) && (
          <p>
            <span>⏳</span>
            <span>{movie.runtime} min</span>
          </p>
        )}
      </div>
      <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>
        <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368" />
        </svg>
      </button>
    </li>
  )
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map(movie => movie.imdbRating))?.toFixed(2)
  const avgUserRating = average(watched.map(movie => movie.userRating))?.toFixed(2)
  const avgRuntime = average(watched.map(movie => movie.runtime)).toFixed(1)

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )
}
