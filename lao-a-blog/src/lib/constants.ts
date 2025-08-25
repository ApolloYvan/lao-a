export const SITE_CONFIG = {
  name: '老A的B面',
  description: '大厂码农的技术分享与思考',
  author: '老A',
  url: 'https://lao-a-blog.vercel.app',
  ogImage: '/images/og-image.jpg',
  links: {
    github: 'https://github.com/lao-a',
    twitter: 'https://twitter.com/lao-a',
    email: 'contact@lao-a.com',
  },
}

export const AUTHOR_INFO = {
  name: '老A',
  title: '大厂码农',
  bio: '一线大厂7年Java专家，团队面试官',
  avatar: '/images/laoa.jpg',
  qrcode: '/images/qrcode.jpg',
  social: {
    github: 'https://github.com/lao-a',
    twitter: 'https://twitter.com/lao-a',
    email: 'contact@lao-a.com',
    wechat: 'lao-a-wechat',
  },
}

export const NAVIGATION_ITEMS = [
  { name: '首页', href: '/' },
  { name: '分类', href: '/categories' },
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
      { name: 'Twitter', href: AUTHOR_INFO.social.twitter },
      { name: '邮箱', href: `mailto:${AUTHOR_INFO.social.email}` },
    ],
  },
]
