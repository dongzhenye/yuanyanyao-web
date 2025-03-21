import Fuse from 'fuse.js'
import { Drug, DrugWithPinyin, SearchResultItem } from './types'
import drugsData from '@/data/drugs.json'
import { pinyin } from 'pinyin-pro'
import { z } from 'zod'

// 为每个药品添加拼音搜索字段
const drugsWithPinyin = drugsData.drugs.map(drug => ({
  ...drug,
  // 添加拼音和简拼字段用于搜索
  searchPinyin: {
    genericName: {
      full: pinyin(drug.genericName, { toneType: 'none' }).replace(/\s/g, ''),
      short: pinyin(drug.genericName, { pattern: 'first', toneType: 'none' })
    },
    brandName: {
      full: pinyin(drug.brandName.cn, { toneType: 'none' }).replace(/\s/g, ''),
      short: pinyin(drug.brandName.cn, { pattern: 'first', toneType: 'none' })
    },
    mah: {
      full: pinyin(drug.mahName, { toneType: 'none' }).replace(/\s/g, ''),
      short: pinyin(drug.mahName, { pattern: 'first', toneType: 'none' })
    }
  }
})) as DrugWithPinyin[]

const fuseOptions = {
  keys: [
    // 主要搜索字段（更高权重）
    { name: 'genericName', weight: 4 },     // 通用名
    { name: 'brandName.cn', weight: 4 },    // 中文商品名
    { name: 'brandName.en', weight: 3.5 },  // 英文商品名
    { name: 'mahName', weight: 3 },         // 上市许可持有人
    
    // 拼音搜索（中等权重）
    { name: 'searchPinyin.genericName.full', weight: 2.5 },
    { name: 'searchPinyin.genericName.short', weight: 2.5 },
    { name: 'searchPinyin.brandName.full', weight: 2.5 },
    { name: 'searchPinyin.brandName.short', weight: 2.5 },
    { name: 'searchPinyin.mah.full', weight: 2.5 },
    { name: 'searchPinyin.mah.short', weight: 2.5 },
    
    // 次要搜索字段（较低权重）
    { name: 'productName', weight: 2 },
    { name: 'formulation', weight: 1.5 },
    { name: 'category', weight: 1 }
  ],
  threshold: 0.4,
  distance: 100,
  minMatchCharLength: 1,
  includeMatches: true,
  ignoreLocation: true,    // 允许在任意位置匹配
  useExtendedSearch: true  // 启用扩展搜索
}

const fuse = new Fuse(drugsWithPinyin, fuseOptions)

// 定义数据验证schema
const DrugSchema = z.object({
  id: z.string(),
  registrationType: z.enum(["境内生产药品", "境外生产药品"]),
  identifier: z.string(),
  inn: z.string().optional(),
  genericName: z.string(),
  productName: z.string(),
  brandName: z.object({
    cn: z.string(),
    en: z.string().optional()
  }),
  category: z.enum(["化学药品", "生物制品", "中药", "天然药物"]),
  formulation: z.string(),
  specification: z.string(),
  mahName: z.string(),
  manufacturerName: z.string(),
  isOriginal: z.boolean(),
  originator: z.string(),
  lastUpdated: z.string()
})

// 修改验证方式
// 验证整个数据结构，包括 drugs 数组和 meta 信息
const DataSchema = z.object({
  drugs: z.array(DrugSchema),
  meta: z.object({
    total: z.number(),
    lastUpdate: z.string()
  })
})

// 验证整个数据文件
DataSchema.parse(drugsData)

export function searchDrugs(query: string): SearchResultItem[] {
  if (!query.trim()) return []
  
  const results = fuse.search(query)
  
  return results.map(result => {
    // 处理匹配结果
    const processedMatches = result.matches?.map(match => ({
      key: match.key || '',  // 确保 key 不为 undefined
      indices: match.indices.map(([start, end]) => [start, end] as [number, number])  // 确保类型正确
    }))

    return {
      ...result.item,
      score: result.score || 1,
      matches: processedMatches,
      sortScore: calculateSortScore(result.item, result.score || 1)
    }
  }).sort((a, b) => {
    // 首先按是否原研药排序
    if (a.isOriginal !== b.isOriginal) {
      return a.isOriginal ? -1 : 1
    }
    // 然后按匹配分数排序
    return a.sortScore - b.sortScore
  })
}

function calculateSortScore(drug: Drug, searchScore: number): number {
  let score = searchScore
  
  // 原研药加权
  if (drug.isOriginal) {
    score *= 0.8 // 提高20%权重
  }
  
  // 进口药加权
  if (drug.registrationType === "境外生产药品") {
    score *= 0.9 // 提高10%权重
  }
  
  return score
}

export function getDrugById(id: string): DrugWithPinyin | null {
  return drugsWithPinyin.find(drug => drug.id === id) || null
} 