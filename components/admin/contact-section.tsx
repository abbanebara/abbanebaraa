"use client"

import type React from "react"

import Image from "next/image"
import { Phone, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "input" | "textarea"
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
}

function FormField({ type, className, inputProps, textareaProps, ...props }: FormFieldProps) {
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

interface ContactSectionProps {
  onSubmit?: (data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    message: string
  }) => void
  className?: string
}

export function ContactSection({ onSubmit, className }: ContactSectionProps) {
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
    <section
      className={cn("bg-gradient-to-b from-[#1d4e4e] to-[#0f2a3d] text-white py-16 px-6 rounded-3xl", className)}
    >
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold mb-3">Contact us</h2>
          <p className="text-xl text-white/80">Reach out, and let's create a universe of possibilities together!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold">Let's connect constellations</h3>
              <p className="text-white/80">Let's align our constellations! Reach out.</p>
            </div>

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
          </div>

          <div className="flex justify-center items-center">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg overflow-hidden w-full max-w-md">
              <div className="w-full">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image-ejbmXDR61gP3RVNxnf6mlUJh7hKSnt.png"
                  alt="Contact person"
                  width={500}
                  height={500}
                  className="w-full h-auto"
                />

                <div className="text-center py-2">
                  <span className="text-[#7CFC00] font-bold tracking-[0.2em] text-base uppercase">BILGREEN</span>
                </div>

                <div className="flex justify-center items-center gap-4 py-2 px-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-[#7CFC00]" />
                    <span>+213 540545772</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-[#7CFC00]" />
                    <span>+213 540545772</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-[#7CFC00]" />
                    <span>bilgreen2025@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}