import React from 'react'

interface HighlightTextProps {
  text: string
  matches?: number[][]
  className?: string
}

export const HighlightText = ({ text, matches = [], className = '' }: HighlightTextProps) => {
  if (!matches.length) return <span className={className}>{text}</span>

  const parts: { text: string; highlight: boolean }[] = []
  let lastIndex = 0

  matches.forEach(([start, end]) => {
    if (start > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, start),
        highlight: false
      })
    }
    parts.push({
      text: text.slice(start, end + 1),
      highlight: true
    })
    lastIndex = end + 1
  })

  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      highlight: false
    })
  }

  return (
    <span className={className}>
      {parts.map((part, i) => (
        <span
          key={i}
          className={part.highlight ? 'bg-yellow-200 text-primary-dark font-medium' : undefined}
        >
          {part.text}
        </span>
      ))}
    </span>
  )
} 