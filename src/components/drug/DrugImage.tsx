import React from 'react'
import type { Drug } from '@/lib/types'

interface DrugImageProps {
  drug: Drug
}

// 生成药品图片的URL
const getDrugImageUrl = (drug: Drug): string => {
  // 如果药品有图片URL，优先使用
  if (drug.imageUrl) {
    return drug.imageUrl;
  }
  
  // 否则使用占位图片
  return `https://via.placeholder.com/400x400?text=${encodeURIComponent(drug.brandName.cn || drug.brandName.en || drug.genericName)}`
}

export const DrugImage: React.FC<DrugImageProps> = ({ drug }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3">药品图片</h3>
      <div className="bg-gray-100 rounded-md overflow-hidden">
        <div className="aspect-square relative">
          <img 
            src={getDrugImageUrl(drug)}
            alt={`${drug.brandName.cn || drug.brandName.en || drug.genericName}图片`}
            className="object-contain w-full h-full p-2"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        {drug.imageUrl ? '' : '暂无实际图片，显示为占位图'}
      </p>
    </div>
  )
}
