import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const AboutPage: NextPage = () => {
  return (
    <>
      <NextSeo
        title="关于本站 | 原研药查询"
        description="原研药查询网站是一个专业的原研药品信息检索平台，提供快速准确的原研药品信息查询服务。"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
        <Header />
        
        <main className="container max-w-4xl mx-auto px-4 py-8">
          <div className="prose prose-blue max-w-none">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">关于本站</h1>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900">站点定位</h2>
              <p className="text-gray-600">
                原研药查询网站致力于为医疗从业者和患者提供专业、便捷的原研药品信息检索服务。
                我们整合了权威数据源，提供快速准确的搜索功能，帮助用户快速找到所需的原研药品信息。
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900">原研药定义</h2>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                <p className="text-gray-700 mb-2">
                  根据国家药品监督管理局的规定，原研药是指：
                </p>
                <p className="text-gray-600">
                  境内外首个获准上市，且具有完整和充分的安全性、有效性数据作为上市依据的药品。
                </p>
              </div>
              <p className="text-gray-600">
                原研药通常由原创性药物研发机构研发，经过完整的临床研究，
                并首次获得各国药品监管机构批准上市的药品。这些药品的安全性和有效性数据最为完整，
                质量标准通常被作为同类药品的参照。
              </p>
              <p className="text-sm text-gray-500 mt-2">
                数据来源：
                <a 
                  href="https://www.nmpa.gov.cn/directory/web/nmpa/xxgk/kpzhsh/kpzhshyp/20171024171601233.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-dark ml-1"
                >
                  国家药品监督管理局
                </a>
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900">数据来源</h2>
              <p className="text-gray-600">
                本站数据来自《原研药数据库》，该开源数据库基于国家药品监督管理局公开数据整理而成。
                数据持续更新，确保信息的准确性和时效性。
              </p>
              <div className="flex items-center gap-2 mt-4">
                <a 
                  href="https://github.com/dongzhenye/yuanyanyao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-dark"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  查看数据库
                </a>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900">常见问题</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900">如何判断一个药品是否为原研药？</h3>
                  <p className="text-gray-600">
                    可以通过本网站搜索药品名称，查看药品详情中的&quot;原研信息&quot;部分。
                    我们会标注药品的原研状态、认定依据等信息。
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">数据多久更新一次？</h3>
                  <p className="text-gray-600">
                    我们会定期同步原研药数据库的更新。每条药品信息都标注了最后更新时间，
                    您可以在药品详情页查看。
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">发现数据有误怎么办？</h3>
                  <p className="text-gray-600">
                    您可以点击页面底部的&quot;我要纠错&quot;链接，通过 GitHub Issues 向我们反馈。
                    我们会及时核实并更正。
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

export default AboutPage 