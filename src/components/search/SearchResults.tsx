import React from 'react'
import Link from 'next/link'
import type { SearchResultItem } from '@/lib/types'
import { HighlightText } from './HighlightText'
import { SearchTag } from './SearchTag'
import { formatBrandName } from '@/lib/utils'
import type { FuseResultMatch } from 'fuse.js'

interface SearchResultsProps {
  results: SearchResultItem[]
  isLoading?: boolean
  searchTerm?: string
  onRelatedSearch: (type: 'generic' | 'brand' | 'manufacturer', value: string) => void
  onTagClick?: (tag: { text: string; type: string }) => void
  activeFilters?: string[]
}

const getMatches = (matches: SearchResultItem['matches'], key: string): ReadonlyArray<FuseResultMatch> => {
  const match = matches?.find(m => m.key === key)
  return match ? [{ indices: match.indices || [], key: match.key }] : []
}

export const SearchResults = ({ 
  results, 
  isLoading, 
  searchTerm,
  onRelatedSearch,
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
    // 直接使用原始值，不需要转换
    onTagClick?.(tag)
  }

  return (
    <div className="space-y-4">
      {results.map(drug => (
        <Link
          key={drug.id}
          href={`/drug/${drug.id}`}
          className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between gap-4">
            <div className="min-w-0 flex-1">
              {/* 标题行：商品名 + 产品名 + 原研标签 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    onRelatedSearch('brand', drug.brandName.cn)
                  }}
                  className="text-xl font-bold text-gray-900 hover:text-primary truncate"
                >
                  <HighlightText 
                    text={formatBrandName(drug.brandName.cn)}
                    matches={getMatches(drug.matches, 'brandName.cn')}
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    onRelatedSearch('generic', drug.productName)
                  }}
                  className="text-xl text-gray-600 hover:text-primary truncate"
                >
                  <HighlightText 
                    text={drug.productName}
                    matches={getMatches(drug.matches, 'productName')}
                  />
                </button>
                {drug.isOriginal && (
                  <span className="inline-flex items-center gap-0.5 px-2.5 py-1 text-[15px] rounded-full bg-primary/10 text-primary whitespace-nowrap">
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      className="w-4 h-4"
                    >
                      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    <span>原研药</span>
                  </span>
                )}
              </div>

              {/* 英文商品名 */}
              {drug.brandName.en && (
                <div className="mt-1 text-sm text-gray-400">
                  ({formatBrandName(drug.brandName.en)})
                </div>
              )}

              {/* 厂商名称 */}
              <div className="mt-2 text-sm text-gray-500 truncate">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    onRelatedSearch('manufacturer', drug.manufacturerName)
                  }}
                  className="hover:text-primary"
                >
                  <HighlightText 
                    text={drug.manufacturerName}
                    matches={getMatches(drug.matches, 'manufacturerName')}
                  />
                </button>
              </div>
            </div>

            {/* 标签组 - 只保留注册类型和剂型 */}
            <div className="flex flex-col items-end gap-1.5">
              <SearchTag 
                text={drug.registrationType}
                type="注册"
                onClick={(e) => handleTagClick(e, { 
                  text: drug.registrationType, 
                  type: "注册" 
                })}
                active={activeFilters.includes(drug.registrationType)}
              />
              <SearchTag 
                text={drug.formulation}
                type="剂型"
                onClick={(e) => handleTagClick(e, { 
                  text: drug.formulation, 
                  type: "剂型" 
                })}
                active={activeFilters.includes(drug.formulation)}
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
} 