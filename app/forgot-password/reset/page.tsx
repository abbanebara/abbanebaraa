"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Key } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validatePassword = (pass: string) => {
    if (pass.length < 8) {
      return "Password must be at least 8 characters"
    }
    return ""
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setErrors({})

    // Validate password
    const passwordError = validatePassword(password)
    if (passwordError) {
      setErrors((prev) => ({ ...prev, password: passwordError }))
      return
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirm: "Passwords do not match" }))
      return
    }

    setIsSubmitting(true)

    // In a real app, this would send the new password to your API
    setTimeout(() => {
      setIsSubmitting(false)
      window.location.href = "/forgot-password/success"
    }, 1000)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-full bg-[#f0ebff] flex items-center justify-center mb-4">
          <Key className="h-6 w-6 text-[#6FCF7B]" />
        </div>
        <h1 className="text-2xl font-medium text-center text-gray-800">Set new password</h1>
        <p className="text-gray-600 text-center mt-2">
          Your new password must be different to previously used passwords.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <p className="text-gray-600 mb-2">Password</p>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-md border ${
                errors.password ? "border-red-500" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-[#6FCF7B] focus:border-transparent`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </button>
          </div>
          {errors.password ? (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          ) : (
            <p className="text-gray-600 text-sm mt-1">Must be at least 8 characters.</p>
          )}
        </div>

        <div>
          <p className="text-gray-600 mb-2">Password</p>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-md border ${
                errors.confirm ? "border-red-500" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-[#6FCF7B] focus:border-transparent`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
            </button>
          </div>
          {errors.confirm && <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>}
        </div>

        <div className="flex justify-between">
          <Link
            href="/forgot-password/verify"
            className="py-3 px-6 border border-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Back
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-3 px-6 bg-[#6FCF7B] hover:bg-[#5dbd69] text-white font-medium rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Resetting..." : "Reset password"}
          </button>
        </div>
      </form>
    </div>
  )
}

