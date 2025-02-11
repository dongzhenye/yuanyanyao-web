// 添加工具函数
export function formatRegistrationType(type: string): string {
  return type === "境外生产药品" ? "进口药" : "国产药"
}

// 添加反向转换函数
export function toBackendRegistrationType(displayType: string): string {
  return displayType === "进口药" ? "境外生产药品" : "境内生产药品"
}

// 添加商标标识格式化函数
export const formatBrandName = (name: string) => {
  if (!name) return ''
  
  // 如果源数据已经包含商标符号，不再添加
  if (name.includes('®') || name.includes('™')) {
    return name
  }
  
  // 添加商标符号
  return `${name}®`
} 