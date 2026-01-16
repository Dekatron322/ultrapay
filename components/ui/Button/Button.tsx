"use client"
import { MotionProps } from "framer-motion"

import React from "react"

type ButtonVariant =
  | "primary"
  | "black"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "outlineDanger"
  | "dangerSecondary"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends MotionProps {
  type?: "button" | "submit" | "reset"
  onClick?: () => void
  disabled?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: React.ReactNode
  /** Optional icon element to render */
  icon?: React.ReactNode
  /** Position of the icon relative to the button text */
  iconPosition?: "start" | "end"
  loading?: boolean
}

export const ButtonModule: React.FC<ButtonProps> = ({
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
  children,
  icon,
  iconPosition = "start",
  loading = false,
}) => {
  const baseClasses =
    "flex z-0 items-center justify-center overflow-hidden rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variantClasses = {
    primary:
      "bg-[#1447E6] text-[#ffffff] hover:bg-[#100A55] focus-within:ring-2 focus-within:ring-[#1447E6] focus-within:ring-offset-2 hover:border-[#1447E6]",
    black: "bg-[#131319] text-[#ffffff] hover:bg-[#000000] focus:ring-[#131319]",
    secondary:
      "bg-[#E5E7EB] text-[#1447E6] hover:bg-[#D8D6F5] focus:ring-[#1447E6] border-[#1447E6] border focus-within:ring-2 focus-within:ring-[#1447E6] focus-within:ring-offset-2",
    outline: "border border-[#1447E6] text-[#1447E6] hover:bg-[#E5E7EB] focus:ring-[#1447E6]",
    outlineDanger: "border border-[#D82E2E] text-[#D82E2E] hover:bg-[#FDF3F3] focus:ring-[#D82E2E]",
    ghost: "text-[#003F9F] hover:bg-[#E6F0FF] focus:ring-[#003F9F]",
    danger: "bg-[#D82E2E] text-white hover:bg-[#F14848] focus:ring-[#F14848]",
    dangerSecondary: "bg-[#FDF3F3] text-[#D82E2E] hover:bg-[#F14848] focus:ring-[#F14848] hover:text-[#FFFFFF]",
  }

  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-6 text-lg",
  }

  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      aria-busy={loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        isDisabled ? "z-0 cursor-not-allowed opacity-50" : ""
      } ${className}`}
    >
      {iconPosition === "start" && (
        <span className="inline-flex items-center">
          {loading ? (
            <svg
              className="mr-2 size-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
              <path
                className="opacity-75"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                d="M12 2a10 10 0 0 1 10 10"
              ></path>
            </svg>
          ) : (
            icon
          )}
        </span>
      )}
      {children}
      {iconPosition === "end" && (
        <span className="inline-flex items-center">
          {loading ? (
            <svg
              className="ml-2 size-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
              <path
                className="opacity-75"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                d="M12 2a10 10 0 0 1 10 10"
              ></path>
            </svg>
          ) : (
            icon
          )}
        </span>
      )}
    </button>
  )
}
