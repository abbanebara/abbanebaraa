"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false)
    }
  }, [countdown, resendDisabled])

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return
    }

    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")

    // Check if pasted content is numeric and has the right length
    if (!/^\d+$/.test(pastedData)) {
      return
    }

    const digits = pastedData.slice(0, 6).split("")
    const newOtp = [...otp]

    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit
      }
    })

    setOtp(newOtp)

    // Focus the appropriate field
    if (digits.length < 6) {
      inputRefs[digits.length].current?.focus()
    } else {
      inputRefs[5].current?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate OTP
    if (!otp.every((digit) => digit)) {
      setError("Please enter the complete 6-digit code")
      return
    }

    setIsSubmitting(true)

    // In a real app, this would verify the OTP
    setTimeout(() => {
      setIsSubmitting(false)
      window.location.href = "/forgot-password/reset"
    }, 1000)
  }

  const handleResend = () => {
    if (resendDisabled) return

    setResendDisabled(true)
    setCountdown(60)

    // In a real app, this would resend the OTP
    // For now, just show a success message
    setError("")

    // Clear the OTP fields
    setOtp(["", "", "", "", "", ""])
    inputRefs[0].current?.focus()
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-full bg-[#f0ebff] flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-[#6FCF7B]" />
        </div>
        <h1 className="text-2xl font-medium text-center text-gray-800">Check your email</h1>
        <p className="text-gray-600 text-center mt-2">open mail app to verify</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`w-12 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 ${
                digit ? "border-[#6FCF7B] bg-[#f3fbf4]" : "border-gray-200"
              } focus:ring-[#6FCF7B] focus:border-transparent`}
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="text-center">
          <p className="text-gray-600">
            Didn't receive the email?
            <button
              type="button"
              onClick={handleResend}
              disabled={resendDisabled}
              className={`ml-1 ${resendDisabled ? "text-gray-400" : "text-[#6FCF7B] hover:underline"}`}
            >
              {resendDisabled ? `Resend in ${countdown}s` : "Click to resend"}
            </button>
          </p>
        </div>

        <div className="flex justify-between">
          <Link
            href="/forgot-password"
            className="py-3 px-6 border border-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Back
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || !otp.every((digit) => digit)}
            className="py-3 px-6 bg-[#6FCF7B] hover:bg-[#5dbd69] text-white font-medium rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Verifying..." : "next"}
          </button>
        </div>
      </form>
    </div>
  )
}

