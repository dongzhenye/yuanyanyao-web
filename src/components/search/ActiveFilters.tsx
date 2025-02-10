import React from 'react'
import { SearchTag } from './SearchTag'

interface ActiveFiltersProps {
  filters: string[]
  onRemove: (filter: string) => void
  onClear: () => void
}

export const ActiveFilters = ({ filters, onRemove, onClear }: ActiveFiltersProps) => {
  if (filters.length === 0) return null

  return (
    <div className="flex items-center gap-2 mt-4 text-sm">
      <span className="text-gray-500">已选条件：</span>
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <SearchTag
            key={filter}
            text={filter}
            onClick={() => onRemove(filter)}
            active
          />
        ))}
        <button
          onClick={onClear}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          清除全部
        </button>
      </div>
    </div>
  )
} 