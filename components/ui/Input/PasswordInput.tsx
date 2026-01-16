"use client"
import React, { useState } from "react"
import { HidePasswordIcon, PasswordIcon, ShowPasswordIcon } from "components/Icons/LogoIcons"
import { VscEye, VscEyeClosed } from "react-icons/vsc"

interface PasswordInputProps {
  label: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  error?: boolean
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  disabled?: boolean
}

export const PasswordInputModule: React.FC<PasswordInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  className = "",
  error = false,
  onKeyPress,
  onKeyDown,
  disabled = false,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <div className={`mb-3 ${className}`}>
      <label className="mb-1 block text-sm text-[#101836]">{label}</label>
      <div
        className={`
        flex h-[46px] items-center rounded-md border px-3
        py-2 ${error ? "border-[#D14343]" : "border-[#E5E7EB]"}
        ${
          isFocused
            ? "bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#1447E6] focus-within:ring-offset-2 hover:border-[#1447E6]"
            : "bg-[#F9FAFB]"
        }
        transition-all duration-200
      `}
      >
        {/* Key Icon on the left side */}
        <div className="mr-2">
          <PasswordIcon />
        </div>

        <input
          type={isPasswordVisible ? "text" : "password"}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-base text-[#101836] outline-none"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyPress={onKeyPress}
          onKeyDown={onKeyDown}
          disabled={disabled}
        />
        <button type="button" className="ml-2 rounded-full p-1 focus:outline-none" onClick={togglePasswordVisibility}>
          {isPasswordVisible ? <VscEye size={24} /> : <VscEyeClosed size={24} />}
        </button>
      </div>
    </div>
  )
}
