# 老A的B面博客 - Vercel部署指南

## 🚀 部署到Vercel

### 1. 准备工作

#### 1.1 确保GitHub仓库已配置
- 确保您的GitHub仓库包含所有必要的文件
- 确保GitHub Token有足够的权限访问仓库内容

#### 1.2 环境变量准备
在Vercel部署时需要配置以下环境变量：

```
GITHUB_REPO=your-username/your-blog-repo
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_BRANCH=main
```

### 2. Vercel部署步骤

#### 2.1 登录Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账号登录

#### 2.2 导入项目
1. 点击 "New Project"
2. 选择您的GitHub仓库
3. 选择 "lao-a-blog" 项目

#### 2.3 配置环境变量
在项目设置页面：
1. 进入 "Settings" → "Environment Variables"
2. 添加以下环境变量：
   - `GITHUB_REPO`: 您的GitHub仓库地址（如：`your-username/your-blog-repo`）
   - `GITHUB_TOKEN`: 您的GitHub Personal Access Token
   - `GITHUB_BRANCH`: 分支名称（通常是 `main`）

#### 2.4 部署配置
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### 2.5 开始部署
1. 点击 "Deploy"
2. 等待构建完成
3. 部署成功后，Vercel会提供一个域名

### 3. 自定义域名（可选）

#### 3.1 添加自定义域名
1. 在Vercel项目设置中进入 "Domains"
2. 添加您的自定义域名
3. 按照提示配置DNS记录

#### 3.2 配置SSL证书
Vercel会自动为您的域名配置SSL证书

### 4. 自动部署配置

#### 4.1 GitHub Webhook
Vercel会自动配置GitHub Webhook，当您推送代码到主分支时自动重新部署

#### 4.2 预览部署
- 每个Pull Request都会创建预览部署
- 可以在PR中查看部署预览链接

### 5. 监控和维护

#### 5.1 查看部署状态
- 在Vercel仪表板中查看部署历史
- 监控构建日志和错误信息

#### 5.2 性能监控
- 使用Vercel Analytics监控网站性能
- 查看Core Web Vitals指标

### 6. 故障排除

#### 6.1 常见问题
1. **构建失败**: 检查环境变量是否正确配置
2. **GitHub API限制**: 确保GitHub Token有足够权限
3. **图片加载失败**: 检查next.config.ts中的图片配置

#### 6.2 调试步骤
1. 查看Vercel构建日志
2. 检查环境变量配置
3. 验证GitHub仓库权限

### 7. 优化建议

#### 7.1 性能优化
- 启用Vercel的图片优化
- 配置CDN缓存策略
- 使用Vercel Edge Functions

#### 7.2 SEO优化
- 配置robots.txt
- 添加sitemap.xml
- 优化meta标签

## 🎉 部署完成

部署成功后，您的博客将在以下地址可用：
- Vercel提供的域名：`https://your-project.vercel.app`
- 自定义域名（如果配置）：`https://your-domain.com`

### 后续维护
1. 定期更新依赖包
2. 监控网站性能
3. 备份重要数据
4. 更新GitHub Token（如果需要）

---

**注意**: 请确保将敏感信息（如GitHub Token）安全存储，不要在代码中硬编码。
