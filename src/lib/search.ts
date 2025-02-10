import Fuse from 'fuse.js'
import { Drug, SearchResultItem } from './types'
import drugsData from '@/data/drugs.json'
import { pinyin } from 'pinyin-pro'

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
    manufacturer: {
      full: pinyin(drug.manufacturerName, { toneType: 'none' }).replace(/\s/g, ''),
      short: pinyin(drug.manufacturerName, { pattern: 'first', toneType: 'none' })
    }
  }
}))

const fuseOptions = {
  keys: [
    // 主要搜索字段（更高权重）
    { name: 'genericName', weight: 4 },     // 通用名
    { name: 'brandName.cn', weight: 4 },    // 中文商品名
    { name: 'brandName.en', weight: 3.5 },  // 英文商品名
    { name: 'manufacturerName', weight: 3 }, // 厂商名
    
    // 拼音搜索（中等权重）
    { name: 'searchPinyin.genericName.full', weight: 2.5 },
    { name: 'searchPinyin.genericName.short', weight: 2.5 },
    { name: 'searchPinyin.brandName.full', weight: 2.5 },
    { name: 'searchPinyin.brandName.short', weight: 2.5 },
    { name: 'searchPinyin.manufacturer.full', weight: 2.5 },
    { name: 'searchPinyin.manufacturer.short', weight: 2.5 },
    
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

const fuse = new Fuse(drugsWithPinyin as Drug[], fuseOptions)

export function searchDrugs(query: string): SearchResultItem[] {
  if (!query.trim()) return []
  
  const results = fuse.search(query)
  
  // 优化排序规则
  return results
    .map(result => ({
      ...result.item,
      score: result.score || 1,
      matches: result.matches,
      // 添加额外的排序因素
      sortScore: calculateSortScore(result.item, result.score || 1)
    }))
    .sort((a, b) => {
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

export function getDrugById(id: string): Drug | null {
  return drugsWithPinyin.find(drug => drug.id === id) || null
} 