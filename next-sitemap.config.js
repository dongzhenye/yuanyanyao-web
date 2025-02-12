/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://yuanyanyao.org',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/404', '/500'],
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://yuanyanyao.org/sitemap.xml',
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/404', '/500']
      }
    ]
  },
} 