import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Sidebar from '@/components/ui/Sidebar'

interface MainLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
}

export default function MainLayout({ children, showSidebar = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Main Content */}
            <div className={showSidebar ? "flex-1 lg:w-2/3" : "w-full"}>
              {children}
            </div>
            
            {/* Sidebar */}
            {showSidebar && (
              <aside className="hidden lg:block w-80 flex-shrink-0">
                <div className="sticky top-24">
                  <Sidebar />
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
