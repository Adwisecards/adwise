import React from 'react'

const Points = ({className}) => {
  return (
    <svg
      width="23"
      height="5"
      viewBox="0 0 23 5"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="2.5" cy="2.5" r="2.5" transform="rotate(90 2.5 2.5)" fill="#966EEA" />
      <circle cx="20.5" cy="2.5" r="2.5" transform="rotate(90 20.5 2.5)" fill="#966EEA" />
      <circle cx="11.5" cy="2.5" r="2.5" transform="rotate(90 11.5 2.5)" fill="#966EEA" />
    </svg>
  )
}

export default Points
