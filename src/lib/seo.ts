import { DefaultSeoProps } from 'next-seo'

export const defaultSEO: DefaultSeoProps = {
  titleTemplate: '%s | 原研药查询',
  defaultTitle: '原研药查询 - 专业的原研药品信息平台',
  description: '提供最全面、及时的原研药品信息查询服务，包括通用名、商品名、厂商等多维度搜索。',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://yuanyanyao.org',
    siteName: '原研药查询',
    title: '原研药查询 - 专业的原研药品信息平台',
    description: '提供最全面、及时的原研药品信息查询服务，包括通用名、商品名、厂商等多维度搜索。',
    images: [
      {
        url: 'https://yuanyanyao.org/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '原研药查询',
      },
    ],
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: '原研药,药品查询,通用名,商品名,国药准字,处方药,仿制药'
    }
  ]
} 