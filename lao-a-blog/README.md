# 老A的B面 - 个人博客


一个基于Next.js的现代化个人博客，支持从GitHub动态获取内容。

## 🚀 特性

- **动态内容更新**：通过GitHub API实时获取文章内容
- **自动部署**：GitHub Webhook自动触发重新部署
- **语法高亮**：代码块支持多种编程语言高亮
- **响应式设计**：完美适配移动端和桌面端
- **SEO优化**：静态生成，搜索引擎友好
- **性能优化**：图片优化、字体本地化、CLS防护

## 📋 环境变量配置

创建 `.env.local` 文件并配置以下环境变量：

```bash
# GitHub配置
GITHUB_REPO=your-username/your-blog-repo
GITHUB_BRANCH=main
GITHUB_TOKEN=your-github-personal-access-token

# GitHub Webhook配置
GITHUB_WEBHOOK_SECRET=your-webhook-secret

# Vercel部署配置
VERCEL_DEPLOY_HOOK=https://api.vercel.com/v1/integrations/deploy/your-deploy-hook-url
```

### 获取GitHub Token

1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token"
3. 选择 "repo" 权限
4. 复制生成的token

### 配置GitHub Webhook

1. 在你的GitHub仓库中，进入 Settings > Webhooks
2. 点击 "Add webhook"
3. 配置以下参数：
   - **Payload URL**: `https://your-domain.com/api/webhook/github`
   - **Content type**: `application/json`
   - **Secret**: 设置一个安全的密钥
   - **Events**: 选择 "Just the push event"
4. 保存webhook

## 📁 项目结构

```
lao-a-blog/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API路由
│   │   │   ├── articles/      # 文章API
│   │   │   └── webhook/       # Webhook处理
│   │   ├── posts/[slug]/      # 文章详情页
│   │   └── page.tsx           # 首页
│   ├── components/            # React组件
│   │   ├── layout/           # 布局组件
│   │   ├── post/             # 文章相关组件
│   │   ├── ui/               # UI组件
│   │   └── widgets/          # 侧边栏组件
│   └── lib/                  # 工具函数
│       ├── content-api.ts    # 内容API接口
│       └── utils.ts          # 通用工具
├── content/                  # 本地内容（开发用）
├── public/                   # 静态资源
└── package.json
```

## 🛠️ 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 📝 内容管理

### 文章格式

文章使用Markdown格式，支持Front Matter：

```markdown
---
title: "文章标题"
date: "2024-01-15"
summary: "文章摘要"
tags: ["标签1", "标签2"]
category: "分类"
coverImage: "/images/posts/cover.jpg"
readingTime: 5
published: true
---

# 文章内容

这里是文章正文...
```

### 发布新文章

1. 在GitHub仓库的 `content/posts/` 目录下创建新的 `.md` 或 `.mdx` 文件
2. 编写文章内容，包含必要的Front Matter
3. 提交并推送到GitHub
4. Webhook会自动触发重新部署

## 🚀 部署

### Vercel部署

1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 配置环境变量
4. 部署完成

### 自定义域名

在Vercel项目设置中配置自定义域名。

## 🔧 自定义

### 修改主题

编辑 `src/app/globals.css` 中的CSS变量：

```css
:root {
  --background: #F9FAFB;
  --foreground: #1F2937;
  --primary: #3b82f6;
}
```

### 添加新组件

在 `src/components/` 目录下创建新组件。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！
