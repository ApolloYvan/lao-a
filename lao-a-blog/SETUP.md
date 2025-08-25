# GitHub配置指南

## 1. 创建GitHub仓库

首先，您需要创建一个GitHub仓库来存储博客文章：

1. 访问 [GitHub](https://github.com) 并登录
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 仓库名称建议：`lao-a-blog-content` 或 `blog-posts`
4. 设置为 Public 仓库（免费）
5. 不要初始化README文件
6. 点击 "Create repository"

## 2. 获取GitHub Personal Access Token

1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 设置Token名称：`Blog Content API`
4. 选择权限：
   - ✅ `repo` (Full control of private repositories)
   - ✅ `read:user` (Read access to user profile)
5. 点击 "Generate token"
6. **重要**：复制生成的token，它只会显示一次

## 3. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```bash
# GitHub配置
GITHUB_REPO=your-username/your-blog-repo
GITHUB_BRANCH=main
GITHUB_TOKEN=your-github-personal-access-token

# GitHub Webhook配置
GITHUB_WEBHOOK_SECRET=your-webhook-secret

# Vercel部署配置（可选）
VERCEL_DEPLOY_HOOK=https://api.vercel.com/v1/integrations/deploy/your-deploy-hook-url
```

请将以下内容替换为您的实际值：
- `your-username`: 您的GitHub用户名
- `your-blog-repo`: 您创建的仓库名称
- `your-github-personal-access-token`: 步骤2中生成的token

## 4. 创建文章目录结构

在您的GitHub仓库中创建以下目录结构：

```
content/
└── posts/
    ├── hello-world.md
    ├── react-best-practices.md
    └── ...
```

## 5. 文章格式

每篇文章使用以下格式：

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

## 6. 测试配置

配置完成后，运行以下命令测试：

```bash
npm run dev
```

访问 `http://localhost:3000` 查看博客是否正常加载文章。

## 7. 配置Webhook（可选）

如果您使用Vercel部署，可以配置GitHub Webhook实现自动部署：

1. 在您的GitHub仓库中，进入 Settings > Webhooks
2. 点击 "Add webhook"
3. 配置参数：
   - **Payload URL**: `https://your-domain.com/api/webhook/github`
   - **Content type**: `application/json`
   - **Secret**: 设置一个安全的密钥
   - **Events**: 选择 "Just the push event"
4. 保存webhook

## 8. 发布新文章

1. 在GitHub仓库的 `content/posts/` 目录下创建新的 `.md` 文件
2. 编写文章内容，包含必要的Front Matter
3. 提交并推送到GitHub
4. 如果配置了Webhook，会自动触发重新部署
5. 如果没有Webhook，需要手动重新部署

## 故障排除

### 常见问题

1. **GitHub API 404错误**
   - 检查 `GITHUB_REPO` 是否正确
   - 确认仓库是公开的
   - 验证GitHub Token权限

2. **文章不显示**
   - 检查文章Front Matter格式
   - 确认 `published: true`
   - 验证文件路径正确

3. **Webhook不工作**
   - 检查Payload URL是否正确
   - 确认Secret配置
   - 查看GitHub Webhook日志
