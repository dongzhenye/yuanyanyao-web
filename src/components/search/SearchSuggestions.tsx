import React from 'react'

interface SearchSuggestionsProps {
  onSelect: (term: string) => void
}

// 热门搜索词列表
const HOT_SEARCHES = [
  {
    type: '常用药品',
    terms: ['芬必得', '达菲', '美林', '布洛芬']
  },
  {
    type: '慢性病药',
    terms: ['拜新同', '阿托伐他汀', '氯吡格雷', '厄贝沙坦']
  },
  {
    type: '知名药企',
    terms: ['辉瑞', '拜耳']
  }
]

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ onSelect }) => {
  return (
    <div className="mt-3">
      <div className="text-sm text-gray-500 mb-2">热门搜索：</div>
      <div className="flex flex-wrap gap-2">
        {HOT_SEARCHES.flatMap(group => 
          group.terms.map(term => (
            <button
              key={term}
              onClick={() => onSelect(term)}
              className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-full
                hover:bg-gray-200 transition-colors"
            >
              {term}
            </button>
          ))
        )}
      </div>
    </div>
  )
} 