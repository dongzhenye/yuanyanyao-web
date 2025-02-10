interface SiteStats {
  total: number
  lastUpdate: Date
}

export const siteConfig = {
  name: '原研药查询',
  getSubtitle: (stats: SiteStats) => {
    const days = Math.floor((Date.now() - stats.lastUpdate.getTime()) / (1000 * 60 * 60 * 24))
    // 限制最大显示天数为15天
    const displayDays = Math.min(days, 15)
    return `已收录${stats.total}种药品，更新于${displayDays}天前，来自`
  },
  databaseUrl: 'https://github.com/dongzhenye/yuanyanyao',
  description: '专业的原研药品查询工具，提供药品通用名、商品名、厂商等信息检索，支持实时搜索和标签筛选。',
  keywords: ['原研药', '药品查询', '通用名', '商品名', '国药准字']
} 