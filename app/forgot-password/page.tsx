"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Key } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate email
    if (!email) {
      setError("Email is required")
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    // In a real app, this would send a request to your API
    setTimeout(() => {
      setIsSubmitting(false)
      window.location.href = "/forgot-password/verify"
    }, 1000)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-full bg-[#f3fbf4] flex items-center justify-center mb-4">
          <Key className="h-6 w-6 text-[#6FCF7B]" />
        </div>
        <h1 className="text-2xl font-medium text-center text-gray-800">Forgot password?</h1>
        <p className="text-gray-600 text-center mt-2">No worries, we'll send you reset instructions.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <p className="text-gray-600 mb-2">Email</p>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 rounded-md border ${
              error ? "border-red-500" : "border-gray-200"
            } focus:outline-none focus:ring-2 focus:ring-[#6FCF7B] focus:border-transparent`}
            required
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-[#6FCF7B] hover:bg-[#5dbd69] text-white font-medium rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Reset password"}
        </button>

        <div className="flex items-center justify-center">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to log in
          </Link>
        </div>
      </form>
    </div>
  )
}

