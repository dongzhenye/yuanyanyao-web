// 如果需要这个类型，保留导入；如果不需要，删除导入

// 定义拼音搜索字段类型
interface PinyinSearch {
  genericName: {
    full: string
    short: string
  }
  brandName: {
    full: string
    short: string
  }
  mah: {
    full: string
    short: string
  }
}

// 定义核心数据类型
export interface Drug {
  // 基础信息
  id: string          
  
  // 注册信息
  registrationType: "境内生产药品" | "境外生产药品"
  identifier: string       // 统一标识符（国药准字）
  
  // 名称信息
  inn: string        // 国际非专利药品名
  genericName: string // 通用名
  productName: string // 产品名
  productNameEn?: string // 英文产品名
  brandName: {
    cn: string       // 中文商品名
    en?: string      // 英文商品名
  }
  
  // 产品信息
  category: "化学药品" | "生物制品" | "中药" | "天然药物"
  formulation: string // 剂型
  specification: string // 规格
  packageSpec?: string // 包装规格
  
  // 企业信息
  mahName: string    // 上市许可持有人
  manufacturerName: string // 生产商
  packagingName?: string  // 分装企业（仅进口分装）
  
  // 原研信息
  isOriginal: boolean // 是否原研
  originator: string  // 原研厂商
  
  // 图片信息
  imageUrl?: string   // 药品图片URL
  
  lastUpdated: string // 最后更新日期
  approvalNumber?: string  // 仅国产药
  registrationNumber?: string  // 仅进口药
  originatorSource?: Array<{
    type: "药监局公告" | "FDA橙皮书" | "企业声明"
    url: string
  }>
  originalException?: string
  approvalDate: string  // 添加这个字段
  isOTC: boolean      // 是否OTC药品
}

// 扩展带拼音的药品类型
export interface DrugWithPinyin extends Drug {
  searchPinyin: PinyinSearch
}

// 添加搜索历史类型
export interface SearchHistoryItem {
  searchTerm: string
  filters: string[]
  timestamp: number
}

// 扩展搜索结果项类型
export interface SearchResultItem extends DrugWithPinyin {
  score: number
  sortScore: number
  matches: Array<{
    key: string
    indices: Array<[number, number]>
  }> | undefined
  relatedCounts?: {
    sameGeneric: number
    sameBrand: number
    sameMah: number
  }
}

export interface RenderOptions {
  width: number;
  height: number;
  devicePixelRatio?: number;
}

// 定义搜索类型
export type SearchType = 'generic' | 'brand' | 'mah' 