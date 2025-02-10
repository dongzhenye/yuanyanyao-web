import React from 'react'

interface SearchTagProps {
  text: string
  type?: string
  onClick?: (e: React.MouseEvent) => void
  active?: boolean
}

export const SearchTag = ({ text, type, onClick, active }: SearchTagProps) => {
  const baseClasses = "px-2 py-1 text-xs rounded-full transition-all duration-200"
  const typeClasses = {
    "原研": "bg-rose-50 text-rose-600 hover:bg-rose-100",
    "剂型": "bg-blue-50 text-blue-600 hover:bg-blue-100",
    "分类": "bg-green-50 text-green-600 hover:bg-green-100",
    "注册": "bg-purple-50 text-purple-600 hover:bg-purple-100",
    "其他": "bg-gray-100 text-gray-600 hover:bg-gray-200"
  }[type || "其他"]
  
  const clickableClasses = onClick 
    ? "cursor-pointer hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0" 
    : ""
  const activeClasses = active ? "ring-2 ring-primary/30" : ""

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡
    onClick?.(e)
  }

  return (
    <span 
      onClick={handleClick}
      className={`${baseClasses} ${typeClasses} ${clickableClasses} ${activeClasses}`}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {text}
    </span>
  )
} 