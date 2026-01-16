"use client"
import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
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
import { VscArrowLeft, VscArrowRight } from "react-icons/vsc"
import VerificationModal from "components/ui/Modal/verification-modal"

interface Testimonial {
  id: number
  image: string
  quote: string
  name: string
  title: string
  company: string
}

const BusinessInformation: React.FC = () => {
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
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const router = useRouter()

  // Upload progress states
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({})

  const countries: Array<{ value: string | number; label: string; icon?: string; iconType?: "emoji" | "svg" }> = [
    { value: "NG", label: "Nigeria +234", icon: "/ultra-pay/NG.svg", iconType: "svg" },
    // { value: "US", label: "United States +1", icon: "/ultra-pay/US.svg", iconType: "svg" },
    // { value: "UK", label: "United Kingdom +44", icon: "/ultra-pay/UK.svg", iconType: "svg" },
    // { value: "CA", label: "Canada +1", icon: "/ultra-pay/CA.svg", iconType: "svg" },
    { value: "GH", label: "Ghana +233", icon: "/ultra-pay/GH.svg", iconType: "svg" },
    { value: "KE", label: "Kenya +254", icon: "/ultra-pay/KE.svg", iconType: "svg" },
    // { value: "ZA", label: "South Africa +27", icon: "/ultra-pay/ZA.svg", iconType: "svg" },
  ]

  const citiesByCountry: Record<string, { value: string; label: string }[]> = {
    NG: [
      { value: "lagos", label: "Lagos" },
      { value: "abuja", label: "Abuja" },
      { value: "kano", label: "Kano" },
      { value: "ibadan", label: "Ibadan" },
      { value: "port-harcourt", label: "Port Harcourt" },
      { value: "benin-city", label: "Benin City" },
      { value: "maiduguri", label: "Maiduguri" },
      { value: "zaria", label: "Zaria" },
      { value: "aba", label: "Aba" },
      { value: "jos", label: "Jos" },
      { value: "ile-ife", label: "Ile-Ife" },
      { value: "oyo", label: "Oyo" },
      { value: "enugu", label: "Enugu" },
      { value: "aba", label: "Aba" },
      { value: "funtua", label: "Funtua" },
    ],
    GH: [
      { value: "accra", label: "Accra" },
      { value: "kumasi", label: "Kumasi" },
      { value: "tamale", label: "Tamale" },
      { value: "takoradi", label: "Takoradi" },
      { value: "ashiaman", label: "Ashiaman" },
      { value: "tema", label: "Tema" },
      { value: "cape-coast", label: "Cape Coast" },
      { value: "obuasi", label: "Obuasi" },
      { value: "teshie", label: "Teshie" },
      { value: "koforidua", label: "Koforidua" },
    ],
    KE: [
      { value: "nairobi", label: "Nairobi" },
      { value: "mombasa", label: "Mombasa" },
      { value: "kisumu", label: "Kisumu" },
      { value: "nakuru", label: "Nakuru" },
      { value: "eldoret", label: "Eldoret" },
      { value: "kitale", label: "Kitale" },
      { value: "thika", label: "Thika" },
      { value: "malindi", label: "Malindi" },
      { value: "garissa", label: "Garissa" },
      { value: "kakamega", label: "Kakamega" },
    ],
  }

  const getCitiesForCountry = (countryCode: string) => {
    return citiesByCountry[countryCode] || []
  }

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
    // Step 1: Basic Business Information
    registeredBusinessName: "",
    businessEmail: "",
    businessType: "",
    businessCategory: "",

    // Step 2: Business Address
    nationality: "",
    businessFullAddress: "",
    city: "",
    proofOfAddress: "",
    proofOfAddressPreview: "",

    // Step 3: Proof of Business Formation
    certificateOfIncorporation: "",
    certificateOfIncorporationPreview: "",
    memorandumOfAssociation: "",
    memorandumOfAssociationPreview: "",
    tinOrVatCertificate: "",
    tinOrVatCertificatePreview: "",

    // Step 4: UBO Information (for LLC/Corporation only)
    ubos: [
      {
        fullName: "",
        email: "",
        phone: "",
        role: "",
        validId: "",
        validIdPreview: "",
      },
    ],

    // Step 4: Representative Info (for Sole Proprietorship only)
    representativeFullName: "",
    representativeEmail: "",
    representativePhone: "",
    representativeRole: "",
    representativeValidId: "",
    representativeValidIdPreview: "",

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

  useEffect(() => {
    // Clear city when nationality changes
    setFormData((prev) => ({
      ...prev,
      city: "",
    }))
  }, [formData.nationality])

  const businessTypeOptions = [
    { value: "sole_proprietorship", label: "Sole Proprietorship" },
    { value: "llc_corporation", label: "LLC/Corporation" },
  ]

  const businessCategoryOptions = [
    { value: "technology", label: "Technology" },
    { value: "retail", label: "Retail" },
    { value: "services", label: "Services" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "consulting", label: "Consulting" },
    { value: "other", label: "Other" },
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
  }

  // UBO management functions
  const addUbo = () => {
    setFormData((prev) => ({
      ...prev,
      ubos: [
        ...prev.ubos,
        {
          fullName: "",
          email: "",
          phone: "",
          role: "",
          validId: "",
          validIdPreview: "",
        },
      ],
    }))
  }

  const updateUbo = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      ubos: prev.ubos.map((ubo, i) => (i === index ? { ...ubo, [field]: value } : ubo)),
    }))
  }

  const removeUbo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ubos: prev.ubos.filter((_, i) => i !== index),
    }))
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

  // Validation functions for each step
  const validateStep1 = () => {
    const { registeredBusinessName, businessEmail, businessType, businessCategory } = formData
    const errors: Record<string, boolean> = {}

    if (!registeredBusinessName.trim()) errors.registeredBusinessName = true
    if (!businessEmail.trim()) errors.businessEmail = true
    if (!businessType) errors.businessType = true
    if (!businessCategory) errors.businessCategory = true

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setFormError("Please fill in all required fields")
      return false
    }

    if (!/^\S+@\S+\.\S+$/.test(businessEmail)) {
      setFieldErrors({ businessEmail: true })
      setFormError("Please enter a valid business email address")
      return false
    }

    setFieldErrors({})
    return true
  }

  const validateStep2 = () => {
    const { nationality, businessFullAddress, city, proofOfAddress } = formData
    const errors: Record<string, boolean> = {}

    if (!nationality.trim()) errors.nationality = true
    if (!businessFullAddress.trim()) errors.businessFullAddress = true
    if (!city.trim()) errors.city = true
    if (!proofOfAddress) errors.proofOfAddress = true

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setFormError("Please complete all required fields")
      return false
    }

    setFieldErrors({})
    return true
  }

  const validateStep3 = () => {
    const { certificateOfIncorporation, memorandumOfAssociation, tinOrVatCertificate } = formData
    const errors: Record<string, boolean> = {}

    if (!certificateOfIncorporation) errors.certificateOfIncorporation = true
    if (!memorandumOfAssociation) errors.memorandumOfAssociation = true
    if (!tinOrVatCertificate) errors.tinOrVatCertificate = true

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setFormError("Please upload all required documents")
      return false
    }

    setFieldErrors({})
    return true
  }

  const validateStep4 = () => {
    const errors: Record<string, boolean> = {}

    // For LLC/Corporation, UBO information is required
    if (formData.businessType === "llc_corporation") {
      formData.ubos.forEach((ubo, index) => {
        // Validate all UBOs (they should have data)
        if (!ubo.fullName.trim()) errors[`ubo_${index}_fullName`] = true
        if (!ubo.email.trim()) errors[`ubo_${index}_email`] = true
        if (!ubo.phone.trim()) errors[`ubo_${index}_phone`] = true
        if (!ubo.role.trim()) errors[`ubo_${index}_role`] = true
        if (!ubo.validId.trim()) errors[`ubo_${index}_validId`] = true
      })

      // Check if at least one UBO has any data
      const hasAnyUboData = formData.ubos.some(
        (ubo) => ubo.fullName.trim() || ubo.email.trim() || ubo.phone.trim() || ubo.role.trim() || ubo.validId.trim()
      )

      if (!hasAnyUboData) {
        setFormError("At least one Ultimate Beneficial Owner (UBO) information is required for LLC/Corporation")
        return false
      }
    }

    if (formData.businessType === "sole_proprietorship") {
      const hasAnyRepresentativeData =
        formData.representativeFullName.trim() ||
        formData.representativeEmail.trim() ||
        formData.representativePhone.trim() ||
        formData.representativeRole.trim() ||
        formData.representativeValidId.trim()

      if (hasAnyRepresentativeData) {
        if (!formData.representativeFullName.trim()) errors.representativeFullName = true
        if (!formData.representativeEmail.trim()) errors.representativeEmail = true
        if (!formData.representativePhone.trim()) errors.representativePhone = true
        if (!formData.representativeRole.trim()) errors.representativeRole = true
        if (!formData.representativeValidId.trim()) errors.representativeValidId = true
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Navigation functions
  const nextStep = () => {
    setFormError(null)

    if (currentStep === 1 && !validateStep1()) return
    if (currentStep === 2 && !validateStep2()) return
    if (currentStep === 3 && !validateStep3()) return

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

    if (!validateStep4()) return

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Show verification modal instead of redirecting
      setShowVerificationModal(true)
    } catch (error) {
      setFormError("An error occurred during registration. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Step progress component
  const StepProgress = () => {
    const totalSteps = 4
    const stepLabels =
      formData.businessType === "llc_corporation"
        ? ["Business Info", "Business Address", "Business Formation", "UBO Info"]
        : ["Business Info", "Business Address", "Business Formation", "Representative Info"]

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
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
                    <span className="text-sm font-medium">{step}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${step === currentStep ? "text-[#1447E6]" : "text-gray-500"}`}
                >
                  {stepLabels[step - 1]}
                </span>
              </div>
              {step < totalSteps && (
                <div className={`mx-4 h-0.5 flex-1 ${step < currentStep ? "bg-[#1447E6]" : "bg-gray-300"}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  // Get current testimonial safely
  const currentTestimonialData = testimonials[currentTestimonial]

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
                    className="h-16 w-16 rounded-lg border border-gray-300 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-gray-300 bg-gray-200">
                    <svg className="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  return (
    <div className="relative flex min-h-screen grid-cols-1 bg-gradient-to-br from-[#ffffff]">
      {/* Logo with full-width border */}
      <div className="fixed left-0 right-0 top-0 z-50 w-screen border-b border-gray-200 bg-white py-4">
        <div className="container w-full px-4">
          <Image src="/ultra-pay/logo.png" alt="Logo" width={155} height={100} />
        </div>
      </div>

      {/* Form Container */}
      <div className="container flex w-full flex-col items-center justify-center py-8 max-sm:px-5">
        <motion.main
          className="flex w-full flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-2xl rounded-2xl md:p-8"
          >
            <div className="mb-6 ">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  <VscArrowLeft />
                  Go Back
                </button>
                <h1 className="text-3xl font-bold text-[#1447E6]">Business Information</h1>
                <div className="w-16"></div>
              </div>
            </div>

            <StepProgress />

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Basic Business Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <FormInputModule
                    label="Registered Business Name"
                    type="text"
                    name="registeredBusinessName"
                    placeholder="Enter your registered business name"
                    value={formData.registeredBusinessName}
                    onChange={handleInputChange}
                    IconComponent={(iconProps) => <UserOutlineIcon size={18} {...iconProps} />}
                    required
                    error={fieldErrors.registeredBusinessName}
                  />

                  <FormInputModule
                    label="Business Email Address"
                    type="email"
                    name="businessEmail"
                    placeholder="Enter your business email address"
                    value={formData.businessEmail}
                    onChange={handleInputChange}
                    IconComponent={(iconProps) => <EmailIconOutline size={18} {...iconProps} />}
                    required
                    error={fieldErrors.businessEmail}
                  />

                  <FormSelectModule
                    label="Business Type"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    options={businessTypeOptions}
                    required
                    error={fieldErrors.businessType}
                  />

                  <FormSelectModule
                    label="Business Category"
                    name="businessCategory"
                    value={formData.businessCategory}
                    onChange={handleInputChange}
                    options={businessCategoryOptions}
                    required
                    error={fieldErrors.businessCategory}
                  />
                </motion.div>
              )}

              {/* Step 2: Business Address */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                      <MapIconOutline size={32} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Business Address</h3>
                    <p className="mt-2 text-sm text-gray-600">Enter your company address information</p>
                  </div>

                  <FormSelectModule
                    label="Nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    options={countries}
                    required
                    error={fieldErrors.nationality}
                  />

                  <BasicFormInput
                    label="Business Full Address"
                    type="text"
                    name="businessFullAddress"
                    placeholder="Enter your complete business address"
                    value={formData.businessFullAddress}
                    onChange={handleInputChange}
                    required
                    error={fieldErrors.businessFullAddress}
                  />

                  <FormSelectModule
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    options={getCitiesForCountry(formData.nationality)}
                    required
                    error={fieldErrors.city}
                    disabled={!formData.nationality}
                  />

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Upload Proof of Address <span className="text-red-500">*</span>
                    </label>
                    {!formData.proofOfAddress ? (
                      <div className="flex w-full items-center justify-center">
                        <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pb-6 pt-5">
                            <svg
                              className="mb-4 h-8 w-8 text-gray-500"
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
                            <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileChange(e, "proofOfAddress")}
                          />
                        </label>
                      </div>
                    ) : null}
                    {uploadingFiles.proofOfAddress ? (
                      <UploadProgress progress={uploadProgress.proofOfAddress || 0} />
                    ) : formData.proofOfAddress ? (
                      <UploadedFileDisplay
                        fieldName="proofOfAddress"
                        fileName={formData.proofOfAddress}
                        previewUrl={formData.proofOfAddressPreview}
                        onDelete={() => handleFileDelete("proofOfAddress")}
                      />
                    ) : null}
                    {fieldErrors.proofOfAddress && (
                      <p className="mt-1 text-xs text-red-600">Please upload proof of address</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Proof of Business Formation */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                      <SecurityIconOutline size={32} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Proof of Business Formation</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Upload the required documents for your{" "}
                      {formData.businessType === "llc_corporation" ? "LLC/Corporation" : "Sole Proprietorship"}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Certificate of Incorporation/CAC <span className="text-red-500">*</span>
                      </label>
                      {!formData.certificateOfIncorporation ? (
                        <div className="flex w-full items-center justify-center">
                          <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pb-6 pt-5">
                              <svg
                                className="mb-4 h-8 w-8 text-gray-500"
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
                              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*,.pdf"
                              onChange={(e) => handleFileChange(e, "certificateOfIncorporation")}
                            />
                          </label>
                        </div>
                      ) : null}
                      {uploadingFiles.certificateOfIncorporation ? (
                        <UploadProgress progress={uploadProgress.certificateOfIncorporation || 0} />
                      ) : formData.certificateOfIncorporation ? (
                        <UploadedFileDisplay
                          fieldName="certificateOfIncorporation"
                          fileName={formData.certificateOfIncorporation}
                          previewUrl={formData.certificateOfIncorporationPreview}
                          onDelete={() => handleFileDelete("certificateOfIncorporation")}
                        />
                      ) : null}
                      {fieldErrors.certificateOfIncorporation && (
                        <p className="mt-1 text-xs text-red-600">Please upload certificate of incorporation</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Memorandum of Association (MOA) <span className="text-red-500">*</span>
                      </label>
                      {!formData.memorandumOfAssociation ? (
                        <div className="flex w-full items-center justify-center">
                          <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pb-6 pt-5">
                              <svg
                                className="mb-4 h-8 w-8 text-gray-500"
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
                              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*,.pdf"
                              onChange={(e) => handleFileChange(e, "memorandumOfAssociation")}
                            />
                          </label>
                        </div>
                      ) : null}
                      {uploadingFiles.memorandumOfAssociation ? (
                        <UploadProgress progress={uploadProgress.memorandumOfAssociation || 0} />
                      ) : formData.memorandumOfAssociation ? (
                        <UploadedFileDisplay
                          fieldName="memorandumOfAssociation"
                          fileName={formData.memorandumOfAssociation}
                          previewUrl={formData.memorandumOfAssociationPreview}
                          onDelete={() => handleFileDelete("memorandumOfAssociation")}
                        />
                      ) : null}
                      {fieldErrors.memorandumOfAssociation && (
                        <p className="mt-1 text-xs text-red-600">Please upload memorandum of association</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        TIN or VAT Certificate <span className="text-red-500">*</span>
                      </label>
                      {!formData.tinOrVatCertificate ? (
                        <div className="flex w-full items-center justify-center">
                          <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pb-6 pt-5">
                              <svg
                                className="mb-4 h-8 w-8 text-gray-500"
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
                              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*,.pdf"
                              onChange={(e) => handleFileChange(e, "tinOrVatCertificate")}
                            />
                          </label>
                        </div>
                      ) : null}
                      {uploadingFiles.tinOrVatCertificate ? (
                        <UploadProgress progress={uploadProgress.tinOrVatCertificate || 0} />
                      ) : formData.tinOrVatCertificate ? (
                        <UploadedFileDisplay
                          fieldName="tinOrVatCertificate"
                          fileName={formData.tinOrVatCertificate}
                          previewUrl={formData.tinOrVatCertificatePreview}
                          onDelete={() => handleFileDelete("tinOrVatCertificate")}
                        />
                      ) : null}
                      {fieldErrors.tinOrVatCertificate && (
                        <p className="mt-1 text-xs text-red-600">Please upload TIN or VAT certificate</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: UBO Information (LLC/Corporation) or Representative Info (Sole Proprietorship) */}
              {currentStep === 4 && formData.businessType === "llc_corporation" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                      <UserOutlineIcon size={32} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Ultimate Beneficial Owner (UBO)</h3>
                    <p className="mt-2 text-sm text-gray-600">Provide UBO details</p>
                  </div>

                  <div className="space-y-6">
                    {/* Display UBO 1 (pre-created) */}
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-lg font-medium text-blue-900">UBO 1</h4>
                        <span className="bg-blue-100 px-2 py-1 text-xs text-blue-800">Primary UBO</span>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                          <p className="text-gray-900">{formData.ubos[0]?.fullName || "Not provided"}</p>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                          <p className="text-gray-900">{formData.ubos[0]?.email || "Not provided"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Additional UBOs */}
                    {formData.ubos.slice(1).map((ubo, index) => (
                      <div key={index} className="rounded-lg border border-gray-200 p-4">
                        <div className="mb-4 flex items-center justify-between">
                          <h4 className="text-lg font-medium text-gray-900">UBO {index + 2}</h4>
                          {formData.ubos.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeUbo(index + 1)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormInputModule
                            label="Full Name"
                            type="text"
                            value={ubo.fullName}
                            onChange={(e) => updateUbo(index, "fullName", e.target.value)}
                            placeholder="Enter full name"
                          />

                          <FormInputModule
                            label="Email Address"
                            type="email"
                            value={ubo.email}
                            onChange={(e) => updateUbo(index, "email", e.target.value)}
                            placeholder="Enter email address"
                          />

                          <FormInputModule
                            label="Phone Number"
                            type="tel"
                            value={ubo.phone}
                            onChange={(e) => updateUbo(index, "phone", e.target.value)}
                            placeholder="Enter phone number"
                          />

                          <FormInputModule
                            label="Role"
                            type="text"
                            value={ubo.role}
                            onChange={(e) => updateUbo(index, "role", e.target.value)}
                            placeholder="Enter role"
                          />
                        </div>

                        <div className="mt-4">
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Valid ID <span className="text-red-500">*</span>
                          </label>
                          {!ubo.validId ? (
                            <div className="flex w-full items-center justify-center">
                              <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                  <svg
                                    className="mb-4 h-8 w-8 text-gray-500"
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
                                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                                </div>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*,.pdf"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      const imageUrl = URL.createObjectURL(file)
                                      updateUbo(index, "validId", file.name)
                                      updateUbo(index, "validIdPreview", imageUrl)
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          ) : null}
                          {ubo.validId && (
                            <UploadedFileDisplay
                              fieldName={`ubo_${index}_validId`}
                              fileName={ubo.validId}
                              previewUrl={ubo.validIdPreview}
                              onDelete={() => {
                                updateUbo(index, "validId", "")
                                updateUbo(index, "validIdPreview", "")
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addUbo}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-4 text-gray-600 hover:border-gray-400 hover:text-gray-800"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add another UBO
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && formData.businessType === "sole_proprietorship" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                      <UserOutlineIcon size={32} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Representative Information</h3>
                    <p className="mt-2 text-sm text-gray-600">Provide representative details</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormInputModule
                        label="Full Name"
                        type="text"
                        name="representativeFullName"
                        value={formData.representativeFullName}
                        onChange={handleInputChange}
                        placeholder="Enter representative full name"
                        required
                        error={fieldErrors.representativeFullName}
                      />

                      <FormInputModule
                        label="Email Address"
                        type="email"
                        name="representativeEmail"
                        value={formData.representativeEmail}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        required
                        error={fieldErrors.representativeEmail}
                      />

                      <FormInputModule
                        label="Phone Number"
                        type="tel"
                        name="representativePhone"
                        value={formData.representativePhone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        required
                        error={fieldErrors.representativePhone}
                      />

                      <FormInputModule
                        label="Role"
                        type="text"
                        name="representativeRole"
                        value={formData.representativeRole}
                        onChange={handleInputChange}
                        placeholder="Enter role"
                        required
                        error={fieldErrors.representativeRole}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Valid ID <span className="text-red-500">*</span>
                      </label>
                      {!formData.representativeValidId ? (
                        <div className="flex w-full items-center justify-center">
                          <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pb-6 pt-5">
                              <svg
                                className="mb-4 h-8 w-8 text-gray-500"
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
                              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*,.pdf"
                              onChange={(e) => handleFileChange(e, "representativeValidId")}
                            />
                          </label>
                        </div>
                      ) : null}
                      {formData.representativeValidId && (
                        <UploadedFileDisplay
                          fieldName="representativeValidId"
                          fileName={formData.representativeValidId}
                          previewUrl={formData.representativeValidIdPreview}
                          onDelete={() => handleFileDelete("representativeValidId")}
                        />
                      )}
                      {fieldErrors.representativeValidId && (
                        <p className="mt-1 text-xs text-red-600">Please upload valid ID</p>
                      )}
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
              <div className="flex w-full justify-between space-x-4 pt-4">
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
                    <ButtonModule
                      icon={<VscArrowRight />}
                      iconPosition="end"
                      type="button"
                      variant="primary"
                      onClick={nextStep}
                      className="py-3"
                    >
                      Next
                    </ButtonModule>
                  </>
                )}

                {currentStep === 4 && formData.businessType === "llc_corporation" && (
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

                {currentStep === 4 && formData.businessType === "sole_proprietorship" && (
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

      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => {
          setShowVerificationModal(false)
          router.push("/dashboard")
        }}
      />
    </div>
  )
}

export default BusinessInformation
