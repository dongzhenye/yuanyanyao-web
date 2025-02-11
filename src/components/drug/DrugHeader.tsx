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
            <span className="px-2 py-0.5 text-sm rounded-full bg-primary/10 text-primary">
              原研药
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