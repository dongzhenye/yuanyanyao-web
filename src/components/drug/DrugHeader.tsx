import React from 'react'
import Link from 'next/link'
import { DrugWithPinyin } from '@/lib/types'
import { formatBrandName } from '@/lib/utils'

interface DrugHeaderProps {
  drug: DrugWithPinyin
}

export const DrugHeader: React.FC<DrugHeaderProps> = ({ drug }) => {
  // 统一的标题拼接规则
  const titleText = `${formatBrandName(drug.brandName.cn)} ${drug.productName}`

  return (
    <div>
      {/* 面包屑导航 */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-primary">
          首页
        </Link>
        <span>/</span>
        <span>{titleText}</span>
      </nav>
      
      {/* 药品标题区 */}
      <div className="mt-4">
        {/* 中文名称行 */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900">
            {formatBrandName(drug.brandName.cn)}
          </h1>
          <span className="text-xl text-gray-600">
            {drug.productName}
          </span>
          {drug.isOriginal && (
            <span className="inline-flex items-center gap-0.5 px-2.5 py-1 text-[15px] rounded-full bg-primary/10 text-primary">
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

        {/* 英文名称行 */}
        {drug.brandName.en && (
          <div className="mt-2 text-base text-gray-400">
            {formatBrandName(drug.brandName.en)}
            {drug.productNameEn && (
              <span className="ml-2">
                ({drug.productNameEn})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 