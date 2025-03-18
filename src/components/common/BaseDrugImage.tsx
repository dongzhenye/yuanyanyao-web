import React, { useEffect, useRef } from 'react';
import { Drug } from '@/lib/types';
import { renderDrugImage } from '@/lib/drugImageRenderer';
import Image from 'next/image';

interface BaseDrugImageProps {
  drug: Drug;
  width?: number;
  height?: number;
  className?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

// 真实图片组件
const RealDrugImage: React.FC<BaseDrugImageProps> = ({
  drug,
  width = 300,
  height = 300,
  className,
  onLoad,
  onError
}) => (
  <div className={`relative ${className}`} style={{ width, height }}>
    <Image
      src={drug.imageUrl!}
      alt={`${drug.brandName.cn} ${drug.productName}`}
      fill
      className="object-contain"
      sizes={width <= 96 ? '96px' : '(max-width: 768px) 100vw, 50vw'}
      onLoad={onLoad}
      onError={() => onError?.(new Error('Failed to load image'))}
    />
  </div>
);

// 自动生成图片组件
const GeneratedDrugImage: React.FC<BaseDrugImageProps> = ({
  drug,
  width = 300,
  height = 300,
  className,
  onLoad,
  onError
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = async () => {
      try {
        await renderDrugImage(canvas, drug, {
          width,
          height,
          devicePixelRatio: dpr
        });
        if (mountedRef.current) {
          onLoad?.();
        }
      } catch (error) {
        console.error('Failed to render drug image:', error);
        if (mountedRef.current) {
          onError?.(error as Error);
        }
      }
    };

    render();
  }, [drug, width, height, onLoad, onError]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: 'block'
      }}
    />
  );
};

// 主组件
export const BaseDrugImage: React.FC<BaseDrugImageProps> = (props) => {
  if (props.drug.imageUrl) {
    return <RealDrugImage {...props} />;
  }
  return <GeneratedDrugImage {...props} />;
}; 