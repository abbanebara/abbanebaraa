import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  return (
    <div className="flex items-center justify-center mt-12 mb-12">
      <div className="flex items-center bg-gray-100 rounded-full shadow-md">
        <Link
          href={currentPage > 1 ? `${basePath}?page=${currentPage - 1}` : `${basePath}`}
          className={`p-4 ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:text-gray-900"}`}
          aria-disabled={currentPage === 1}
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Link
            key={page}
            href={`${basePath}?page=${page}`}
            className={`flex items-center justify-center h-10 w-10 rounded-full mx-1 ${
              currentPage === page ? "bg-green-500 text-white" : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {page}
          </Link>
        ))}

        <Link
          href={currentPage < totalPages ? `${basePath}?page=${currentPage + 1}` : `${basePath}`}
          className={`p-4 ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:text-gray-900"}`}
          aria-disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  )
}