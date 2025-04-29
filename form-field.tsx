"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Label text for the form field */
  label?: string
  /** Helper text displayed below the field */
  helperText?: string
  /** Error message to display */
  error?: string
  /** Whether the field is required */
  required?: boolean
  /** Whether the field is disabled */
  disabled?: boolean
  /** Type of field to render (input or textarea) */
  type?: "input" | "textarea"
  /** Props to pass to the input element */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  /** Props to pass to the textarea element */
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
}

/**
 * FormField component that renders either an input or textarea with consistent styling
 *
 * @example
 * // Basic input field
 * <FormField label="Name" inputProps={{ placeholder: "Enter your name" }} />
 *
 * @example
 * // Textarea field
 * <FormField
 *   type="textarea"
 *   label="Description"
 *   textareaProps={{ placeholder: "Enter description", rows: 4 }}
 * />
 *
 * @example
 * // Field with error
 * <FormField
 *   label="Email"
 *   error="Please enter a valid email"
 *   inputProps={{ type: "email" }}
 * />
 */
export function FormField({
  label,
  helperText,
  error,
  required = false,
  disabled = false,
  type = "input",
  inputProps,
  textareaProps,
  className,
  ...props
}: FormFieldProps) {
  // Generate a unique ID for accessibility
  const id = React.useId()

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <Label
          htmlFor={id}
          className={cn("text-sm font-medium", error && "text-destructive", disabled && "opacity-50")}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      {type === "input" ? (
        <Input
          id={id}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-description` : undefined}
          className={cn(error && "border-destructive")}
          {...inputProps}
        />
      ) : (
        <Textarea
          id={id}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-description` : undefined}
          className={cn(error && "border-destructive")}
          {...textareaProps}
        />
      )}

      {helperText && !error && (
        <p id={`${id}-description`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

