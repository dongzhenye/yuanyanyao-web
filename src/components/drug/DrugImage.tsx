import React from 'react';
import { Drug } from '@/lib/types';
import { BaseDrugImage } from '@/components/common/BaseDrugImage';

interface DrugImageProps {
  drug: Drug;
}

export const DrugImage: React.FC<DrugImageProps> = ({ drug }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">药品图片</h2>
      <div className="aspect-square w-full relative bg-gray-100 rounded-md overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <BaseDrugImage 
            drug={drug}
            width={300}
            height={300}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        {drug.imageUrl ? '' : '暂无实际图片，显示为占位图'}
      </p>
    </div>
  );
}; 