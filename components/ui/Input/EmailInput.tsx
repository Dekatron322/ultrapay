"use client"
import { EmailIcon } from "components/Icons/LogoIcons"
import React, { useState } from "react"

interface FormInputProps {
  label: string
  type: string
  name?: string
  placeholder: string
  value: string | number | any
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  error?: boolean
  required?: boolean
  disabled?: boolean
  IconComponent?: React.ComponentType<any>
}

export const FormInputModule: React.FC<FormInputProps> = ({
  label,
  type,
  placeholder,
  value,
  name,
  onChange,
  className = "",
  error = false,
  required = false,
  disabled = false,
  IconComponent = EmailIcon,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={`${className}`}>
      <label className="mb-1 block text-sm text-[#101836]">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div
        className={`
        flex h-[46px] items-center rounded-md border px-3
        py-2 ${error ? "border-[#D14343]" : "border-[#E5E7EB]"}
        ${
          isFocused
            ? "bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#1447E6] focus-within:ring-offset-2 hover:border-[#1447E6]"
            : "bg-[#F9FAFB]"
        }
        ${disabled ? "bg-gray-100" : ""}
        transition-all duration-200
      `}
      >
        {/* Email Icon on the left side */}
        <div className="mr-2">
          <IconComponent color="#100A55" />
        </div>

        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent text-base text-[#101836] outline-none disabled:cursor-not-allowed disabled:text-gray-500"
          value={value}
          name={name}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
