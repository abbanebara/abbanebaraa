"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { EyeOff, Eye, User, Users } from "lucide-react"

export default function LoginPage() {
  const [accountType, setAccountType] = useState<"buyer" | "seller">("buyer")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setErrors({})

    // Validate email
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }))
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }))
      return
    }

    // Validate password
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }))
      return
    }

    setIsSubmitting(true)

    // In a real app, this would send a login request to your API
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirect to dashboard or home page
    }, 1000)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium text-center text-gray-800 mb-8">login to your account</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <p className="text-gray-600 mb-2">Account type</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className={`flex items-center gap-2 py-3 px-4 rounded-md border transition-colors ${
                accountType === "buyer"
                  ? "bg-[#e3f7e6] border-[#6FCF7B] text-[#6FCF7B]"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
              onClick={() => setAccountType("buyer")}
            >
              <User className="h-5 w-5" />
              <span>Buyer</span>
            </button>
            <button
              type="button"
              className={`flex items-center gap-2 py-3 px-4 rounded-md border transition-colors ${
                accountType === "seller"
                  ? "bg-[#e3f7e6] border-[#6FCF7B] text-[#6FCF7B]"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
              onClick={() => setAccountType("seller")}
            >
              <Users className="h-5 w-5" />
              <span>Seller</span>
            </button>
          </div>
        </div>

        <div>
          <p className="text-gray-600 mb-2">Email</p>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 rounded-md border ${
              errors.email ? "border-red-500" : "border-gray-200"
            } focus:outline-none focus:ring-2 focus:ring-[#6FCF7B] focus:border-transparent`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <p className="text-gray-600">Password</p>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-600 flex items-center gap-1"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showPassword ? "Hide" : "Show"}</span>
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-3 rounded-md border ${
              errors.password ? "border-red-500" : "border-gray-200"
            } focus:outline-none focus:ring-2 focus:ring-[#6FCF7B] focus:border-transparent`}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember-me"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="h-4 w-4 text-[#6FCF7B] focus:ring-[#6FCF7B] border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 text-gray-700">
            Remember me
          </label>
        </div>

        <div className="text-sm text-gray-600">
          By continuing, you agree to the{" "}
          <Link href="/terms" className="text-gray-800 underline">
            Terms of use
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-gray-800 underline">
            Privacy Policy.
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-[#6FCF7B] hover:bg-[#5dbd69] text-white font-medium rounded-full transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>

        <div className="text-center">
          <Link href="/forgot-password" className="text-gray-800 text-sm">
            Forget your password
          </Link>
        </div>

        <div className="text-center text-gray-600">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-gray-800 font-medium">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  )
}
