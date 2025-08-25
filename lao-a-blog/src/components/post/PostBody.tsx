interface PostBodyProps {
  children: React.ReactNode
}

export default function PostBody({ children }: PostBodyProps) {
  return (
    <div className="prose prose-lg prose-blue max-w-none 
      prose-headings:font-bold prose-headings:text-gray-900 prose-headings:scroll-mt-24
      prose-p:text-gray-700 prose-p:leading-relaxed 
      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
      prose-strong:text-gray-900 prose-strong:font-semibold
      prose-em:text-gray-700
      prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:border prose-pre:border-gray-700 prose-pre:overflow-x-auto
      prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-gray-700 prose-blockquote:rounded-r-lg
      prose-img:rounded-lg prose-img:shadow-lg prose-img:border prose-img:border-gray-200
      prose-hr:border-gray-300 prose-hr:my-8
      prose-ul:my-6 prose-ol:my-6
      prose-li:my-2 prose-li:text-gray-700
      prose-table:border-collapse prose-table:border prose-table:border-gray-300
      prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:px-4 prose-th:py-2 prose-th:font-semibold
      prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2">
      {children}
    </div>
  )
}
