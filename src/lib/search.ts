import Fuse from 'fuse.js'
import { Drug, SearchResultItem } from './types'
import drugsData from '@/data/drugs.json'

const fuseOptions = {
  keys: [
    { name: 'genericName', weight: 2 },
    { name: 'brandName.cn', weight: 2 },
    { name: 'brandName.en', weight: 1.5 },
    { name: 'identifier', weight: 1 },
    'productName',
    'mahName',
    'manufacturerName'
  ],
  threshold: 0.3,
  includeMatches: true
}

const fuse = new Fuse(drugsData.drugs as Drug[], fuseOptions)

export function searchDrugs(query: string): SearchResultItem[] {
  if (!query.trim()) return []
  
  return fuse.search(query).map(result => ({
    ...result.item,
    score: result.score || 1,
    matches: result.matches
  }))
}

export function getDrugById(id: string): Drug | null {
  return (drugsData.drugs as Drug[]).find(drug => drug.id === id) || null
} 