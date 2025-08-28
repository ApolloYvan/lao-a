export const SITE_CONFIG = {
  name: '老A的B面',
  description: '大厂码农的技术分享与思考',
  author: '老A',
  url: 'https://lao-a-blog.vercel.app',
  ogImage: '/images/og-image.jpg',
  links: {
    github: 'https://github.com/lao-a',
    juejin: 'https://juejin.cn/user/2147803289619047/posts',
    csdn: 'https://blog.csdn.net/2501_93134156?spm=1000.2115.3001.5343',
    zhihu: 'https://www.zhihu.com/people/a-67-48-19-74',
    email: 'contact@lao-a.com',
  },
}

export const AUTHOR_INFO = {
  name: '老A',
  title: '大厂码农',
  bio: '一线大厂7年Java专家，团队面试官',
  avatar: '/images/laoa.jpg',
  qrcode: '/images/qrcode.jpg',
  xingqiuQrcode: '/images/xingqiu_qrcode.jpg',
  social: {
    github: 'https://github.com/ApolloYvan/lao-a',
    juejin: 'https://juejin.cn/user/2147803289619047/posts',
    csdn: 'https://blog.csdn.net/2501_93134156?spm=1000.2115.3001.5343',
    zhihu: 'https://www.zhihu.com/people/a-67-48-19-74',
    email: 'yvan0603@163.com',
    wechat: '大厂码农老A',
    xingqiu: 'lao-a-talk'
  },
}

export const NAVIGATION_ITEMS = [
  { name: '首页', href: '/' },
  { name: '分类', href: '/categories' },
  { name: '搜索', href: '/search' },
  { name: '关于', href: '/about' },
  { name: '联系', href: '/contact' },
]

export const FOOTER_LINKS = [
  {
    title: '导航',
    links: [
      { name: '首页', href: '/' },
      { name: '分类', href: '/categories' },
      { name: '关于', href: '/about' },
      { name: '联系', href: '/contact' },
    ],
  },
  {
    title: '社交',
    links: [
      { name: 'GitHub', href: AUTHOR_INFO.social.github },
      { name: '稀土掘金', href: AUTHOR_INFO.social.juejin },
      { name: 'CSDN', href: SITE_CONFIG.links.csdn },
      { name: '知乎', href: SITE_CONFIG.links.zhihu },
      { name: '邮箱', href: `mailto:${AUTHOR_INFO.social.email}` },
    ],
  },
]
