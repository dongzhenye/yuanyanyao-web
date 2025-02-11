import React from 'react'
import { DrugWithPinyin } from '@/lib/types'
import { formatBrandName } from '@/lib/utils'

interface DrugNamesProps {
  drug: DrugWithPinyin
}

export const DrugNames: React.FC<DrugNamesProps> = ({ drug }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">名称信息</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 通用名 */}
          <div>
            <div className="text-sm text-gray-500">通用名</div>
            <div className="mt-1">{drug.genericName}</div>
          </div>

          {/* 产品名 */}
          <div>
            <div className="text-sm text-gray-500">产品名</div>
            <div className="mt-1">
              <div>{drug.productName}</div>
              {drug.productNameEn && (
                <div className="text-sm text-gray-500 mt-1">
                  {drug.productNameEn}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 商品名 */}
        <div>
          <div className="text-sm text-gray-500">商品名</div>
          <div className="mt-1">
            <div>{formatBrandName(drug.brandName.cn)}</div>
            {drug.brandName.en && (
              <div className="text-sm text-gray-500 mt-1">
                {formatBrandName(drug.brandName.en)}
              </div>
            )}
          </div>
        </div>

        {/* 国际非专利名 */}
        {drug.inn && (
          <div>
            <div className="text-sm text-gray-500">国际非专利名</div>
            <div className="mt-1">{drug.inn}</div>
          </div>
        )}
      </div>
    </div>
  )
} 