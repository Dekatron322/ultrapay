// FormInputModule.tsx
"use client"
import React, { useState } from "react"

interface FormInputProps {
  label: string
  type: string
  name?: string
  placeholder: string
  value: string | number | any
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  error?: string | boolean
  required?: boolean
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  maxLength?: number
  readOnly?: boolean
}

export const FormInputModule: React.FC<FormInputProps> = ({
  label,
  type,
  placeholder,
  value,
  name,
  onChange,
  className = "",
  error,
  required = false,
  disabled = false,
  size = "md",
  maxLength,
  readOnly,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const sizeClasses = size === "sm" ? "h-[38px] text-sm" : size === "lg" ? "h-[52px] text-base" : "h-[46px] text-base"

  return (
    <div className={className}>
      <label className="mb-1 block text-sm text-[#101836]">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div
        className={`
          flex items-center rounded-md border px-3 py-2
          ${sizeClasses}
          ${error ? "border-[#D14343]" : "border-[#E5E7EB]"}
          ${
            isFocused
              ? "bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#1447E6] focus-within:ring-offset-2 hover:border-[#1447E6]"
              : "bg-[#F9FAFB]"
          }
          ${disabled ? "bg-[#F9FAFB]" : ""}
          transition-all duration-200
        `}
      >
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none disabled:cursor-not-allowed disabled:text-gray-500"
          value={value}
          name={name}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          readOnly={readOnly}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      </div>
      {typeof error === "string" && error.length > 0 && (
        <p id={`${name}-error`} className="mt-1 text-xs text-[#D14343]">
          {error}
        </p>
      )}
    </div>
  )
}

interface FormTextAreaProps {
  label: string
  name?: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  className?: string
  error?: string | boolean
  required?: boolean
  disabled?: boolean
  rows?: number
}

export const FormTextAreaModule: React.FC<FormTextAreaProps> = ({
  label,
  placeholder,
  value,
  name,
  onChange,
  className = "",
  error,
  required = false,
  disabled = false,
  rows = 4,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={className}>
      <label className="mb-1 block text-sm text-[#101836]">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div
        className={`
          rounded-md border px-3 py-2
          ${error ? "border-[#D14343]" : "border-[#E5E7EB]"}
          ${
            isFocused
              ? "bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#1447E6] focus-within:ring-offset-2 hover:border-[#1447E6]"
              : "bg-[#F9FAFB]"
          }
          ${disabled ? "bg-[#F9FAFB]" : ""}
          transition-all duration-200
        `}
      >
        <textarea
          placeholder={placeholder}
          className="w-full resize-none bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:text-gray-500"
          value={value}
          name={name}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          disabled={disabled}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      </div>
      {typeof error === "string" && error.length > 0 && (
        <p id={`${name}-error`} className="mt-1 text-xs text-[#D14343]">
          {error}
        </p>
      )}
    </div>
  )
}
