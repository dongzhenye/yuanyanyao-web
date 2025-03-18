import React from 'react'

interface TagProps {
  text: string
  type?: string
  onClick?: (e: React.MouseEvent) => void
  active?: boolean
}

export const Tag = ({ text, type, onClick, active }: TagProps) => {
  const baseClasses = "px-2 py-1 text-[14px] rounded-full transition-all duration-200"
  
  // 区分标签类型
  const typeClasses = onClick 
    ? {
        // 筛选器标签保持彩色
        "原研": "bg-rose-50 text-rose-600 hover:bg-rose-100",
        "剂型": "bg-blue-50 text-blue-600 hover:bg-blue-100",
        "分类": "bg-green-50 text-green-600 hover:bg-green-100",
        "注册": "bg-purple-50 text-purple-600 hover:bg-purple-100",
        "success": "bg-green-50 text-green-600 hover:bg-green-100",
        "warning": "bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
        "其他": "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }[type || "其他"]
    : type === "原研"
      ? "bg-rose-50 text-rose-600" // 原研标签保持主题色
      : type === "success"
        ? "bg-green-50 text-green-600"
        : type === "warning"
          ? "bg-yellow-50 text-yellow-600"
          : "bg-gray-100 text-gray-600" // 其他普通标签统一为灰色
  
  const clickableClasses = onClick 
    ? "cursor-pointer hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0" 
    : ""
  const activeClasses = active ? "ring-2 ring-primary/30" : ""

  return (
    <span 
      onClick={onClick}
      className={`${baseClasses} ${typeClasses} ${clickableClasses} ${activeClasses}`}
      tabIndex={onClick ? 0 : undefined}
    >
      {text}
    </span>
  )
} 