import React from 'react'

interface SearchTerm {
  id: number
  text: string
  type: "通用名" | "商品名" | "厂商" | "简拼" | "拼音"
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

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ onSelect }) => {
  return (
    <div className="mt-4">
      {/* 热门搜索标签 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center text-sm text-gray-500 whitespace-nowrap">
          热门搜索:
        </span>
        {HOT_TERMS.map((term) => (
          <button
            key={term.id}
            onClick={() => onSelect(term.text)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            {term.text}
          </button>
        ))}
      </div>
    </div>
  )
} 