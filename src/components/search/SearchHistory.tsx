import React, { useCallback } from 'react'
import type { SearchHistoryItem } from '@/lib/types'

interface SearchHistoryProps {
  history: SearchHistoryItem[]
  onRestore: (searchTerm: string, filters: string[]) => void
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  onRestore
}) => {
  const handleHistoryClick = useCallback(() => {
    const lastSearch = history[0]
    if (!lastSearch) return
    onRestore(lastSearch.searchTerm, lastSearch.filters)
  }, [history, onRestore])

  if (history.length === 0) return null

  return (
    <button
      onClick={handleHistoryClick}
      className="text-[14px] whitespace-nowrap text-primary hover:text-primary-dark hover:underline"
    >
      返回上次搜索
    </button>
  )
} 