import Link from 'next/link'
import { SITE_CONFIG, FOOTER_LINKS } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Site Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">{SITE_CONFIG.name}</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              {SITE_CONFIG.description}
            </p>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} {SITE_CONFIG.author}. All rights reserved.
            </p>
          </div>

          {/* Footer Links */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>
            Powered by{' '}
            <Link
              href="https://nextjs.org"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Next.js
            </Link>
            {' '}and{' '}
            <Link
              href="https://vercel.com"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Vercel
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
