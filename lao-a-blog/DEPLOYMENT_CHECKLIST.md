# 🚀 部署检查清单

## 部署前检查

### ✅ 代码质量检查
- [ ] 所有TypeScript错误已修复
- [ ] ESLint检查通过
- [ ] 构建成功 (`npm run build`)
- [ ] 本地开发服务器正常运行

### ✅ 功能测试
- [ ] 首页正常显示
- [ ] 文章详情页正常显示
- [ ] 分类页面正常显示
- [ ] 标签页面正常显示
- [ ] About页面正常显示
- [ ] Contact页面正常显示
- [ ] 文章统计功能正常（阅读数、点赞数）
- [ ] 搜索功能正常（如果有）

### ✅ 内容检查
- [ ] GitHub仓库中有文章内容
- [ ] 文章格式正确（frontmatter、markdown）
- [ ] 图片资源可访问
- [ ] 作者信息正确

### ✅ 环境变量准备
- [ ] GitHub Personal Access Token已生成
- [ ] GitHub仓库地址确认
- [ ] GitHub分支名称确认

### ✅ 配置文件检查
- [ ] `vercel.json` 配置正确
- [ ] `next.config.ts` 配置正确
- [ ] `package.json` 依赖完整
- [ ] `robots.txt` 已创建
- [ ] `sitemap.ts` 已创建

## Vercel部署步骤

### 1. 登录Vercel
- [ ] 访问 [vercel.com](https://vercel.com)
- [ ] 使用GitHub账号登录

### 2. 导入项目
- [ ] 点击 "New Project"
- [ ] 选择GitHub仓库
- [ ] 选择 "lao-a-blog" 项目

### 3. 配置环境变量
- [ ] 添加 `GITHUB_REPO`
- [ ] 添加 `GITHUB_TOKEN`
- [ ] 添加 `GITHUB_BRANCH`

### 4. 部署配置
- [ ] Framework Preset: Next.js
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `npm install`

### 5. 开始部署
- [ ] 点击 "Deploy"
- [ ] 等待构建完成
- [ ] 检查部署日志

## 部署后验证

### ✅ 功能验证
- [ ] 网站可以正常访问
- [ ] 所有页面正常显示
- [ ] 文章内容正确加载
- [ ] 图片正常显示
- [ ] 响应式设计正常

### ✅ 性能检查
- [ ] 页面加载速度正常
- [ ] 图片优化正常
- [ ] SEO元标签正确
- [ ] sitemap.xml可访问
- [ ] robots.txt可访问

### ✅ 监控设置
- [ ] 设置Vercel Analytics（可选）
- [ ] 配置错误监控（可选）
- [ ] 设置性能监控（可选）

## 故障排除

### 常见问题
1. **构建失败**
   - 检查环境变量配置
   - 查看构建日志
   - 验证GitHub Token权限

2. **文章不显示**
   - 检查GitHub仓库配置
   - 验证文章格式
   - 检查API路由

3. **图片加载失败**
   - 检查next.config.ts配置
   - 验证图片URL
   - 检查CDN设置

## 后续维护

### 定期检查
- [ ] 监控网站性能
- [ ] 更新依赖包
- [ ] 检查安全更新
- [ ] 备份重要数据

### 内容更新
- [ ] 添加新文章
- [ ] 更新About页面
- [ ] 维护标签和分类
- [ ] 更新联系信息

---

**部署完成后，您的博客将在Vercel上正常运行！** 🎉
