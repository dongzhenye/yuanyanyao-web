import React, { useEffect, useRef } from 'react';
import { Drug } from '@/lib/types';
import { renderDrugImage } from '@/lib/drugImageRenderer';

interface BaseDrugImageProps {
  drug: Drug;
  width?: number;
  height?: number;
  className?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export const BaseDrugImage: React.FC<BaseDrugImageProps> = ({
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
    // 在组件挂载时获取 DPR，并在整个生命周期保持一致
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
        // 确保组件仍然挂载时才调用回调
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

    // 清理函数
    return () => {
      mountedRef.current = false;
    };
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