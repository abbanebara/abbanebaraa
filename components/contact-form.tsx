"use client"

import type React from "react"
import { cn } from "@/lib/utils"

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Type of field to render (input or textarea) */
  type: "input" | "textarea"
  /** Props for input element */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  /** Props for textarea element */
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
}

/**
 * FormField component that renders either an input or textarea with consistent styling
 */
export function FormField({ type, className, inputProps, textareaProps, ...props }: FormFieldProps) {
  const baseStyles =
    "w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md text-white placeholder:text-white/60 focus:outline-none focus:border-white/30 transition-all"

  return (
    <div className={cn("w-full", className)} {...props}>
      {type === "input" ? (
        <input className={baseStyles} {...inputProps} />
      ) : (
        <textarea className={cn(baseStyles, "min-h-[120px] resize-none")} {...textareaProps} />
      )}
    </div>
  )
}

/**
 * ContactForm component that renders a complete contact form
 */
export function ContactForm({
  onSubmit,
}: {
  onSubmit?: (data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    message: string
  }) => void
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    if (onSubmit) {
      onSubmit({
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        message: formData.get("message") as string,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          type="input"
          inputProps={{
            placeholder: "Last Name",
            name: "lastName",
          }}
        />
        <FormField
          type="input"
          inputProps={{
            placeholder: "First Name",
            name: "firstName",
          }}
        />
      </div>

      <FormField
        type="input"
        inputProps={{
          placeholder: "Email",
          type: "email",
          name: "email",
        }}
      />

      <FormField
        type="input"
        inputProps={{
          placeholder: "Phone Number",
          type: "tel",
          name: "phone",
        }}
      />

      <FormField
        type="textarea"
        textareaProps={{
          placeholder: "Message",
          name: "message",
        }}
      />

      <button
        type="submit"
        className="w-full py-3 px-4 bg-[#4CAF50] hover:bg-[#45a049] text-white font-medium rounded-md transition-colors"
      >
        Send the message
      </button>
    </form>
  )
}