import React from 'react'

interface SearchFiltersProps {
  filters: string[]
  selectedFilters: string[]
  onFilterChange: (filter: string) => void
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  filters, 
  selectedFilters, 
  onFilterChange 
}) => {
  return (
    <div className="mt-4">
      {/* 筛选标签 */}
      <div className="flex flex-wrap items-start gap-y-3">
        <span className="inline-flex items-center text-sm text-gray-500 whitespace-nowrap mr-2">
          筛选:
        </span>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedFilters.includes(filter)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 