import { useState } from 'react'

/* Outside function component, this is not regenerated every new component render */
const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px'
}

const starContainerStyle = {
  display: 'flex',
  alignItems: 'center'
}

const textStyle = {
  lineHeight: '1',
  margin: '0'
}

export default function StarRating({ maxRating = 5 }) {
  const [rating, setRating] = useState(0)
  const [previewRating, setPreviewRating] = useState(0)

  function handlePreviewRating(previewRate) {
    setPreviewRating(previewRate)
  }

  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star key={i} num={i + 1} previewRating={previewRating} rating={rating} onRate={() => setRating(i + 1)} onPreviewRate={handlePreviewRating} />
        ))}
      </div>
      <p style={textStyle}>{previewRating || rating || ''}</p>
    </div>
  )
}

const starStyle = {
  width: '48px',
  height: '48px',
  cursor: 'pointer',
  strokeWidth: '.7px',
  stroke: 'rgba(0, 0, 0, .4)'
}

function Star({ num, previewRating, rating, onRate, onPreviewRate }) {
  const starColor = '#ffd43b'
  const starPreviewHigherColor = '#e9ecef'
  const starPreviewLowerColor = '#fab005'
  const isFull = num <= rating
  const isPreviewHigher = num <= previewRating
  const isPreviewLower = num <= previewRating && previewRating < rating

  let fill
  if (isPreviewLower && isFull) {
    fill = starPreviewLowerColor
  } else if (isFull) {
    fill = starColor
  } else if (isPreviewHigher) {
    fill = rating === 0 ? starColor : starPreviewHigherColor
  } else {
    fill = 'transparent'
  }

  //const fill = isFull ? starColor : isPreview ? previewFill : 'transparent'

  return (
    <svg style={{ ...starStyle, fill }} onMouseEnter={() => onPreviewRate(num)} onMouseLeave={() => onPreviewRate(0)} onClick={onRate} role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="transparent" stroke="#000">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}
