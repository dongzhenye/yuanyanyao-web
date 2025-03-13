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
          <ul className="mt-1 space-y-1">
            <li>• 检查输入是否正确</li>
            <li>• 尝试使用药品通用名 <span className="text-gray-500">(比如 布洛芬)</span></li>
            <li>• 尝试使用拼音 <span className="text-gray-500">(比如 buluofen)</span></li>
          </ul>
        </p>
        <div className="mt-6">
          <a
            href="https://github.com/dongzhenye/yuanyanyao/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary hover:text-primary/80 border border-primary/20 rounded-full hover:bg-primary/5 transition-colors"
          >
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>我要贡献</span>
            <span className="text-gray-500">药品数据</span>
          </a>
        </div>
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
          <div className="flex flex-col">
            {/* PC版第一行（商品名+产品名+原研药标签），移动版仅包含商品名+产品名 */}
            <div className="flex flex-wrap items-center gap-2">
              {/* 商品名 - 如果中文不存在则显示英文 */}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  onRelatedSearch('brand', drug.brandName.cn || drug.brandName.en || '')
                }}
                className="text-xl font-bold text-gray-900 hover:text-primary break-all"
              >
                {drug.brandName.cn ? (
                  <HighlightText 
                    text={formatBrandName(drug.brandName.cn)}
                    matches={getMatches(drug.matches, 'brandName.cn')}
                  />
                ) : drug.brandName.en ? (
                  <HighlightText 
                    text={formatBrandName(drug.brandName.en)}
                    matches={getMatches(drug.matches, 'brandName.en')}
                  />
                ) : null}
              </button>
              
              {/* 产品名 - 如果中文不存在则显示英文 */}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  onRelatedSearch('generic', drug.productName || drug.productNameEn || '')
                }}
                className="text-xl text-gray-600 hover:text-primary break-all"
              >
                {drug.productName ? (
                  <HighlightText 
                    text={drug.productName}
                    matches={getMatches(drug.matches, 'productName')}
                  />
                ) : drug.productNameEn ? (
                  <HighlightText 
                    text={drug.productNameEn}
                    matches={getMatches(drug.matches, 'productNameEn')}
                  />
                ) : null}
              </button>
              
              {/* 原研药标签 */}
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

            {/* 英文商品名 - 仅在PC版且中文商品名存在时以弱化形式显示 */}
            {drug.brandName.cn && drug.brandName.en && (
              <div className="hidden md:block mt-1 text-sm text-gray-400">
                {formatBrandName(drug.brandName.en)}
              </div>
            )}

            {/* 厂商名称 */}
            <div className="mt-3 text-sm text-gray-500">
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
        </Link>
      ))}
    </div>
  )
} 