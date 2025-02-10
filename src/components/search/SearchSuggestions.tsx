import React from 'react'

interface SearchTerm {
  id: number
  text: string
  type: "通用名" | "商品名" | "厂商" | "简拼"
}

const HOT_TERMS: SearchTerm[] = [
  // 通用名示例
  { id: 1, text: "布洛芬", type: "通用名" },
  // 商品名示例（中/英文）
  { id: 2, text: "达菲", type: "商品名" },
  { id: 3, text: "Tamiflu", type: "商品名" },
  // 厂商示例（中/英文）
  { id: 4, text: "辉瑞", type: "厂商" },
  { id: 5, text: "Pfizer", type: "厂商" },
  // 拼音示例
  { id: 6, text: "buluofen", type: "拼音" }
]

interface SearchSuggestionsProps {
  onSelect: (term: string) => void
}

export const SearchSuggestions = ({ onSelect }: SearchSuggestionsProps) => {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>热门搜索：</span>
        <div className="flex flex-wrap gap-2">
          {HOT_TERMS.map(term => (
            <button
              key={term.id}
              onClick={() => onSelect(term.text)}
              className="group relative px-3 py-1.5 text-sm bg-white text-gray-600 rounded-full 
                border border-gray-200 hover:bg-primary hover:text-white 
                hover:border-primary transition-all duration-200"
            >
              {term.text}
              <span 
                className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 
                  whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  before:content-[''] before:absolute before:top-full before:left-1/2 
                  before:-translate-x-1/2 before:border-4 before:border-transparent
                  before:border-t-gray-800"
              >
                {term.type}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 