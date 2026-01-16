"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ButtonModule } from "components/ui/Button/Button"
import { FormInputModule as BasicFormInput } from "components/ui/Input/Input"
import { FormInputModule } from "components/ui/Input/EmailInput"
import { PasswordInputModule } from "components/ui/Input/PasswordInput"
import { motion, AnimatePresence } from "framer-motion"
import { FormSelectModule } from "components/ui/Input/FormSelectModule"
import {
  ContactIconOutline,
  EmailIconOutline,
  HousesOutlineIcon,
  MapIconOutline,
  SecurityIconOutline,
  UserOutlineIcon,
} from "components/Icons/LogoIcons"

interface Testimonial {
  id: number
  image: string
  quote: string
  name: string
  title: string
  company: string
}

const TenantSignUp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [suggestedPassword, setSuggestedPassword] = useState("")
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const router = useRouter()

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
    email: "",
    phone: "",
    dateOfBirth: "",
    occupation: "",

    // Step 2: Residence Details
    assignedEstate: "", // Estate code the tenant will live in
    unitNumber: "",
    householdSize: "",
    preferredUnitType: "",
    currentAddress: "",
    moveInDate: "",

    // Step 3: Account Security
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })

  // Assigned estate validation state
  const [estateInfo, setEstateInfo] = useState<{
    id: string
    name: string
    location: string
    buildingsCount: number
  } | null>(null)
  const [estateValidating, setEstateValidating] = useState(false)
  const [estateCodeError, setEstateCodeError] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000) // Change testimonial every 5 seconds

    return () => clearInterval(interval)
  }, [testimonials.length])

  // Options
  const unitTypeOptions = [
    { value: "studio", label: "Studio" },
    { value: "1-bed", label: "1 Bedroom" },
    { value: "2-bed", label: "2 Bedroom" },
    { value: "3-bed", label: "3 Bedroom" },
    { value: "duplex", label: "Duplex" },
  ]

  // Sample estates (in real app, this would come from API)
  const estateOptions = [
    { value: "estate-1", label: "Lekki Gardens Phase 1" },
    { value: "estate-2", label: "Banana Island Estate" },
    { value: "estate-3", label: "Victoria Island Towers" },
    { value: "estate-4", label: "Ikoyi Luxury Apartments" },
    { value: "estate-5", label: "Ajah Premium Estate" },
    { value: "estate-6", label: "Other - Will be assigned" },
  ]

  // Accept any non-empty assigned estate code as valid (no API)
  useEffect(() => {
    const code = formData.assignedEstate.trim()
    if (!code) {
      setEstateInfo(null)
      setEstateCodeError(null)
      setEstateValidating(false)
      return
    }
    // Derive a deterministic buildings count from the code (mocked)
    const buildings = Math.max(1, Array.from(code).reduce((a, ch) => a + ch.charCodeAt(0), 0) % 40) + 5
    setEstateValidating(false)
    setEstateCodeError(null)
    setEstateInfo({
      id: code,
      name: "Verified estate",
      location: "Lagos, Nigeria",
      buildingsCount: buildings,
    })
  }, [formData.assignedEstate])

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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData((prev) => ({ ...prev, password: value }))
    setPasswordStrength(checkPasswordStrength(value))
    if (formError) setFormError(null)
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

  const handleSuggestPassword = () => {
    const pwd = generatePassword()
    setSuggestedPassword(pwd)
  }

  const handleUseSuggested = () => {
    if (!suggestedPassword) return
    setFormData((prev) => ({
      ...prev,
      password: suggestedPassword,
      confirmPassword: suggestedPassword,
    }))
    setPasswordStrength(checkPasswordStrength(suggestedPassword))
    if (formError) setFormError(null)
  }

  // Validation functions for each step
  const validateStep1 = () => {
    const { firstName, lastName, email, phone, dateOfBirth } = formData
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !dateOfBirth.trim()) {
      setFormError("Please fill in all required fields")
      return false
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setFormError("Please enter a valid email address")
      return false
    }

    if (!/^\d{11}$/.test(phone.replace(/\D/g, ""))) {
      setFormError("Please enter a valid 11-digit phone number")
      return false
    }

    return true
  }

  const validateStep2 = () => {
    const { assignedEstate, unitNumber, householdSize, preferredUnitType } = formData
    if (!assignedEstate || !unitNumber.trim() || !householdSize.trim() || !preferredUnitType) {
      setFormError("Please fill in all residence details")
      return false
    }

    if (!estateInfo) {
      setFormError("Please enter a valid estate code")
      return false
    }

    return true
  }

  const validateStep3 = () => {
    const { password, confirmPassword, acceptTerms } = formData

    if (!password.trim() || !confirmPassword.trim()) {
      setFormError("Please fill in all password fields")
      return false
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match")
      return false
    }

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long")
      return false
    }

    if (passwordStrength < 3) {
      setFormError("Please choose a stronger password")
      return false
    }

    if (!acceptTerms) {
      setFormError("Please accept the terms and conditions")
      return false
    }

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

      // Redirect to verification page
      router.push("/sign-up/verify-account")
    } catch (error) {
      setFormError("An error occurred during registration. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200"
    if (passwordStrength <= 2) return "bg-red-500"
    if (passwordStrength <= 3) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return ""
    if (passwordStrength <= 2) return "Weak"
    if (passwordStrength <= 3) return "Medium"
    return "Strong"
  }

  // Step progress component
  const StepProgress = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  step === currentStep
                    ? "border-[#1447E6] bg-[#1447E6] text-white"
                    : step < currentStep
                    ? "border-[#1447E6] bg-[#1447E6] text-white"
                    : "border-gray-300 bg-white text-gray-500"
                }`}
              >
                {step < currentStep ? (
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
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
                {step === 1 && "Tenant Info"}
                {step === 2 && "Residence Details"}
                {step === 3 && "Security"}
              </span>
            </div>
            {step < 3 && <div className={`mx-4 h-0.5 flex-1 ${step < currentStep ? "bg-[#1447E6]" : "bg-gray-300"}`} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  )

  // Get current testimonial safely
  const currentTestimonialData = testimonials[currentTestimonial]

  return (
    <div className="relative flex min-h-screen grid-cols-1 bg-gradient-to-br from-[#ffffff]">
      {/* Form Container */}
      <div className="container flex flex-col items-center justify-center border-r-2 border-[#ffffff80] py-8 max-sm:px-5 md:w-[50%]">
        <motion.main
          className="flex w-full flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h5 className="font-bold text-[#1447E6]">LOGO</h5>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-2xl rounded-2xl md:p-8"
          >
            <div className="mx-4 mb-8 border-b pb-6 text-center">
              <h1 className="text-3xl font-bold text-[#1447E6]">Tenant Registration</h1>
              <p className="mt-2 text-[#101836]">
                Create your tenant account to access your estate and unit information.
              </p>
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
                    />
                  </div>

                  <FormInputModule
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    IconComponent={(iconProps) => <EmailIconOutline size={18} {...iconProps} />}
                    required
                  />

                  <FormInputModule
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    IconComponent={(iconProps) => <ContactIconOutline size={18} {...iconProps} />}
                    required
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <BasicFormInput
                      label="Date of Birth"
                      type="date"
                      name="dateOfBirth"
                      placeholder=""
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                    <FormInputModule
                      label="Occupation (optional)"
                      type="text"
                      name="occupation"
                      placeholder="e.g., Engineer"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      IconComponent={(iconProps) => <HousesOutlineIcon size={18} {...iconProps} />}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Residence Details */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormInputModule
                      label="Unit Number"
                      type="text"
                      name="unitNumber"
                      placeholder="e.g., B12"
                      value={formData.unitNumber}
                      onChange={handleInputChange}
                      IconComponent={(iconProps) => <HousesOutlineIcon size={18} {...iconProps} />}
                      required
                    />
                    <FormInputModule
                      label="Household Size"
                      type="number"
                      name="householdSize"
                      placeholder="e.g., 3"
                      value={formData.householdSize}
                      onChange={handleInputChange}
                      IconComponent={(iconProps) => <UserOutlineIcon size={18} {...iconProps} />}
                      required
                    />
                  </div>

                  <FormSelectModule
                    label="Preferred Unit Type"
                    name="preferredUnitType"
                    value={formData.preferredUnitType}
                    onChange={handleInputChange}
                    options={unitTypeOptions}
                    placeholder="Select a unit type"
                    required
                  />

                  <FormInputModule
                    label="Current Address (optional)"
                    type="text"
                    name="currentAddress"
                    placeholder="Your current address"
                    value={formData.currentAddress}
                    onChange={handleInputChange}
                    IconComponent={(iconProps) => <MapIconOutline size={18} {...iconProps} />}
                  />

                  <BasicFormInput
                    label="Expected Move-in Date (optional)"
                    type="date"
                    name="moveInDate"
                    placeholder=""
                    value={formData.moveInDate}
                    onChange={handleInputChange}
                  />

                  <FormInputModule
                    label="Apartment Code"
                    type="text"
                    name="assignedEstate"
                    placeholder="Enter apartment code provided to you"
                    value={formData.assignedEstate}
                    onChange={handleInputChange}
                    IconComponent={(iconProps) => <HousesOutlineIcon size={18} {...iconProps} />}
                    required
                  />

                  {/* Estate code validation feedback */}
                  {formData.assignedEstate && (
                    <div className="-mt-2 space-y-2">
                      {estateCodeError && <p className="text-sm text-red-600">{estateCodeError}</p>}
                      {estateInfo && (
                        <div className="rounded-md border border-[#1447E6] bg-[#F3F4F6] p-3">
                          <p className="text-sm font-medium text-[#100A55]">Apartment Information</p>
                          <ul className="mt-1 space-y-1 text-sm text-[#5B5B7B]">
                            <li>
                              <span className="font-medium text-[#100A55]">Apartment Code:</span> {estateInfo.id}
                            </li>
                            {formData.unitNumber && (
                              <li>
                                <span className="font-medium text-[#100A55]">Unit Number:</span> {formData.unitNumber}
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Account Security */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <PasswordInputModule
                      label="Password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handlePasswordChange}
                    />

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="mb-1 flex justify-between text-xs text-gray-600">
                          <span>Password strength:</span>
                          <span
                            className={`font-medium ${
                              passwordStrength <= 2
                                ? "text-red-600"
                                : passwordStrength <= 3
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          />
                        </div>
                        <ul className="mt-2 space-y-1 text-xs text-gray-500">
                          <li className={formData.password.length >= 8 ? "text-green-600" : ""}>
                            • At least 8 characters
                          </li>
                          <li className={/[A-Z]/.test(formData.password) ? "text-green-600" : ""}>
                            • One uppercase letter
                          </li>
                          <li className={/[a-z]/.test(formData.password) ? "text-green-600" : ""}>
                            • One lowercase letter
                          </li>
                          <li className={/[0-9]/.test(formData.password) ? "text-green-600" : ""}>• One number</li>
                          <li className={/[^A-Za-z0-9]/.test(formData.password) ? "text-green-600" : ""}>
                            • One special character
                          </li>
                        </ul>
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <button
                            type="button"
                            onClick={handleSuggestPassword}
                            className="text-[#1447E6] hover:underline"
                          >
                            Suggest a strong password
                          </button>
                          {suggestedPassword && (
                            <div className="flex items-center gap-2">
                              <code className="rounded bg-gray-100 px-2 py-1 text-gray-700">{suggestedPassword}</code>
                              <button
                                type="button"
                                onClick={handleUseSuggested}
                                className="rounded bg-[#1447E6] px-2 py-1 font-medium text-white hover:opacity-90"
                              >
                                Use
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <PasswordInputModule
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  />

                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-600">Passwords do not match</p>
                  )}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password && (
                    <p className="text-xs text-green-600">Passwords match</p>
                  )}

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-[#1447E6] focus:ring-[#1447E6]"
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
                </motion.div>
              )}

              {/* Error Message */}
              {formError && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-red-50 p-3">
                  <p className="text-sm text-red-600">{formError}</p>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex space-x-4 pt-4">
                {currentStep > 1 && (
                  <ButtonModule type="button" variant="outline" onClick={prevStep} className="flex-1 py-3">
                    Previous
                  </ButtonModule>
                )}

                {currentStep < 3 ? (
                  <ButtonModule type="button" variant="primary" onClick={nextStep} className="flex-1 py-3">
                    Continue
                  </ButtonModule>
                ) : (
                  <ButtonModule type="submit" variant="primary" disabled={loading} className="flex-1 py-3">
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                        <span className="ml-2">Creating Account...</span>
                      </div>
                    ) : (
                      "Create Tenant Account"
                    )}
                  </ButtonModule>
                )}
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex gap-2 text-center text-sm text-gray-500"
          >
            <p>Already have an account?</p>
            <Link href="/" className="text-[#1447E6] transition-all duration-300 ease-in-out hover:underline">
              Sign In
            </Link>
          </motion.div>
        </motion.main>
      </div>

      {/* Testimonial Slider Container */}
      <div className="relative w-[50%] bg-[#E5E7EB] ">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute right-0 top-[-25%] z-0 flex h-full"
        >
          {/* <img src="/auth-background.svg" alt="auth-background" className="w-full" /> */}
        </motion.div>

        {/* Testimonial Slider */}
        <div className="flex h-full flex-col items-center justify-center px-16">
          <AnimatePresence mode="wait">
            {currentTestimonialData && (
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex max-w-2xl flex-col items-center text-center"
              >
                {/* Quote Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-8 text-6xl text-[#1447E6]"
                >
                  "
                </motion.div>

                {/* Testimonial Quote */}
                <motion.blockquote
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-8 text-2xl font-medium leading-relaxed text-[#100A55]"
                >
                  {currentTestimonialData.quote}
                </motion.blockquote>
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  src={currentTestimonialData.image}
                  alt="testimonial"
                  className="mb-8 h-24 w-24 rounded-full"
                />

                {/* Testimonial Author */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-center"
                >
                  <div className="text-lg font-semibold text-[#1447E6]">{currentTestimonialData.name}</div>
                  <div className="text-sm text-[#100A55] opacity-80">{currentTestimonialData.title}</div>
                  <div className="text-sm text-[#100A55] opacity-60">{currentTestimonialData.company}</div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Slider Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="mt-10 flex justify-center space-x-3"
          >
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? "w-8 bg-[#1447E6]" : "w-2 bg-[#100A55] opacity-30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </motion.div>

          {/* Additional Marketing Text */}
          <div className="z-10 flex items-center justify-center pt-32">
            <motion.h1
              className="max-w-[70%] text-center text-3xl font-semibold text-[#100A55]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <span className="text-[#1447E6]">The</span> Complete.{" "}
              <span className="text-[#1447E6]">Property Management</span> Solution{" "}
              <span className="text-[#1447E6]">for Nigeria</span>
            </motion.h1>
          </div>
          <div className="z-10 flex items-center justify-center px-10 ">
            <motion.p
              className="max-w-[80%] text-center text-[#100A55]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              Manage properties, tenants, maintenance, and finances all in one powerful platform. Built specifically for
              Nigerian property managers and real estate professionals.
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TenantSignUp
