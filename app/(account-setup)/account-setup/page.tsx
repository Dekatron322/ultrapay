"use client"
import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ButtonModule } from "components/ui/Button/Button"
import { FormInputModule as BasicFormInput } from "components/ui/Input/Input"
import { FormInputModule } from "components/ui/Input/EmailInput"
import { motion } from "framer-motion"
import { FormSelectModule } from "components/ui/Input/FormSelectModule"
import { ContactIconOutline, SecurityIconOutline, UserOutlineIcon } from "components/Icons/LogoIcons"
import { VscArrowLeft, VscArrowRight } from "react-icons/vsc"

interface Testimonial {
  id: number
  image: string
  quote: string
  name: string
  title: string
  company: string
}

const AccountSetup: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [suggestedPassword, setSuggestedPassword] = useState("")
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)
  const [counter, setCounter] = useState<number>(60)
  const [canResend, setCanResend] = useState<boolean>(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const router = useRouter()

  // Upload progress states
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({})

  const countries = [
    { value: "NG", label: "Nigeria +234", icon: "/ultra-pay/NG.svg", iconType: "svg" },
    // { value: "US", label: "United States +1", icon: "/ultra-pay/US.svg", iconType: "svg" },
    // { value: "UK", label: "United Kingdom +44", icon: "/ultra-pay/UK.svg", iconType: "svg" },
    // { value: "CA", label: "Canada +1", icon: "/ultra-pay/CA.svg", iconType: "svg" },
    { value: "GH", label: "Ghana +233", icon: "/ultra-pay/GH.svg", iconType: "svg" },
    { value: "KE", label: "Kenya +254", icon: "/ultra-pay/KE.svg", iconType: "svg" },
    // { value: "ZA", label: "South Africa +27", icon: "/ultra-pay/ZA.svg", iconType: "svg" },
  ]

  const testimonials: Testimonial[] = [
    {
      id: 1,
      image: "/real-estate/aivatar_rec_04.svg",
      quote:
        "This platform revolutionized how we manage our 50+ properties in Lagos. The tenant management features alone saved us 20 hours per week.",
      name: "Adebayo Johnson",
      title: "Property Manager, Lagos",
      company: "Prime Properties NG",
    },
    {
      image: "/real-estate/aivatar_rec_28.svg",
      id: 2,
      quote:
        "As a real estate professional in Abuja, I've tried many solutions. This is the first one that truly understands the Nigerian market challenges.",
      name: "Chiamaka Okoro",
      title: "Real Estate Broker",
      company: "Capital City Realtors",
    },
    {
      image: "/real-estate/aivatar_rec_29.svg",
      id: 3,
      quote:
        "The financial tracking and reporting features have made accounting for multiple properties so much simpler. Highly recommended for Nigerian landlords!",
      name: "Emeka Nwosu",
      title: "Property Investor",
      company: "Nwosu Holdings",
    },
  ]

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    firstName: "",
    lastName: "",
    // email: "",
    phone: "",
    country: "",
    dateOfBirth: "",
    gender: "",

    // Step 2: Phone Verification
    verificationCode: "",
    otp: Array(6).fill(""),

    // Step 3: Identity Verification (KYC)
    idType: "",
    idNumber: "",
    idFrontImage: "",
    idFrontImagePreview: "",
    acceptTerms: false,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000) // Change testimonial every 5 seconds

    return () => clearInterval(interval)
  }, [testimonials.length])

  useEffect(() => {
    if (counter <= 0) {
      setCanResend(true)
      return
    }
    setCanResend(false)
    const id = setInterval(() => {
      setCounter((c) => c - 1)
    }, 1000)
    return () => clearInterval(id)
  }, [counter])

  useEffect(() => {
    // Focus on the first input box when step 2 starts
    if (currentStep === 2 && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [currentStep])

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    // { value: "other", label: "Other" },
    // { value: "prefer-not-to-say", label: "Prefer not to say" },
  ]

  const idTypeOptions = [
    { value: "nin", label: "National Identification Number (NIN)" },
    { value: "passport", label: "International Passport" },
    { value: "driverLicense", label: "Driver's License" },
  ]

  // Handle input changes
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: string | number; type?: string; checked?: boolean } }
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))

    // Clear errors when user starts typing
    if (formError) setFormError(null)
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: false }))
    }

    // Auto-verify ID number when user types
    if (name === "idNumber" && value.toString().trim().length >= 6 && formData.idType) {
      verifyIdNumber()
    }
  }

  // OTP handling functions
  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus()
    inputRefs.current[index]?.select?.()
  }

  const handleOtpChange = (index: number, value: string) => {
    if (formError) setFormError(null)
    // Allow only digits
    const v = value.replace(/\D/g, "")
    if (v.length === 0) {
      const next = [...formData.otp]
      next[index] = ""
      setFormData((prev) => ({ ...prev, otp: next }))
      return
    }
    const digit = v.charAt(0)
    const next = [...formData.otp]
    next[index] = digit
    setFormData((prev) => ({ ...prev, otp: next }))
    if (index < 5) {
      focusInput(index + 1)
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault()
      const next = [...formData.otp]
      if (next[index]) {
        next[index] = ""
        setFormData((prev) => ({ ...prev, otp: next }))
        return
      }
      if (index > 0) {
        focusInput(index - 1)
        const prevOtp = [...formData.otp]
        prevOtp[index - 1] = ""
        setFormData((prev) => ({ ...prev, otp: prevOtp }))
      }
    }
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault()
      focusInput(index - 1)
    }
    if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault()
      focusInput(index + 1)
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text").replace(/\D/g, "")
    if (!text) return
    const next = [...formData.otp]
    for (let i = 0; i < 6; i++) {
      const ch = text.charAt(i)
      next[i] = ch ? ch : next[i] ?? ""
    }
    setFormData((prev) => ({ ...prev, otp: next.slice(0, 6) }))
    // focus last filled or last box
    const lastIndex = Math.min(text.length, 6) - 1
    if (lastIndex >= 0) focusInput(lastIndex)
  }

  const handleResendOtp = () => {
    if (!canResend) return
    setFormData((prev) => ({ ...prev, otp: Array(6).fill("") }))
    setFormError(null)
    setCounter(60)
    setCanResend(false)
  }

  // File upload handling with progress simulation
  const simulateUploadProgress = (fieldName: string, onComplete: () => void) => {
    setUploadingFiles((prev) => ({ ...prev, [fieldName]: true }))
    setUploadProgress((prev) => ({ ...prev, [fieldName]: 0 }))

    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5 // Random increment between 5-20%
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setUploadProgress((prev) => ({ ...prev, [fieldName]: 100 }))
        setTimeout(() => {
          setUploadingFiles((prev) => ({ ...prev, [fieldName]: false }))
          onComplete()
        }, 300)
      } else {
        setUploadProgress((prev) => ({ ...prev, [fieldName]: Math.round(progress) }))
      }
    }, 200)
  }

  const handleFileUpload = (fieldName: string, file: File) => {
    if (formError) setFormError(null)
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: false }))
    }

    // Create a preview URL for the uploaded image
    const imageUrl = URL.createObjectURL(file)

    // Simulate upload progress
    simulateUploadProgress(fieldName, () => {
      // Store both the file name and the preview URL
      setFormData((prev) => ({
        ...prev,
        [fieldName]: file.name,
        [`${fieldName}Preview`]: imageUrl,
      }))
      setUploadProgress((prev) => ({ ...prev, [fieldName]: 0 }))
    })
  }

  const handleFileDelete = (fieldName: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: "",
      [`${fieldName}Preview`]: "",
    }))
    setFieldErrors((prev) => ({ ...prev, [fieldName]: false }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(fieldName, file)
    }
  }

  // ID number verification
  const verifyIdNumber = async () => {
    if (!formData.idNumber.trim() || !formData.idType) {
      setFormError("Please select ID type and enter ID number first")
      return
    }

    setLoading(true)
    setFormError(null)

    // Simulate API call for ID verification
    setTimeout(() => {
      setLoading(false)
      // For demo purposes, we'll simulate successful verification
      // In a real app, this would call an actual verification API
      if (formData.idNumber.length >= 6) {
        setFormError("ID number verified successfully ✓")
        setTimeout(() => setFormError(null), 3000)
      } else {
        setFormError("Invalid ID number format")
      }
    }, 2000)
  }

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    return strength
  }

  // Generate strong password
  const generatePassword = () => {
    const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ"
    const lower = "abcdefghijkmnopqrstuvwxyz"
    const nums = "23456789"
    const symbols = "!@#$%^&*()_+[]{}|:,.?"
    const all = upper + lower + nums + symbols
    const pick = (chars: string, n: number) =>
      Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    const base = [pick(upper, 2), pick(lower, 4), pick(nums, 2), pick(symbols, 2)].join("")
    const rest = pick(all, 4)
    const raw = (base + rest).split("")
    for (let i = raw.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = raw[i]!
      raw[i] = raw[j]!
      raw[j] = tmp
    }
    return raw.join("")
  }

  // Validation functions for each step
  const validateStep1 = () => {
    const { firstName, lastName, phone, country, dateOfBirth } = formData
    const errors: Record<string, boolean> = {}

    if (!firstName.trim()) errors.firstName = true
    if (!lastName.trim()) errors.lastName = true
    // if (!email.trim()) errors.email = true
    if (!phone.trim()) errors.phone = true
    if (!country.trim()) errors.country = true
    if (!dateOfBirth.trim()) errors.dateOfBirth = true

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setFormError("Please fill in all required fields")
      return false
    }

    // if (!/^\S+@\S+\.\S+$/.test(email)) {
    //   setFieldErrors({ email: true })
    //   setFormError("Please enter a valid email address")
    //   return false
    // }

    if (!/^\d{7,15}$/.test(phone.replace(/\D/g, ""))) {
      setFieldErrors({ phone: true })
      setFormError("Please enter a valid phone number")
      return false
    }

    setFieldErrors({})
    return true
  }

  const validateStep2 = () => {
    const { otp } = formData
    const errors: Record<string, boolean> = {}

    if (otp.some((digit) => digit.trim() === "")) {
      errors.verificationCode = true
      setFieldErrors(errors)
      setFormError("Please enter the 6-digit verification code")
      return false
    }

    setFieldErrors({})
    return true
  }

  const validateStep3 = () => {
    const { idType, idNumber, idFrontImage, acceptTerms } = formData
    const errors: Record<string, boolean> = {}

    if (!idType) errors.idType = true
    if (!idNumber.trim()) errors.idNumber = true
    if (!idFrontImage) errors.idFrontImage = true
    if (!acceptTerms) errors.acceptTerms = true

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setFormError("Please complete all required fields and accept terms")
      return false
    }

    // Validate ID number based on type
    if (idType === "nin" && !/^\d{11}$/.test(idNumber)) {
      setFieldErrors({ idNumber: true })
      setFormError("NIN must be 11 digits")
      return false
    }

    if (idType === "passport" && idNumber.length < 6) {
      setFieldErrors({ idNumber: true })
      setFormError("Please enter a valid passport number")
      return false
    }

    if (idType === "driverLicense" && idNumber.length < 8) {
      setFieldErrors({ idNumber: true })
      setFormError("Please enter a valid driver's license number")
      return false
    }

    setFieldErrors({})
    return true
  }

  // Navigation functions
  const nextStep = () => {
    setFormError(null)

    if (currentStep === 1 && !validateStep1()) return
    if (currentStep === 2 && !validateStep2()) return

    setCurrentStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setFormError(null)
    setFieldErrors({})
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    if (!validateStep3()) return

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to dashboard
      router.push("/business-information")
    } catch (error) {
      setFormError("An error occurred during registration. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Step progress component
  const StepProgress = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`flex size-8 items-center justify-center rounded-full border-2 ${
                  step === currentStep
                    ? "border-[#1447E6] bg-[#1447E6] text-white"
                    : step < currentStep
                    ? "border-[#1447E6] bg-[#1447E6] text-white"
                    : "border-gray-300 bg-white text-gray-500"
                }`}
              >
                {step < currentStep ? (
                  <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <>
                    {step === 1 && <UserOutlineIcon size={14} />}
                    {step === 2 && <ContactIconOutline size={14} />}
                    {step === 3 && <SecurityIconOutline size={14} />}
                  </>
                )}
              </div>
              <span className={`mt-2 text-xs font-medium ${step === currentStep ? "text-[#1447E6]" : "text-gray-500"}`}>
                {step === 1 && "Personal Info"}
                {step === 2 && "Phone Verification"}
                {step === 3 && "KYC"}
              </span>
            </div>
            {step < 3 && <div className={`mx-4 h-0.5 flex-1 ${step < currentStep ? "bg-[#1447E6]" : "bg-gray-300"}`} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  )

  // Uploaded file component with progress and delete
  const UploadedFileDisplay = ({
    fieldName,
    fileName,
    previewUrl,
    onDelete,
  }: {
    fieldName: string
    fileName: string
    previewUrl: string
    onDelete: () => void
  }) => {
    const isImage =
      previewUrl &&
      (fileName.toLowerCase().endsWith(".jpg") ||
        fileName.toLowerCase().endsWith(".jpeg") ||
        fileName.toLowerCase().endsWith(".png"))

    return (
      <div className="mt-4">
        <div className="relative rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {isImage ? (
                  <img
                    src={previewUrl}
                    alt={fileName}
                    className="size-16 rounded-lg border border-gray-300 object-cover"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-lg border border-gray-300 bg-gray-200">
                    <svg className="size-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{fileName}</p>
                <p className="mt-1 text-xs text-green-600">✓ Uploaded successfully</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onDelete}
              className="flex-shrink-0 rounded-full p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
              title="Delete file"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Upload progress component
  const UploadProgress = ({ progress }: { progress: number }) => {
    return (
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-600">Uploading...</span>
          <span className="text-sm font-medium text-blue-600">{progress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    )
  }

  // Get current testimonial safely
  const currentTestimonialData = testimonials[currentTestimonial]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#ffffff]">
      {/* Logo with full-width border */}
      <div className="fixed left-0 right-0 top-0 z-50 w-screen border-b border-gray-200 bg-white py-4">
        <div className="container w-full px-4">
          <Image src="/ultra-pay/logo.png" alt="Logo" width={155} height={100} />
        </div>
      </div>

      {/* Form Container */}
      <div className="mx-auto flex w-full flex-col px-3 pb-8 pt-20 2xl:container sm:px-4 lg:px-6">
        <motion.main
          className="flex w-full flex-1 flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto w-full max-w-2xl rounded-2xl px-4 py-6 sm:px-6 sm:py-8 md:p-8"
          >
            <div className="mb-4 border-b pb-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  <VscArrowLeft />
                  Back
                </button>
                <h1 className="text-2xl font-bold text-[#1447E6] max-sm:text-lg">Personal Profile</h1>
                <div className="w-16"></div>
              </div>
            </div>

            <StepProgress />

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormInputModule
                      label="First Name"
                      type="text"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      IconComponent={(iconProps) => <UserOutlineIcon size={18} {...iconProps} />}
                      required
                      error={fieldErrors.firstName}
                    />
                    <FormInputModule
                      label="Last Name"
                      type="text"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      IconComponent={(iconProps) => <UserOutlineIcon size={18} {...iconProps} />}
                      required
                      error={fieldErrors.lastName}
                    />
                  </div>

                  {/* <FormInputModule
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    IconComponent={(iconProps) => <EmailIconOutline size={18} {...iconProps} />}
                    required
                  /> */}

                  <div className="relative">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                          className={`flex h-11 w-32 items-center justify-between rounded-l-lg border bg-[#F9FAFB] px-3 py-3 text-sm focus:border-[#1447E6] focus:outline-none focus:ring-1 focus:ring-[#1447E6] ${
                            fieldErrors.country ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {formData.country && (
                              <Image
                                src={countries.find((c) => c.value === formData.country)?.icon || ""}
                                alt={countries.find((c) => c.value === formData.country)?.label.split(" ")[0] || ""}
                                width={20}
                                height={14}
                                className="rounded-sm"
                              />
                            )}
                            <span>
                              {formData.country
                                ? countries.find((c) => c.value === formData.country)?.label.split(" ")[1]
                                : "Country"}
                            </span>
                          </span>
                          <svg className="ml-1 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {countryDropdownOpen && (
                          <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                            <div className="max-h-60 overflow-auto">
                              {countries.map((country) => (
                                <button
                                  key={country.value}
                                  type="button"
                                  onClick={() => {
                                    setFormData((prev) => ({ ...prev, country: country.value }))
                                    setCountryDropdownOpen(false)
                                  }}
                                  className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                                >
                                  <Image
                                    src={country.icon}
                                    alt={country.label.split(" ")[0] || ""}
                                    width={20}
                                    height={14}
                                    className="rounded-sm"
                                  />
                                  <span>{country.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`h-11 flex-1 rounded-r-lg border border-l-0 bg-[#F9FAFB] px-4 py-3 text-sm focus:border-[#1447E6] focus:outline-none focus:ring-1 focus:ring-[#1447E6] ${
                          fieldErrors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <BasicFormInput
                      label="Date of Birth"
                      type="date"
                      name="dateOfBirth"
                      placeholder=""
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                      error={fieldErrors.dateOfBirth}
                    />

                    <FormSelectModule
                      label="Gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      options={genderOptions}
                      className="mb-4"
                      error={fieldErrors.gender}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Phone Verification */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100">
                      <ContactIconOutline size={32} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Verify Your Phone Number</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      We&apos;ve sent a 6-digit verification code to {formData.phone}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <label className="mb-4 block text-center text-sm font-medium text-[#101836] sm:mb-6">
                        Enter 6-digit code
                      </label>
                      <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-5">
                        {formData.otp.map((val, idx) => (
                          <input
                            key={idx}
                            ref={(el) => {
                              inputRefs.current[idx] = el
                            }}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            className={`h-12 w-12 rounded-md border bg-[#F9FAFB] text-center text-xl focus:border-[#1447E6] focus:outline-none focus:ring-2 focus:ring-[#1447E6] focus:ring-offset-2 sm:h-14 sm:w-14 md:h-14 md:w-16 ${
                              fieldErrors.verificationCode ? "border-red-500" : "border-[#E5E7EB]"
                            }`}
                            value={val}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            onPaste={idx === 0 ? handleOtpPaste : undefined}
                          />
                        ))}
                      </div>
                    </motion.div>

                    <div className="text-center">
                      <button
                        type="button"
                        className={`text-sm ${
                          canResend
                            ? "text-blue-600 hover:text-blue-500 hover:underline"
                            : "cursor-not-allowed text-gray-400"
                        }`}
                        onClick={handleResendOtp}
                        disabled={!canResend}
                      >
                        {canResend
                          ? "Didn't receive the code? Resend"
                          : `Resend code in ${Math.floor(counter / 60)}:${(counter % 60).toString().padStart(2, "0")}`}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Identity Verification (KYC) */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100">
                      <SecurityIconOutline size={32} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Identity Verification</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Please provide your identification document for KYC verification
                    </p>
                  </div>

                  <div className="space-y-4">
                    <FormSelectModule
                      label="ID Type"
                      name="idType"
                      value={formData.idType}
                      onChange={handleInputChange}
                      options={idTypeOptions}
                      required
                      error={fieldErrors.idType}
                    />

                    <BasicFormInput
                      label="ID Number"
                      type="text"
                      name="idNumber"
                      placeholder={`Enter your ${
                        formData.idType
                          ? idTypeOptions
                              .find((opt) => opt.value === formData.idType)
                              ?.label.toLowerCase()
                              ?.split("(")[0]
                              ?.trim()
                          : "ID"
                      } number`}
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      required
                      error={fieldErrors.idNumber}
                    />

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Upload ID Document (Front) <span className="text-red-500">*</span>
                      </label>
                      {!formData.idFrontImage ? (
                        <div className="flex w-full items-center justify-center">
                          <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pb-6 pt-5">
                              <svg
                                className="mb-4 size-8 text-gray-500"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, "idFrontImage")}
                            />
                          </label>
                        </div>
                      ) : null}
                      {uploadingFiles.idFrontImage ? (
                        <UploadProgress progress={uploadProgress.idFrontImage || 0} />
                      ) : formData.idFrontImage ? (
                        <UploadedFileDisplay
                          fieldName="idFrontImage"
                          fileName={formData.idFrontImage}
                          previewUrl={formData.idFrontImagePreview}
                          onDelete={() => handleFileDelete("idFrontImage")}
                        />
                      ) : null}
                      {fieldErrors.idFrontImage && (
                        <p className="mt-1 text-xs text-red-600">Please upload your ID document</p>
                      )}
                    </div>

                    <div className={`flex items-center space-x-2 ${fieldErrors.acceptTerms ? "text-red-600" : ""}`}>
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className={`size-4 rounded border-gray-300 text-[#1447E6] focus:ring-[#1447E6] ${
                          fieldErrors.acceptTerms ? "border-red-500" : ""
                        }`}
                      />
                      <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                        I agree to the{" "}
                        <Link href="/terms" className="text-[#1447E6] hover:underline">
                          Terms and Conditions
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-[#1447E6] hover:underline">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {formError && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-red-50 p-3">
                  <p className="text-sm text-red-600">{formError}</p>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex w-full justify-between space-x-4 ">
                {currentStep === 1 && (
                  <ButtonModule
                    icon={<VscArrowRight />}
                    iconPosition="end"
                    type="button"
                    variant="primary"
                    onClick={nextStep}
                    className="w-full py-3"
                  >
                    Continue
                  </ButtonModule>
                )}

                {currentStep === 2 && (
                  <>
                    <ButtonModule
                      icon={<VscArrowLeft />}
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="py-3"
                    >
                      Previous
                    </ButtonModule>
                    <ButtonModule
                      icon={<VscArrowRight />}
                      iconPosition="end"
                      type="button"
                      variant="primary"
                      onClick={nextStep}
                      className="py-3"
                    >
                      Verify
                    </ButtonModule>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <ButtonModule
                      icon={<VscArrowLeft />}
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="py-3"
                    >
                      Previous
                    </ButtonModule>
                    <ButtonModule type="submit" variant="primary" disabled={loading} className="py-3">
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <span className="ml-2">Creating Account...</span>
                        </div>
                      ) : (
                        "Create Profile"
                      )}
                    </ButtonModule>
                  </>
                )}
              </div>
            </form>
          </motion.div>
        </motion.main>
      </div>
    </div>
  )
}

export default AccountSetup
