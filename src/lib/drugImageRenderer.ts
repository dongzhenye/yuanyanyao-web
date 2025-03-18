import { Drug, RenderOptions } from './types';
import { getFormulationIcon, loadIcon, CERTIFICATION_ICONS } from './iconManager';
import { getCachedImage, setCachedImage, clearCache } from './imageCache';

// 生成背景颜色
export const generateBackgroundColor = (brandName: string, manufacturer: string): string => {
  // 使用品牌名称和厂商信息生成一致的哈希值
  const str = `${brandName}${manufacturer}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // 将哈希值转换为HSL颜色
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 35%, 95%)`;
};

// 从背景色生成图标颜色
export const generateIconColor = (backgroundColor: string): string => {
  const hueMatch = backgroundColor.match(/hsl\((\d+)/);
  if (!hueMatch || !hueMatch[1]) return 'hsl(0, 70%, 40%)';
  
  const hue = parseInt(hueMatch[1]);
  return `hsl(${hue}, 70%, 40%)`;
};

// 在临时画布上绘制并着色SVG图标
const drawColoredIcon = async (
  ctx: CanvasRenderingContext2D,
  iconSrc: string,
  x: number,
  y: number,
  size: number,
  color: string,
  alpha: number = 0.7
): Promise<void> => {
  const icon = await loadIcon(iconSrc);
  
  // 创建临时画布
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = size;
  tempCanvas.height = size;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  // 绘制颜色
  tempCtx.fillStyle = color;
  tempCtx.fillRect(0, 0, size, size);

  // 使用图标作为蒙版
  tempCtx.globalCompositeOperation = 'destination-in';
  tempCtx.drawImage(icon, 0, 0, size, size);

  // 绘制到主画布
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(tempCanvas, x, y);
  ctx.restore();
};

// 渲染药品图片
export const renderDrugImage = async (
  canvas: HTMLCanvasElement,
  drug: Drug,
  options: RenderOptions
): Promise<void> => {
  const { width, height, devicePixelRatio = 1 } = options;

  // 设置canvas尺寸，考虑设备像素比
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 包含 devicePixelRatio 的缓存键
  const cacheKey = {
    drugId: drug.id,
    width,
    height,
    devicePixelRatio
  };
  
  const cachedImage = getCachedImage(cacheKey);
  if (cachedImage) {
    const img = new Image();
    img.src = cachedImage;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        // 直接绘制缓存的图片，不需要再次缩放
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve();
      };
      img.onerror = () => {
        console.warn('Failed to load cached image, regenerating...');
        // 缓存加载失败时，删除缓存并重新渲染
        clearCache(cacheKey);
        reject(new Error('Failed to load cached image'));
      };
    });
    return;
  }

  // 清除画布并设置缩放
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.scale(devicePixelRatio, devicePixelRatio);

  // 获取药品名称和厂商
  const brandName = drug.brandName.cn || drug.brandName.en || drug.genericName || '';
  const manufacturer = drug.manufacturerName;

  // 绘制背景
  const bgColor = generateBackgroundColor(brandName, manufacturer);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // 生成图标颜色
  const iconColor = generateIconColor(bgColor);

  // 绘制商品名（左上角）
  const fontSize = width/15;
  ctx.fillStyle = iconColor;
  ctx.font = `${fontSize}px PingFang SC, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(brandName, width * 0.1, height * 0.1 + fontSize * 0.1);

  // 绘制通用名（第二行）
  if (drug.genericName) {
    const productName = drug.genericName.length > 7 ? 
      drug.genericName.substring(0, 7) + '...' : 
      drug.genericName;

    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = iconColor;
    ctx.font = `${fontSize}px PingFang SC, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(productName, width * 0.1, height * 0.1 + fontSize * 0.1 + fontSize * 1.2);
    ctx.restore();
  }

  // 绘制OTC/处方药标志（右上角）
  if (drug.isOTC) {
    // 绘制OTC标志
    const badgeWidth = width * 0.25;
    const badgeHeight = width * 0.15;
    const x = width * 0.9 - badgeWidth;
    const y = height * 0.1;

    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = 'rgba(220, 38, 38, 0.8)';
    ctx.beginPath();
    ctx.ellipse(x + badgeWidth/2, y + badgeHeight/2, badgeWidth/2, badgeHeight/2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${badgeHeight*0.6}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('OTC', x + badgeWidth/2, y + badgeHeight/2 + badgeHeight*0.05);
    ctx.restore();
  } else {
    // 绘制处方药标志
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#4A5568';
    ctx.font = `bold ${width/12}px PingFang SC, sans-serif`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText('处方药', width * 0.9, height * 0.1);
    ctx.restore();
  }

  // 绘制剂型图标（中心偏下）
  const iconSize = width * 0.45;
  const iconX = width/2 - iconSize/2;
  const iconY = height/2 - iconSize/2 + height/20;
  await drawColoredIcon(
    ctx,
    getFormulationIcon(drug.formulation),
    iconX,
    iconY,
    iconSize,
    iconColor,
    0.7
  );

  // 绘制厂商名称（左下角）
  const shortMfr = manufacturer.substring(0, 6);
  ctx.fillStyle = iconColor;
  ctx.font = `${width/18}px PingFang SC, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText(shortMfr, width * 0.1, height * 0.9);

  // 绘制原研药水印（右下角）
  if (drug.isOriginal) {
    const watermarkSize = width * 0.6;
    const watermarkX = width * 0.9 - watermarkSize/2 - width/20;
    const watermarkY = height * 0.9 - watermarkSize/2 - width/20;
    await drawColoredIcon(
      ctx,
      CERTIFICATION_ICONS.ORIGINAL,
      watermarkX,
      watermarkY,
      watermarkSize,
      iconColor,
      0.1
    );
  }

  // 缓存渲染结果
  try {
    const dataUrl = canvas.toDataURL('image/png');
    setCachedImage(cacheKey, dataUrl);
  } catch (error) {
    console.warn('Failed to cache drug image:', error);
  }
}; 