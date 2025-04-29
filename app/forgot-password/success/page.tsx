import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"

export default function SuccessPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-full bg-[#e3f7e6] flex items-center justify-center mb-4">
          <CheckCircle className="h-6 w-6 text-[#6FCF7B]" />
        </div>
        <h1 className="text-2xl font-medium text-center text-gray-800">Password reset</h1>
        <p className="text-gray-600 text-center mt-2">
          Your password has been successfully reset.
          <br />
          Click below to log in magically.
        </p>
      </div>

      <div className="space-y-4">
        <Link
          href="/"
          className="block w-full py-3 px-4 bg-[#6FCF7B] hover:bg-[#5dbd69] text-white font-medium rounded-md text-center transition-colors"
        >
          Continue
        </Link>

        <div className="flex items-center justify-center">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to log in
          </Link>
        </div>
      </div>
    </div>
  )
}

