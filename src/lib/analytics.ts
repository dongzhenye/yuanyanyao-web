type EventNames = 
  | 'search'
  | 'filter_change' 
  | 'related_search'
  | 'view_drug'

interface EventParams {
  search: {
    term: string
    results_count: number
  }
  filter_change: {
    filters: string[]
  }
  related_search: {
    from: string
    to: string
    type: 'generic' | 'brand' | 'manufacturer'
  }
  view_drug: {
    drug_id: string
    drug_name: string
  }
}

// 定义 gtag 函数类型
declare global {
  interface Window {
    gtag: (
      command: 'event',
      eventName: string,
      eventParameters: object
    ) => void
  }
}

export function trackEvent<T extends EventNames>(
  eventName: T,
  params: EventParams[T]
) {
  // 确保 gtag 存在
  if (typeof window !== 'undefined' && 'gtag' in window) {
    window.gtag('event', eventName, params)
  }
} 