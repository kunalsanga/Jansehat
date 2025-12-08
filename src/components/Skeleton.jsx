import React from 'react'

function Skeleton({ className = '', rounded = 'rounded-lg' }) {
  return (
    <div className={`bg-zinc-200/80 dark:bg-zinc-700/40 animate-pulse ${rounded} ${className}`}></div>
  )
}

export default Skeleton

