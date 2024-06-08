import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
// import './index.css'
// import App from './App'
import StarRating from './StarRating'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarRating maxRating={5} className="test" messages={['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']} />
    <StarRating maxRating={10} size={24} color="red" hoverColor="pink" hoverColorLower="pink" />
    <StarRating defaultRating={3} />
    <Test />
  </React.StrictMode>
)

function Test() {
  const [movieRating, setMovieRating] = useState(0)
  return (
    <div>
      <StarRating maxRating={10} onSetRating={setMovieRating} />
      <p>The movie was rated {movieRating} stars</p>
    </div>
  )
}
