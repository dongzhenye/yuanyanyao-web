import React from 'react'
import Link from 'next/link'
import { DrugWithPinyin } from '@/lib/types'
import { formatBrandName } from '@/lib/utils'

interface RelatedDrugsProps {
  sameGeneric: DrugWithPinyin[]
  sameManufacturer: DrugWithPinyin[]
}

export const RelatedDrugs: React.FC<RelatedDrugsProps> = ({ 
  sameGeneric, 
  sameManufacturer 
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
                  {formatBrandName(drug.brandName.cn)}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {drug.manufacturerName}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 同厂商药品 */}
      {sameManufacturer.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">同厂商药品</h2>
          <div className="space-y-4">
            {sameManufacturer.map(drug => (
              <Link
                key={drug.id}
                href={`/drug/${drug.id}`}
                className="block hover:bg-gray-50 -mx-6 px-6 py-3"
              >
                <div className="font-medium text-gray-900">
                  {drug.genericName}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {formatBrandName(drug.brandName.cn)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 