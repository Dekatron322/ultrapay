"use client"
import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "lib/redux/store"
import { ButtonModule } from "components/ui/Button/Button"
import { FormInputModule as BasicFormInput } from "components/ui/Input/Input"
import { FormInputModule } from "components/ui/Input/EmailInput"
import { motion } from "framer-motion"
import { FormSelectModule } from "components/ui/Input/FormSelectModule"
import { ContactIconOutline, SecurityIconOutline, UserOutlineIcon } from "components/Icons/LogoIcons"
import { VscArrowLeft, VscArrowRight } from "react-icons/vsc"
import {
  submitPersonalInfo,
  clearPersonalInfoStatus,
  verifyPhone,
  clearPhoneVerificationStatus,
  resendPhoneOtp,
  clearResendPhoneOtpStatus,
  verifyIdentity,
  clearIdentityVerificationStatus,
  fetchKycStatus,
} from "lib/redux/merchantKycSlice"
import { fetchCountries } from "lib/redux/systemsSlice"
import { uploadToCloudinary } from "lib/config/cloudinary"
import { notify } from "components/ui/Notification/Notification"

// Identity Type enum
enum IdentityType {
  Unknown = 0,
  NationalIdentity = 1,
  Passport = 2,
  DriverLicense = 3,
  VotersCard = 4,
  Bvn = 5,
}

interface Testimonial {
  id: number
  image: string
  quote: string
  name: string
  title: string
  company: string
}

const AccountSetup: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  // Redux state for merchant KYC
  const {
    isSubmittingPersonalInfo,
    personalInfoError,
    personalInfoSuccess,
    isVerifyingPhone,
    phoneVerificationError,
    phoneVerificationSuccess,
    isResendingPhoneOtp,
    resendPhoneOtpError,
    resendPhoneOtpSuccess,
    isSubmittingIdentityVerification,
    identityVerificationError,
    identityVerificationSuccess,
    isFetchingKycStatus,
    kycStatusError,
    kycStatus,
  } = useSelector((state: RootState) => state.merchantKyc)

  // Redux state for systems
  const {
    countries,
    loading: countriesLoading,
    error: countriesError,
  } = useSelector((state: RootState) => state.systems)

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

  // Upload progress states
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({})

  // Transform countries data for dropdown
  const transformedCountries = countries.map((country) => ({
    value: country.abbreviation,
    label: `${country.name} +${country.callingCode}`,
    icon: country.currency.avatar,
    iconType: "image" as const,
  }))

  // Handle countries loading and error states
  useEffect(() => {
    if (countriesError) {
      setFormError("Failed to load countries. Please refresh the page.")
    }
  }, [countriesError])

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

  // Fetch countries on component mount
  useEffect(() => {
    if (countries.length === 0 && !countriesLoading) {
      dispatch(fetchCountries())
    }
  }, [countries.length, countriesLoading, dispatch])

  // Fetch KYC status on component mount
  useEffect(() => {
    dispatch(fetchKycStatus())
  }, [dispatch])

  // Handle KYC status response and automatically show appropriate step
  useEffect(() => {
    if (kycStatus) {
      if (kycStatus.isPhoneConfirmed) {
        // Phone is confirmed, show KYC step directly
        setCurrentStep(3)
      }
      // If phone is not confirmed, stay at current step (will be step 1 by default)
    }
  }, [kycStatus])

  // Handle personal info submission success
  useEffect(() => {
    if (personalInfoSuccess) {
      // Clear the success status
      dispatch(clearPersonalInfoStatus())

      // Check if phone is already confirmed
      if (kycStatus && kycStatus.isPhoneConfirmed) {
        // Skip phone verification and go directly to KYC step
        setCurrentStep(3)
      } else {
        // Move to phone verification step
        setCurrentStep((prev) => prev + 1)
      }
    }
  }, [personalInfoSuccess, dispatch, kycStatus])

  // Handle personal info submission error
  useEffect(() => {
    if (personalInfoError) {
      setFormError(personalInfoError)
    }
  }, [personalInfoError])

  // Handle phone verification success
  useEffect(() => {
    if (phoneVerificationSuccess) {
      // Clear the success status and move to next step
      dispatch(clearPhoneVerificationStatus())
      setCurrentStep((prev) => prev + 1)
    }
  }, [phoneVerificationSuccess, dispatch])

  // Handle phone verification error
  useEffect(() => {
    if (phoneVerificationError) {
      setFormError(phoneVerificationError)
    }
  }, [phoneVerificationError])

  // Handle resend phone OTP success
  useEffect(() => {
    if (resendPhoneOtpSuccess) {
      // Clear the success status and reset counter
      dispatch(clearResendPhoneOtpStatus())
      setCounter(60)
      setCanResend(false)
      // Clear OTP input fields
      setFormData((prev) => ({ ...prev, otp: Array(6).fill("") }))
      // Clear any existing errors
      setFormError(null)
    }
  }, [resendPhoneOtpSuccess, dispatch])

  // Handle resend phone OTP error
  useEffect(() => {
    if (resendPhoneOtpError) {
      setFormError(resendPhoneOtpError)
    }
  }, [resendPhoneOtpError])

  // Handle KYC status error
  useEffect(() => {
    if (kycStatusError) {
      console.error("Failed to fetch KYC status:", kycStatusError)
      // Don't show error to user, just log it as it's not critical for the flow
    }
  }, [kycStatusError])

  // Handle identity verification success
  useEffect(() => {
    if (identityVerificationSuccess) {
      // Clear the success status and redirect to dashboard
      dispatch(clearIdentityVerificationStatus())

      // Show success notification
      notify("success", "Identity verification completed successfully!", {
        title: "Verification Successful",
        description: "Your identity information has been saved and verified.",
        duration: 5000,
      })

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    }
  }, [identityVerificationSuccess, dispatch, router])

  // Handle identity verification error
  useEffect(() => {
    if (identityVerificationError) {
      setFormError(identityVerificationError)

      // Show error notification
      notify("error", "Identity verification failed", {
        title: "Verification Error",
        description: identityVerificationError,
        duration: 5000,
      })
    }
  }, [identityVerificationError])

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    // { value: "other", label: "Other" },
    // { value: "prefer-not-to-say", label: "Prefer not to say" },
  ]

  const idTypeOptions = [
    { value: IdentityType.NationalIdentity.toString(), label: "National Identification Number (NIN)" },
    { value: IdentityType.Passport.toString(), label: "International Passport" },
    { value: IdentityType.DriverLicense.toString(), label: "Driver's License" },
    { value: IdentityType.VotersCard.toString(), label: "Voter's Card" },
    { value: IdentityType.Bvn.toString(), label: "Bank Verification Number (BVN)" },
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

    // Call the resend OTP API with the phone number
    dispatch(resendPhoneOtp(formData.phone))
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

  const handleFileUpload = async (fieldName: string, file: File) => {
    if (formError) setFormError(null)
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: false }))
    }

    // Create a preview URL for the uploaded image
    const imageUrl = URL.createObjectURL(file)

    // Set uploading state
    setUploadingFiles((prev) => ({ ...prev, [fieldName]: true }))
    setUploadProgress((prev) => ({ ...prev, [fieldName]: 0 }))

    try {
      // Upload to Cloudinary using the helper function
      const result = await uploadToCloudinary(file, "identity_documents")

      // Store the Cloudinary URL and preview
      setFormData((prev) => ({
        ...prev,
        [fieldName]: result.secure_url, // Store the Cloudinary URL
        [`${fieldName}Preview` as keyof typeof formData]: imageUrl,
      }))

      // Show success notification for file upload
      notify("success", "Document uploaded successfully", {
        title: "Upload Successful",
        description: "Your identity document has been uploaded to Cloudinary.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Upload error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to upload image. Please try again."
      setFormError(errorMessage)

      // Show error notification for upload failure
      notify("error", "Upload failed", {
        title: "Upload Error",
        description: errorMessage,
        duration: 5000,
      })

      // Reset the file input
      const fileInput = document.querySelector(`input[name="${fieldName}"]`) as HTMLInputElement
      if (fileInput) {
        fileInput.value = ""
      }
    } finally {
      // Reset uploading state
      setUploadingFiles((prev) => ({ ...prev, [fieldName]: false }))
      setUploadProgress((prev) => ({ ...prev, [fieldName]: 0 }))
    }
  }

  const handleFileDelete = (fieldName: string) => {
    // Revoke the object URL to prevent memory leaks
    const previewKey = `${fieldName}Preview` as keyof typeof formData
    if (formData[previewKey] && typeof formData[previewKey] === "string") {
      URL.revokeObjectURL(formData[previewKey] as string)
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: "",
      [`${fieldName}Preview` as keyof typeof formData]: "",
    }))
    setFieldErrors((prev) => ({ ...prev, [fieldName]: false }))

    // Reset the file input
    const fileInput = document.querySelector(`input[name="${fieldName}"]`) as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
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

    // For NIN and BVN, only require ID number
    if (
      (idType === IdentityType.NationalIdentity.toString() || idType === IdentityType.Bvn.toString()) &&
      !idNumber.trim()
    ) {
      errors.idNumber = true
    }

    // For Passport, Driver's License, and Voter's Card, require both ID number and document
    if (
      (idType === IdentityType.Passport.toString() ||
        idType === IdentityType.DriverLicense.toString() ||
        idType === IdentityType.VotersCard.toString()) &&
      (!idNumber.trim() || !idFrontImage)
    ) {
      if (!idNumber.trim()) errors.idNumber = true
      if (!idFrontImage) errors.idFrontImage = true
    }

    if (!acceptTerms) errors.acceptTerms = true

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setFormError("Please complete all required fields and accept terms")
      return false
    }

    // Validate ID number based on type
    if (idType === IdentityType.NationalIdentity.toString() && !/^\d{11}$/.test(idNumber)) {
      setFieldErrors({ idNumber: true })
      setFormError("NIN must be 11 digits")
      return false
    }

    if (idType === IdentityType.Bvn.toString() && !/^\d{11}$/.test(idNumber)) {
      setFieldErrors({ idNumber: true })
      setFormError("BVN must be 11 digits")
      return false
    }

    if (idType === IdentityType.Passport.toString() && idNumber.length < 6) {
      setFieldErrors({ idNumber: true })
      setFormError("Please enter a valid passport number")
      return false
    }

    if (idType === IdentityType.DriverLicense.toString() && idNumber.length < 8) {
      setFieldErrors({ idNumber: true })
      setFormError("Please enter a valid driver's license number")
      return false
    }

    if (idType === IdentityType.VotersCard.toString() && idNumber.length < 8) {
      setFieldErrors({ idNumber: true })
      setFormError("Please enter a valid voter's card number")
      return false
    }

    setFieldErrors({})
    return true
  }

  // Navigation functions
  const nextStep = () => {
    setFormError(null)

    if (currentStep === 1) {
      if (!validateStep1()) return

      // Submit personal info to API
      const { firstName, lastName, phone, dateOfBirth, gender } = formData

      // Convert gender string to number (0 for male, 1 for female)
      const genderNumber = gender === "male" ? 0 : 1

      const personalInfoData = {
        firstName,
        lastName,
        phoneNumber: phone,
        dateOfBirth,
        gender: genderNumber,
      }

      dispatch(submitPersonalInfo(personalInfoData))
      return // Don't increment step here - wait for API success
    }

    if (currentStep === 2) {
      if (!validateStep2()) return

      // Submit phone verification to API
      const otpString = formData.otp.join("")

      const otpData = {
        otp: otpString,
      }

      dispatch(verifyPhone(otpData))
      return // Don't increment step here - wait for API success
    }

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

    // Submit identity verification to API
    const { idType, idNumber, idFrontImage, acceptTerms } = formData

    const identityData = {
      identityType: parseInt(idType),
      identityNumber: idNumber,
      identityDocumentFront: idFrontImage || "", // Empty string for NIN/BVN which don't require document
      termsAccepted: acceptTerms,
    }

    dispatch(verifyIdentity(identityData))
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
    // Check if it's an image (Cloudinary URLs or local file extensions)
    const isImage =
      previewUrl &&
      (fileName.toLowerCase().includes("cloudinary") ||
        fileName.toLowerCase().endsWith(".jpg") ||
        fileName.toLowerCase().endsWith(".jpeg") ||
        fileName.toLowerCase().endsWith(".png") ||
        fileName.toLowerCase().endsWith(".gif") ||
        fileName.toLowerCase().endsWith(".webp"))

    // Extract filename from Cloudinary URL or use the fileName directly
    const displayName = fileName.includes("cloudinary")
      ? fileName.split("/").pop()?.split("?")[0] || "Identity Document"
      : fileName

    return (
      <div className="mt-4">
        <div className="relative rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {isImage ? (
                  <img
                    src={previewUrl}
                    alt={displayName}
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
                <p className="truncate text-sm font-medium text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500">Identity document uploaded successfully</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onDelete}
              className="flex-shrink-0 rounded-full p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
              title="Delete file"
            >
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="mb-4  pb-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 rounded-lg   px-2 py-1 text-sm text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-900"
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
                          className={`flex h-11 w-32 items-center justify-between rounded-l-lg border bg-[#F9FAFB] p-3 text-sm focus:border-[#1447E6] focus:outline-none focus:ring-1 focus:ring-[#1447E6] ${
                            fieldErrors.country ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {formData.country && (
                              <Image
                                src={transformedCountries.find((c) => c.value === formData.country)?.icon || ""}
                                alt={
                                  transformedCountries.find((c) => c.value === formData.country)?.label.split(" ")[0] ||
                                  ""
                                }
                                width={20}
                                height={14}
                                className="rounded-sm"
                              />
                            )}
                            <span>
                              {formData.country
                                ? transformedCountries.find((c) => c.value === formData.country)?.label.split(" ")[1]
                                : "Country"}
                            </span>
                          </span>
                          <svg className="ml-1 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {countryDropdownOpen && (
                          <div className="absolute left-0 top-full z-50 mt-1 w-60 rounded-lg border border-gray-200 bg-white shadow-lg">
                            <div className="max-h-60 overflow-auto">
                              {countriesLoading ? (
                                <div className="flex items-center justify-center py-4">
                                  <div className="size-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                                  <span className="ml-2 text-sm text-gray-600">Loading countries...</span>
                                </div>
                              ) : transformedCountries.length > 0 ? (
                                transformedCountries.map((country) => (
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
                                ))
                              ) : (
                                <div className="py-4 text-center text-sm text-gray-600">No countries available</div>
                              )}
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
                          canResend && !isResendingPhoneOtp
                            ? "text-blue-600 hover:text-blue-500 hover:underline"
                            : "cursor-not-allowed text-gray-400"
                        }`}
                        onClick={handleResendOtp}
                        disabled={!canResend || isResendingPhoneOtp}
                      >
                        {isResendingPhoneOtp
                          ? "Sending..."
                          : canResend
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

                    {formData.idType === IdentityType.NationalIdentity.toString() ? (
                      <BasicFormInput
                        label="NIN Number"
                        type="text"
                        name="idNumber"
                        placeholder="Enter your NIN number"
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        required
                        error={fieldErrors.idNumber}
                      />
                    ) : formData.idType === IdentityType.Bvn.toString() ? (
                      <BasicFormInput
                        label="BVN Number"
                        type="text"
                        name="idNumber"
                        placeholder="Enter your BVN number"
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        required
                        error={fieldErrors.idNumber}
                      />
                    ) : (
                      <div>
                        <BasicFormInput
                          label="ID Number"
                          type="text"
                          name="idNumber"
                          placeholder={`Enter your ${idTypeOptions
                            .find((opt) => opt.value === formData.idType)
                            ?.label.toLowerCase()} number`}
                          value={formData.idNumber}
                          onChange={handleInputChange}
                          required
                          error={fieldErrors.idNumber}
                        />

                        {(formData.idType === IdentityType.Passport.toString() ||
                          formData.idType === IdentityType.DriverLicense.toString() ||
                          formData.idType === IdentityType.VotersCard.toString()) && (
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
                        )}
                      </div>
                    )}

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
                    disabled={isSubmittingPersonalInfo}
                    className="w-full py-3"
                  >
                    {isSubmittingPersonalInfo ? (
                      <div className="flex items-center justify-center">
                        <span className="ml-2">Submitting...</span>
                      </div>
                    ) : (
                      "Continue"
                    )}
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
                      disabled={isVerifyingPhone}
                      className="py-3"
                    >
                      {isVerifyingPhone ? (
                        <div className="flex items-center justify-center">
                          <span className="ml-2">Verifying...</span>
                        </div>
                      ) : (
                        "Verify"
                      )}
                    </ButtonModule>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <ButtonModule
                      icon={<VscArrowLeft />}
                      variant="outline"
                      onClick={prevStep}
                      disabled={isSubmittingIdentityVerification}
                      className="flex-1"
                    >
                      Back
                    </ButtonModule>
                    <ButtonModule
                      type="submit"
                      variant="primary"
                      disabled={isSubmittingIdentityVerification}
                      className="flex-1 py-3"
                    >
                      {isSubmittingIdentityVerification ? (
                        <div className="flex items-center justify-center">
                          <span className="ml-2">Verifying Identity...</span>
                        </div>
                      ) : (
                        "Complete Verification"
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
