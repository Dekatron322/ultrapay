// DatePicker.tsx
"use client"
import React, { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "./DatePicker.css"

interface DatePickerProps {
  label: string
  name?: string
  value: string | Date
  onChange: (date: Date | null, e?: React.SyntheticEvent<any> | undefined) => void
  className?: string
  error?: string | boolean
  required?: boolean
  disabled?: boolean
  placeholder?: string
  maxDate?: Date
  minDate?: Date
  showYearDropdown?: boolean
  yearDropdownItemNumber?: number
  scrollableYearDropdown?: boolean
}

export const DatePickerModule: React.FC<DatePickerProps> = ({
  label,
  name,
  value,
  onChange,
  className = "",
  error,
  required = false,
  disabled = false,
  placeholder = "Select date",
  maxDate,
  minDate,
  showYearDropdown = true,
  yearDropdownItemNumber = 100,
  scrollableYearDropdown = true,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  // Convert string value to Date if needed
  const dateValue = value instanceof Date ? value : value ? new Date(value) : null

  const handleChange = (date: Date | null, e?: React.SyntheticEvent<any> | undefined) => {
    onChange(date, e)
  }

  return (
    <div className={className}>
      <label className="mb-1 block text-sm text-[#101836]">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div
        className={`
          relative flex h-[46px] items-center rounded-md border px-3 py-2 text-base
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
        <DatePicker
          selected={dateValue}
          onChange={handleChange}
          placeholderText={placeholder}
          className="w-full bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:text-gray-500"
          disabled={disabled}
          maxDate={maxDate}
          minDate={minDate}
          showYearDropdown={showYearDropdown}
          yearDropdownItemNumber={yearDropdownItemNumber}
          scrollableYearDropdown={scrollableYearDropdown}
          dateFormat="MM/dd/yyyy"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          wrapperClassName="w-full"
          calendarClassName="shadow-lg border border-gray-200 rounded-lg"
          dayClassName={() => "text-sm hover:bg-blue-50 rounded"}
          todayButton="Today"
          popperPlacement="bottom-start"
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
