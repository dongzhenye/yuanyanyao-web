import React from 'react'
import Link from 'next/link'
import type { SearchResultItem } from '@/lib/types'
import { HighlightText } from './HighlightText'
import { SearchTag } from './SearchTag'
import { formatRegistrationType, formatBrandName } from '@/lib/utils'

interface SearchResultsProps {
  results: SearchResultItem[]
  isLoading?: boolean
  searchTerm?: string
  onTagClick?: (tag: { text: string; type: string }) => void
  activeFilters?: string[]
}

export const SearchResults = ({ 
  results, 
  isLoading, 
  searchTerm,
  onTagClick,
  activeFilters = []
}: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-r-transparent" />
        <p className="mt-2 text-gray-500">搜索中...</p>
      </div>
    )
  }

  if (!searchTerm) {
    return null
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">未找到相关药品</p>
        <p className="mt-2 text-sm text-gray-400">
          建议：
          <ul className="mt-1">
            <li>• 检查输入是否正确</li>
            <li>• 尝试使用药品通用名</li>
            <li>• 使用更简单的关键词</li>
          </ul>
        </p>
      </div>
    )
  }

  const handleTagClick = (e: React.MouseEvent, tag: { text: string; type: string }) => {
    e.preventDefault()
    // 如果是注册类型标签，需要转换回后端值
    if (tag.type === "注册") {
      const backendValue = tag.text === "进口药" ? "境外生产药品" : "境内生产药品"
      onTagClick?.({ text: backendValue, type: tag.type })
    } else {
      onTagClick?.(tag)
    }
  }

  return (
    <div className="space-y-4">
      {results.map(drug => (
        <Link
          key={drug.id}
          href={`/drug/${drug.id}`}
          className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-lg text-primary truncate">
                <HighlightText 
                  text={drug.productName}
                  matches={drug.matches?.find(m => m.key === 'productName')?.indices || []}
                />
              </h3>
              <div className="mt-1 text-gray-600">
                {drug.brandName.cn && (
                  <HighlightText 
                    text={formatBrandName(drug.brandName.cn, 'cn')}
                    matches={drug.matches?.find(m => m.key === 'brandName.cn')?.indices || []}
                  />
                )}
                {drug.brandName.en && (
                  <span className="text-gray-400 text-sm ml-2">
                    (<HighlightText 
                      text={formatBrandName(drug.brandName.en, 'en')}
                      matches={drug.matches?.find(m => m.key === 'brandName.en')?.indices || []}
                    />)
                  </span>
                )}
              </div>
              <div className="mt-1 text-sm text-gray-500 truncate">
                <HighlightText 
                  text={drug.manufacturerName}
                  matches={drug.matches?.find(m => m.key === 'manufacturerName')?.indices || []}
                />
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex flex-wrap gap-2 justify-end" onClick={e => e.preventDefault()}>
                <SearchTag 
                  text={formatRegistrationType(drug.registrationType)}
                  type="注册"
                  onClick={(e) => handleTagClick(e, { 
                    text: formatRegistrationType(drug.registrationType), 
                    type: "注册" 
                  })}
                  active={activeFilters.includes(drug.registrationType)}
                />
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <SearchTag 
                  text={drug.formulation}
                  type="剂型"
                  onClick={(e) => handleTagClick(e, { text: drug.formulation, type: "剂型" })}
                  active={activeFilters.includes(drug.formulation)}
                />
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <SearchTag 
                  text={drug.category}
                  type="分类"
                  onClick={(e) => handleTagClick(e, { text: drug.category, type: "分类" })}
                  active={activeFilters.includes(drug.category)}
                />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
} 