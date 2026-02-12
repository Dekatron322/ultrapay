"use client"
import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { Check, ChevronDown, Search, X } from "lucide-react"

interface FormSelectModuleProps {
  label: string
  name: string
  value: string | number
  onChange: (e: ChangeEvent<HTMLSelectElement> | { target: { name: string; value: string | number } }) => void
  options: Array<{ value: string | number; label: string; icon?: string; iconType?: "emoji" | "svg" }>
  required?: boolean
  disabled?: boolean
  className?: string
  error?: string | boolean
  placeholder?: string
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

export const FormSelectModule: React.FC<FormSelectModuleProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  className = "",
  error,
  placeholder = "Select an option",
  size = "md",
  loading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const selectedOption = options.find((option) => option.value === value)

  // Filter options based on search term
  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))

  const sizeClasses = size === "sm" ? "h-[38px] text-sm" : size === "lg" ? "h-[52px] text-base" : "h-[46px] text-base"

  const handleSelect = (value: string | number) => {
    // Create a synthetic event that matches both possible types
    const syntheticEvent = {
      target: {
        name,
        value,
        // Include type to help TypeScript narrow the type
        type: "select-one",
      },
    }

    // Cast to the expected type
    onChange(syntheticEvent as ChangeEvent<HTMLSelectElement>)
    setIsOpen(false)
    setSearchTerm("") // Clear search when selection is made
  }

  const handleDropdownClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      if (!isOpen) {
        // Focus search input when dropdown opens
        setTimeout(() => searchInputRef.current?.focus(), 0)
      }
    }
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setSearchTerm("")
    searchInputRef.current?.focus()
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Reset search when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("")
    }
  }, [isOpen])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="mb-1 block text-sm text-[#101836]">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={`
          flex cursor-pointer items-center justify-between rounded-md border px-3 py-2
          ${sizeClasses}
          ${error ? "border-[#D14343]" : "border-[#E5E7EB]"}
          ${
            isFocused
              ? "bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#1447E6] focus-within:ring-offset-2 hover:border-[#1447E6]"
              : "bg-[#F9FAFB]"
          }
          ${disabled || loading ? "bg-[#F9FAFB]" : ""}
          transition-all duration-200
        `}
        onClick={!loading ? handleDropdownClick : undefined}
        onFocus={() => !disabled && !loading && setIsFocused(true)}
        onBlur={() => !disabled && !loading && setIsFocused(false)}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={`${name}-options`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      >
        <span className="flex items-center gap-2 text-base">
          {loading ? (
            <svg
              className="size-5 animate-spin text-gray-400"
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
          ) : selectedOption?.icon ? (
            <>
              {selectedOption.iconType === "svg" ? (
                <img src={selectedOption.icon} alt={selectedOption.label} className="size-5  object-contain" />
              ) : (
                <span className="text-lg">{selectedOption.icon}</span>
              )}
            </>
          ) : null}
          {loading ? "Loading..." : selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={`size-5 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && !loading && (
        <div
          id={`${name}-options`}
          className="absolute z-10 mt-1 w-full rounded-md border border-[#E5E7EB] bg-[#FFFFFF] shadow-lg"
        >
          {/* Search Input */}
          <div className="border-b border-[#E5E7EB] p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className={`w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] py-2 pl-10 pr-10 text-sm focus:border-[#1447E6] focus:outline-none focus:ring-1 focus:ring-[#1447E6] ${sizeClasses}`}
                onClick={(e) => e.stopPropagation()}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center justify-between gap-2 px-3 py-2 text-base hover:bg-[#F3F4F6] ${
                    value === option.value ? "bg-[#F3F4F6] text-[#1447E6]" : ""
                  }`}
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={value === option.value}
                >
                  <div className="flex items-center gap-2">
                    {option.icon && (
                      <>
                        {option.iconType === "svg" ? (
                          <img src={option.icon} alt={option.label} className="size-5  object-contain" />
                        ) : (
                          <span className="text-lg">{option.icon}</span>
                        )}
                      </>
                    )}
                    {option.label}
                  </div>
                  {value === option.value && <Check className="size-4 text-[#1447E6]" />}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">No options found</div>
            )}
          </div>
        </div>
      )}

      {typeof error === "string" && error.length > 0 && (
        <p id={`${name}-error`} className="mt-1 text-xs text-[#D14343]">
          {error}
        </p>
      )}
    </div>
  )
}
