interface SiteStats {
  total: number
  lastUpdate: Date
}

export const siteConfig = {
  name: '原研药查询',
  getSubtitle: (stats: SiteStats) => {
    const days = Math.floor((Date.now() - stats.lastUpdate.getTime()) / (1000 * 60 * 60 * 24))
    
    // 根据时间跨度选择合适的显示方式
    let timeText
    if (days < 1) {
      timeText = '今天'
    } else if (days < 7) {
      timeText = `${days}天前`
    } else if (days < 30) {
      const weeks = Math.floor(days / 7)
      timeText = `${weeks}周前`
    } else if (days < 365) {
      const months = Math.floor(days / 30)
      timeText = `${months}个月前`
    } else {
      timeText = '较长时间前'
    }
    
    return `已收录${stats.total}种药品，更新于${timeText}，来自`
  },
  databaseUrl: 'https://github.com/dongzhenye/yuanyanyao',
  description: '专业的原研药品查询工具，提供药品通用名、商品名、厂商等信息检索，支持实时搜索和标签筛选。',
  keywords: ['原研药', '药品查询', '通用名', '商品名', '国药准字']
} 