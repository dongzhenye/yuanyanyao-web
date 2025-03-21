import React from 'react'
import Link from 'next/link'
import { DrugWithPinyin } from '@/lib/types'
import { BrandName } from '@/components/common/BrandName'

interface RelatedDrugsProps {
  sameGeneric: DrugWithPinyin[]
  sameMah: DrugWithPinyin[]
}

export const RelatedDrugs: React.FC<RelatedDrugsProps> = ({ 
  sameGeneric, 
  sameMah 
}) => {
  return (
    <div className="space-y-6">
      {/* 同类药品 */}
      {sameGeneric.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">同类药品</h2>
          <div className="space-y-4">
            {sameGeneric.map(drug => (
              <Link
                key={drug.id}
                href={`/drug/${drug.id}`}
                className="block hover:bg-gray-50 -mx-6 px-6 py-3"
              >
                <div className="font-medium text-gray-900">
                  <BrandName name={drug.brandName.cn} />
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {drug.mahName}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 同上市许可持有人药品 */}
      {sameMah.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">同上市许可持有人药品</h2>
          <div className="space-y-4">
            {sameMah.map(drug => (
              <Link
                key={drug.id}
                href={`/drug/${drug.id}`}
                className="block hover:bg-gray-50 -mx-6 px-6 py-3"
              >
                <div className="font-medium text-gray-900">
                  {drug.genericName}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  <BrandName name={drug.brandName.cn} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 