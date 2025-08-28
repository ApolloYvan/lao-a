// import AuthorCard from '@/components/widgets/AuthorCard'
import QrCodeWidget from '@/components/widgets/QrCodeWidget'
import PopularPosts from '@/components/widgets/PopularPosts'
import TagCloud from '@/components/widgets/TagCloud'
import ArchiveWidget from '@/components/widgets/ArchiveWidget'

export default function Sidebar() {
  return (
    <aside className="space-y-6" style={{ marginTop: '116px' }}>
      {/* 博主简介 */}
      {/* <AuthorCard /> */}
      
      {/* 引流模块 */}
      <QrCodeWidget />
      
      {/* 热门文章 */}
      <PopularPosts />
      
      {/* 标签云 */}
      <TagCloud />
      
      {/* 文章归档 */}
      <ArchiveWidget />
    </aside>
  )
}
