import React from 'react';
import { Drug } from '@/lib/types';
import { BaseDrugImage } from '@/components/common/BaseDrugImage';

interface DrugImageThumbnailProps {
  drug: Drug;
}

export const DrugImageThumbnail: React.FC<DrugImageThumbnailProps> = ({ drug }) => {
  return (
    <div className="w-24 h-24 flex-shrink-0">
      <BaseDrugImage 
        drug={drug}
        width={96}
        height={96}
        className="rounded-md"
      />
    </div>
  );
}; 