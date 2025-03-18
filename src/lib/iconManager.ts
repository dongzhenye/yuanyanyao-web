export const FORMULATION_ICONS = {
  '片剂': '/icons/formulations/tablet.svg',
  '胶囊': '/icons/formulations/capsule.svg',
  '注射剂': '/icons/formulations/injection.svg',
  '口服液': '/icons/formulations/liquid.svg',
  '混悬液': '/icons/formulations/liquid.svg',
  '粉剂': '/icons/formulations/powder.svg',
  '滴眼液': '/icons/formulations/eye-drops.svg',
  '喷雾剂': '/icons/formulations/spray.svg',
  '贴剂': '/icons/formulations/patch.svg',
  '肠溶片': '/icons/formulations/tablet.svg',
  '滴丸': '/icons/formulations/pill.svg',
  '默认': '/icons/formulations/tablet.svg'
} as const;

export const CERTIFICATION_ICONS = {
  ORIGINAL: '/icons/badges/original-drug.svg',
  OTC: '/icons/badges/otc.svg',
} as const;

export type FormulationType = keyof typeof FORMULATION_ICONS;

// 加载并缓存图标
const iconCache = new Map<string, HTMLImageElement>();

export const loadIcon = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const cachedIcon = iconCache.get(src);
    if (cachedIcon) {
      resolve(cachedIcon);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      iconCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => reject(new Error(`Failed to load icon: ${src}`));
    img.src = src;
  });
};

// 获取剂型图标
export const getFormulationIcon = (formulation: string): string => {
  return FORMULATION_ICONS[formulation as FormulationType] || FORMULATION_ICONS['默认'];
}; 