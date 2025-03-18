import React from 'react'
import Link from 'next/link'
import type { SearchResultItem } from '@/lib/types'
import { HighlightText } from './HighlightText'
import type { FuseResultMatch } from 'fuse.js'
import { BrandName } from '@/components/common/BrandName'
import { DrugImageThumbnail } from './DrugImageThumbnail'

interface SearchResultsProps {
  results: SearchResultItem[]
  isLoading?: boolean
  searchTerm?: string
  onRelatedSearch: (type: 'generic' | 'brand' | 'manufacturer', value: string) => void
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

  return (
    <div className="space-y-3">
      {results.map(drug => (
        <Link
          key={drug.id}
          href={`/drug/${drug.id}`}
          className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center p-3">
            {/* 左侧药品图片 */}
            <DrugImageThumbnail drug={drug} />

            {/* 右侧信息区域 */}
            <div className="flex-1 ml-4">
              <div className="max-h-24 sm:max-h-28 overflow-hidden">
                {/* 商品名和原研药标签 */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      onRelatedSearch('brand', drug.brandName.cn || drug.brandName.en || '')
                    }}
                    className="text-base font-bold text-gray-900 hover:text-primary break-words"
                    title={`搜索${drug.brandName.cn || drug.brandName.en || ''}相关药品`}
                  >
                    {drug.brandName.cn ? (
                      <BrandName name={drug.brandName.cn} />
                    ) : drug.brandName.en ? (
                      <BrandName name={drug.brandName.en} />
                    ) : null}
                  </button>
                  
                  {/* 原研药标签 */}
                  {drug.isOriginal && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs rounded-full bg-primary/10 text-primary whitespace-nowrap">
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-3 h-3"
                      >
                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      <span>原研药</span>
                    </span>
                  )}
                </div>
                
                {/* 英文商品名 - 移动端隐藏，PC端显示 */}
                {drug.brandName.cn && drug.brandName.en && (
                  <div className="hidden md:block mt-0 text-[10px] text-gray-400">
                    <BrandName name={drug.brandName.en} />
                  </div>
                )}
                
                {/* 产品名称 */}
                <div className="mt-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      onRelatedSearch('generic', drug.productName || drug.productNameEn || '')
                    }}
                    className="text-base font-normal text-gray-700 hover:text-primary break-words"
                    title={`搜索${drug.productName || drug.productNameEn || ''}相关药品`}
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
                </div>
              </div>
              
              {/* 厂商名称 */}
              <div className="mt-1 text-xs text-gray-700 truncate">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    onRelatedSearch('manufacturer', drug.manufacturerName)
                  }}
                  className="hover:text-primary"
                  title={`搜索${drug.manufacturerName}相关药品`}
                >
                  <HighlightText 
                    text={drug.manufacturerName}
                    matches={getMatches(drug.matches, 'manufacturerName')}
                  />
                </button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
} 