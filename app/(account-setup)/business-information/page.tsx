"use client"
import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { ButtonModule } from "components/ui/Button/Button"
import { FormInputModule as BasicFormInput } from "components/ui/Input/Input"
import { FormInputModule } from "components/ui/Input/EmailInput"

import { motion } from "framer-motion"
import { FormSelectModule } from "components/ui/Input/FormSelectModule"
import { EmailIconOutline, MapIconOutline, SecurityIconOutline, UserOutlineIcon } from "components/Icons/LogoIcons"
import { VscArrowLeft, VscArrowRight } from "react-icons/vsc"
import VerificationModal from "components/ui/Modal/verification-modal"
import {
  addBusinessAddress,
  addBusinessFormation,
  addBusinessInfo,
  addRepresentativeInfo,
  clearAddBusinessAddressStatus,
  clearAddBusinessFormationStatus,
  clearAddBusinessInfoStatus,
  clearAddRepresentativeInfoStatus,
  clearUploadBusinessLogoStatus,
  uploadBusinessLogo,
} from "lib/redux/businessInfoSlice"
import { fetchKycStatus } from "lib/redux/merchantKycSlice"
import { RootState, AppDispatch } from "lib/redux/store"
import { fetchCountries } from "lib/redux/systemsSlice"
import { notify } from "components/ui/Notification/Notification"
import { UploadedFilePreview } from "components/ui/FilePreview/UploadedFilePreview"
import { uploadToCloudinary } from "lib/config/cloudinary"

interface Testimonial {
  id: number
  image: string
  quote: string
  name: string
  title: string
  company: string
}

const BusinessInformation: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    isAddingBusinessInfo,
    addBusinessInfoSuccess,
    addBusinessInfoError,
    businessInfoData,
    businessInfoMessage,
    isAddingBusinessAddress,
    addBusinessAddressSuccess,
    addBusinessAddressError,
    businessAddressMessage,
    isAddingBusinessFormation,
    addBusinessFormationSuccess,
    addBusinessFormationError,
    businessFormationMessage,
    isUploadingBusinessLogo,
    uploadBusinessLogoSuccess,
    uploadBusinessLogoError,
    businessLogoData,
    businessLogoMessage,
    isAddingRepresentativeInfo,
    addRepresentativeInfoSuccess,
    addRepresentativeInfoError,
    representativeInfoData,
    representativeInfoMessage,
  } = useSelector((state: RootState) => state.businessInfo)
  const { countries, loading: isLoadingSystems } = useSelector((state: RootState) => state.systems)
  const { kycStatus } = useSelector((state: RootState) => state.merchantKyc)

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

  // Fetch countries on component mount
  useEffect(() => {
    dispatch(fetchCountries())
  }, [dispatch])

  // Fetch KYC status on component mount and determine appropriate step
  useEffect(() => {
    dispatch(fetchKycStatus())
  }, [dispatch])

  // Handle KYC status response and set appropriate step
  useEffect(() => {
    if (kycStatus && kycStatus.onboarding) {
      const { onboarding } = kycStatus

      // If business info is completed, go to next step
      if (onboarding.isBusinessOrProfessionalInfoCompleted) {
        // If business address is also completed, go to formation step
        if (onboarding.isBusinessAddressCompleted) {
          setCurrentStep(4) // Business Formation step
        } else {
          setCurrentStep(3) // Business Address step
        }
      } else {
        // Business info not completed, check if logo is uploaded
        if (onboarding.isLogoUploaded) {
          setCurrentStep(2) // Business Info step (logo done)
        } else {
          setCurrentStep(1) // Logo step
        }
      }
    }
  }, [kycStatus])

  // Transform API countries data to format needed by FormSelectModule
  const countriesOptions =
    countries?.map((country: any) => ({
      value: country.id,
      label: country.name,
      icon: country.flag || undefined,
      iconType: "svg" as const,
    })) || []

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
    // Step 1: Business Logo
    businessLogo: "" as string | File,
    businessLogoPreview: "",

    // Step 2: Basic Business Information
    registeredBusinessName: "",
    businessEmail: "",
    businessType: "",
    businessCategory: "",

    // Step 3: Business Address
    nationality: "",
    businessFullAddress: "",
    city: "",
    proofOfAddress: null as File | null,
    proofOfAddressPreview: "",

    // Step 4: Proof of Business Formation
    certificateOfIncorporation: "" as string | File,
    certificateOfIncorporationPreview: "",
    memorandumOfAssociation: "" as string | File,
    memorandumOfAssociationPreview: "",
    tinOrVatCertificate: "" as string | File,
    tinOrVatCertificatePreview: "",

    // Step 5: UBO Information (for LLC/Corporation only)
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

    // Step 5: Representative Info (for Sole Proprietorship only)
    representativeFirstName: "",
    representativeLastName: "",
    representativeEmail: "",
    representativePhone: "",
    representativeRole: "",
    representativeValidId: "" as string | File,
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

  // Handle business logo upload API response
  useEffect(() => {
    if (uploadBusinessLogoSuccess && businessLogoMessage) {
      // Show success notification using the API message
      notify("success", businessLogoMessage, {
        title: "Business Logo",
        duration: 3000,
      })

      // Move to next step after a short delay
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 1000)
    }

    if (uploadBusinessLogoError) {
      // Show error notification
      notify("error", uploadBusinessLogoError, {
        title: "Business Logo Error",
        duration: 5000,
      })
    }
  }, [uploadBusinessLogoSuccess, businessLogoMessage, uploadBusinessLogoError])

  // Handle business info API response
  useEffect(() => {
    if (addBusinessInfoSuccess && businessInfoMessage) {
      // Show success notification using the API message
      notify("success", businessInfoMessage, {
        title: "Business Information",
        duration: 3000,
      })

      // Move to next step after a short delay
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 1000)
    }

    if (addBusinessInfoError) {
      // Show error notification
      notify("error", addBusinessInfoError, {
        title: "Business Information Error",
        duration: 5000,
      })
    }
  }, [addBusinessInfoSuccess, businessInfoMessage, addBusinessInfoError])

  // Handle business address API response
  useEffect(() => {
    if (addBusinessAddressSuccess && businessAddressMessage) {
      // Show success notification using the API message
      notify("success", businessAddressMessage, {
        title: "Business Address",
        duration: 3000,
      })

      // Move to next step after a short delay
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 1000)
    }

    if (addBusinessAddressError) {
      // Show error notification
      notify("error", addBusinessAddressError, {
        title: "Business Address Error",
        duration: 5000,
      })
    }
  }, [addBusinessAddressSuccess, businessAddressMessage, addBusinessAddressError])

  // Handle business formation API response
  useEffect(() => {
    if (addBusinessFormationSuccess && businessFormationMessage) {
      // Show success notification using the API message
      notify("success", businessFormationMessage, {
        title: "Business Formation",
        duration: 3000,
      })

      // For Sole Proprietorship, show verification modal since this is the final step
      if (formData.businessType === "sole_proprietorship") {
        setTimeout(() => {
          setShowVerificationModal(true)
        }, 1000)
      } else {
        // For LLC/Corporation, move to next step (UBO info)
        setTimeout(() => {
          setCurrentStep((prev) => prev + 1)
        }, 1000)
      }
    }

    if (addBusinessFormationError) {
      // Show error notification
      notify("error", addBusinessFormationError, {
        title: "Business Formation Error",
        duration: 5000,
      })
    }
  }, [addBusinessFormationSuccess, businessFormationMessage, addBusinessFormationError, formData.businessType])

  // Handle representative info API response
  useEffect(() => {
    if (addRepresentativeInfoSuccess && representativeInfoMessage) {
      // Show success notification using the API message
      notify("success", representativeInfoMessage, {
        title: "Representative Information",
        duration: 3000,
      })

      // Show verification modal since this is the final step for LLC/Corporation
      setTimeout(() => {
        setShowVerificationModal(true)
      }, 1000)
    }

    if (addRepresentativeInfoError) {
      // Show error notification
      notify("error", addRepresentativeInfoError, {
        title: "Representative Information Error",
        duration: 5000,
      })
    }
  }, [addRepresentativeInfoSuccess, representativeInfoMessage, addRepresentativeInfoError])

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
      // Store both the file object and the preview URL
      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
        [`${fieldName}Preview`]: imageUrl,
      }))
      setUploadProgress((prev) => ({ ...prev, [fieldName]: 0 }))
    })
  }

  const handleFileDelete = (fieldName: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: null,
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
    const { businessLogo } = formData
    const errors: Record<string, boolean> = {}

    if (!businessLogo) errors.businessLogo = true

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setFormError("Please upload your business logo")
      return false
    }

    setFieldErrors({})
    return true
  }

  const validateStep2 = () => {
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

  const validateStep3 = () => {
    const { nationality, businessFullAddress, city, proofOfAddress } = formData
    const errors: Record<string, boolean> = {}

    if (!nationality.toString().trim()) errors.nationality = true
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

  const validateStep4 = () => {
    const { certificateOfIncorporation, memorandumOfAssociation, businessType } = formData
    const errors: Record<string, boolean> = {}

    // For LLC/Corporation, require corporation documents
    if (businessType === "llc_corporation") {
      if (!certificateOfIncorporation) errors.certificateOfIncorporation = true
      if (!memorandumOfAssociation) errors.memorandumOfAssociation = true

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors)
        setFormError("Please upload all required documents for LLC/Corporation")
        return false
      }
    }
    // For Sole Proprietorship, no corporation documents required - validation passes

    setFieldErrors({})
    return true
  }

  const validateStep5 = () => {
    const errors: Record<string, boolean> = {}

    // For LLC/Corporation, representative information is required
    if (formData.businessType === "llc_corporation") {
      if (!formData.representativeFirstName.trim()) errors.representativeFirstName = true
      if (!formData.representativeLastName.trim()) errors.representativeLastName = true
      if (!formData.representativeEmail.trim()) errors.representativeEmail = true
      if (!formData.representativePhone.trim()) errors.representativePhone = true
      if (!formData.representativeRole.trim()) errors.representativeRole = true

      // Validate email format
      if (formData.representativeEmail.trim() && !/^\S+@\S+\.\S+$/.test(formData.representativeEmail)) {
        errors.representativeEmail = true
      }

      if (Object.keys(errors).length > 0) {
        setFormError("Please complete all required representative information fields")
        return false
      }
    }

    // For Sole Proprietorship, representative info is optional
    // (validation handled in step 4 for sole proprietorship)

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Navigation functions
  const nextStep = () => {
    setFormError(null)

    if (currentStep === 1) {
      if (!validateStep1()) return

      // Call business logo upload API when moving from step 1
      dispatch(clearUploadBusinessLogoStatus())

      const submitBusinessLogo = async () => {
        try {
          if (!formData.businessLogo) {
            throw new Error("Business logo is required")
          }

          let logoUrl: string

          // If businessLogo is a File object, upload to Cloudinary first
          if (formData.businessLogo instanceof File) {
            const uploadResult = await uploadToCloudinary(formData.businessLogo, "business-logo")
            logoUrl = uploadResult.secure_url
          } else {
            logoUrl = formData.businessLogo
          }

          dispatch(
            uploadBusinessLogo({
              logo: logoUrl,
            })
          )
        } catch (error) {
          console.error("Error uploading business logo:", error)
          notify("error", "Failed to upload business logo", {
            title: "Upload Error",
            duration: 5000,
          })
        }
      }

      submitBusinessLogo()
      return // Don't advance to next step until API call succeeds
    }

    if (currentStep === 2) {
      if (!validateStep2()) return

      // Call business info API when moving from step 2
      dispatch(clearAddBusinessInfoStatus())
      dispatch(
        addBusinessInfo({
          businessName: formData.registeredBusinessName,
          businessEmail: formData.businessEmail,
          businessType: formData.businessType,
          businessCategory: formData.businessCategory,
        })
      )
      return // Don't advance to next step until API call succeeds
    }

    if (currentStep === 3) {
      if (!validateStep3()) return

      // Call business address API when moving from step 3
      dispatch(clearAddBusinessAddressStatus())

      // Upload proof of address to Cloudinary first, then submit address
      const submitBusinessAddress = async () => {
        try {
          if (!formData.proofOfAddress) {
            throw new Error("Proof of address is required")
          }

          let proofOfAddressUrl: string

          // If proofOfAddress is a File object (not already a URL), upload to Cloudinary
          if (formData.proofOfAddress instanceof File) {
            const uploadResult = await uploadToCloudinary(formData.proofOfAddress, "proof-of-address")
            proofOfAddressUrl = uploadResult.secure_url
          } else {
            proofOfAddressUrl = formData.proofOfAddress
          }

          dispatch(
            addBusinessAddress({
              countryId: parseInt(formData.nationality.toString()),
              address: formData.businessFullAddress,
              city: formData.city,
              proofOfAddress: proofOfAddressUrl,
            })
          )
        } catch (error) {
          console.error("Error uploading proof of address:", error)
          notify("error", "Failed to upload proof of address", {
            title: "Upload Error",
            duration: 5000,
          })
        }
      }

      submitBusinessAddress()
      return // Don't advance to next step until API call succeeds
    }

    if (currentStep === 4) {
      if (!validateStep4()) return

      // Call business formation API when moving from step 4
      dispatch(clearAddBusinessFormationStatus())

      // Upload business formation documents to Cloudinary first, then submit formation
      const submitBusinessFormation = async () => {
        try {
          // For LLC/Corporation, require certificate of incorporation and memorandum of association
          if (formData.businessType === "llc_corporation") {
            if (!formData.certificateOfIncorporation) {
              throw new Error("Certificate of incorporation is required")
            }
            if (!formData.memorandumOfAssociation) {
              throw new Error("Memorandum of association is required")
            }
          } else if (formData.businessType === "sole_proprietorship") {
            // For Sole Proprietorship, only require TIN/VAT certificate if provided
            // No corporation documents needed
          }

          let certificateOfIncorporationUrl: string = ""
          let memorandumOfAssociationUrl: string = ""
          let statusReportUrl: string = ""

          // For LLC/Corporation, upload corporation documents
          if (formData.businessType === "llc_corporation") {
            // Upload certificate of incorporation
            if (formData.certificateOfIncorporation instanceof File) {
              const uploadResult = await uploadToCloudinary(
                formData.certificateOfIncorporation,
                "certificate-of-incorporation"
              )
              certificateOfIncorporationUrl = uploadResult.secure_url
            } else {
              certificateOfIncorporationUrl = formData.certificateOfIncorporation
            }

            // Upload memorandum of association
            if (formData.memorandumOfAssociation instanceof File) {
              const uploadResult = await uploadToCloudinary(
                formData.memorandumOfAssociation,
                "memorandum-of-association"
              )
              memorandumOfAssociationUrl = uploadResult.secure_url
            } else {
              memorandumOfAssociationUrl = formData.memorandumOfAssociation
            }
          }

          // Upload TIN/VAT certificate (optional for both business types)
          if (formData.tinOrVatCertificate) {
            if (formData.tinOrVatCertificate instanceof File) {
              const uploadResult = await uploadToCloudinary(formData.tinOrVatCertificate, "tin-vat-certificate")
              statusReportUrl = uploadResult.secure_url
            } else {
              statusReportUrl = formData.tinOrVatCertificate
            }
          }

          // Prepare formation data based on business type
          const formationData: any = {}

          if (formData.businessType === "llc_corporation") {
            formationData.certificateOfIncorporation = certificateOfIncorporationUrl
            formationData.memorandumOfAssociation = memorandumOfAssociationUrl
            if (statusReportUrl) formationData.statusReport = statusReportUrl
          } else if (formData.businessType === "sole_proprietorship") {
            // For Sole Proprietorship, send all uploaded documents
            if (certificateOfIncorporationUrl) formationData.certificateOfIncorporation = certificateOfIncorporationUrl
            if (memorandumOfAssociationUrl) formationData.memorandumOfAssociation = memorandumOfAssociationUrl
            if (statusReportUrl) formationData.statusReport = statusReportUrl
          }

          dispatch(addBusinessFormation(formationData))
        } catch (error) {
          console.error("Error uploading business formation documents:", error)
          notify("error", "Failed to upload business formation documents", {
            title: "Upload Error",
            duration: 5000,
          })
        }
      }

      submitBusinessFormation()
      return // Don't advance to next step until API call succeeds
    }

    if (currentStep === 5 && formData.businessType === "llc_corporation") {
      if (!validateStep5()) return

      console.log("Submitting representative info for LLC/Corporation...")

      // Call representative info API when moving from step 5 (LLC/Corporation)
      dispatch(clearAddRepresentativeInfoStatus())

      // Use separate first and last name fields
      const firstName = formData.representativeFirstName.trim()
      const lastName = formData.representativeLastName.trim()

      console.log("Representative data:", {
        firstName,
        lastName,
        email: formData.representativeEmail,
        phoneNumber: formData.representativePhone,
        position: formData.representativeRole,
      })

      dispatch(
        addRepresentativeInfo({
          firstName,
          lastName,
          email: formData.representativeEmail,
          phoneNumber: formData.representativePhone,
          position: formData.representativeRole,
        })
      )

      return // Don't advance to next step until API call succeeds
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

    // For Sole Proprietorship, this is the final submission (step 4)
    if (formData.businessType === "sole_proprietorship") {
      if (!validateStep4()) return

      // Call business formation API for Sole Proprietorship
      dispatch(clearAddBusinessFormationStatus())

      // Upload business formation documents to Cloudinary first, then submit formation
      const submitBusinessFormation = async () => {
        try {
          let certificateOfIncorporationUrl: string = ""
          let memorandumOfAssociationUrl: string = ""
          let statusReportUrl: string = ""

          // Upload certificate of incorporation if provided
          if (formData.certificateOfIncorporation && formData.certificateOfIncorporation instanceof File) {
            const uploadResult = await uploadToCloudinary(
              formData.certificateOfIncorporation,
              "certificate-of-incorporation"
            )
            certificateOfIncorporationUrl = uploadResult.secure_url
          }

          // Upload memorandum of association if provided
          if (formData.memorandumOfAssociation && formData.memorandumOfAssociation instanceof File) {
            const uploadResult = await uploadToCloudinary(formData.memorandumOfAssociation, "memorandum-of-association")
            memorandumOfAssociationUrl = uploadResult.secure_url
          }

          // Upload TIN/VAT certificate if provided
          if (formData.tinOrVatCertificate && formData.tinOrVatCertificate instanceof File) {
            const uploadResult = await uploadToCloudinary(formData.tinOrVatCertificate, "tin-vat-certificate")
            statusReportUrl = uploadResult.secure_url
          }

          // Prepare formation data based on business type
          const formationData: any = {}

          if (formData.businessType === "llc_corporation") {
            formationData.certificateOfIncorporation = certificateOfIncorporationUrl
            formationData.memorandumOfAssociation = memorandumOfAssociationUrl
            if (statusReportUrl) formationData.statusReport = statusReportUrl
          } else if (formData.businessType === "sole_proprietorship") {
            // For Sole Proprietorship, send all uploaded documents
            if (certificateOfIncorporationUrl) formationData.certificateOfIncorporation = certificateOfIncorporationUrl
            if (memorandumOfAssociationUrl) formationData.memorandumOfAssociation = memorandumOfAssociationUrl
            if (statusReportUrl) formationData.statusReport = statusReportUrl
          }

          dispatch(addBusinessFormation(formationData))
        } catch (error) {
          console.error("Error uploading business formation documents:", error)
          notify("error", "Failed to upload business formation documents", {
            title: "Upload Error",
            duration: 5000,
          })
        }
      }

      submitBusinessFormation()
      return // Don't show modal until API call succeeds
    }

    // For LLC/Corporation, validate step 5
    if (!validateStep5()) return

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
    const totalSteps = formData.businessType === "sole_proprietorship" ? 4 : 5
    const stepLabels =
      formData.businessType === "llc_corporation"
        ? ["Business Logo", "Business Info", "Business Address", "Business Formation", "Representative Info"]
        : formData.businessType === "sole_proprietorship"
        ? ["Business Logo", "Business Info", "Business Address", "Business Formation"]
        : ["Business Logo", "Business Info", "Business Address", "Business Formation", "Representative Info"]

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
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
    fileName: string | File
    previewUrl: string
    onDelete: () => void
  }) => {
    const fileNameStr = typeof fileName === "string" ? fileName : fileName.name
    const isImage =
      previewUrl &&
      (fileNameStr.toLowerCase().endsWith(".jpg") ||
        fileNameStr.toLowerCase().endsWith(".jpeg") ||
        fileNameStr.toLowerCase().endsWith(".png"))

    return (
      <div className="mt-4">
        <div className="relative rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {isImage ? (
                  <img
                    src={previewUrl}
                    alt={fileNameStr}
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
                <p className="truncate text-sm font-medium text-gray-900">{fileNameStr}</p>
                <p className="mt-1 text-xs text-green-600">✓ Uploaded successfully</p>
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

  return (
    <div className="relative flex min-h-screen grid-cols-1 bg-gradient-to-br from-[#ffffff]">
      {/* Logo with full-width border */}
      <div className="fixed left-0 right-0 top-0 z-50 w-screen border-b border-gray-200 bg-white py-4">
        <div className="container mx-auto w-full px-4">
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="cursor-pointer transition-opacity hover:opacity-80"
            >
              <Image src="/ultra-pay/logo.png" alt="Logo" width={155} height={100} />
            </button>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="container mx-auto flex w-full flex-col items-center justify-center px-4 py-8">
        <motion.main
          className="flex w-full max-w-4xl flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-3xl   p-4  md:p-8"
          >
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-900"
                >
                  <VscArrowLeft />
                  Back Home
                </button>
                <h1 className="text-center text-3xl font-bold text-[#1447E6]">Business Information</h1>
                <div className="w-16"></div>
              </div>
            </div>

            <StepProgress />

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Business Logo */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="mb-2 text-lg font-semibold text-gray-900">Business Logo</h2>
                    <p className="mb-4 text-sm text-gray-600">
                      Upload your business logo to complete your brand identity. This will be displayed on your profile
                      and communications.
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <div className="relative">
                      {formData.businessLogoPreview ? (
                        <div className="relative">
                          <img
                            src={formData.businessLogoPreview}
                            alt="Business logo preview"
                            className="mx-auto size-32 rounded-lg object-cover shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleFileDelete("businessLogo")}
                            className="absolute right-0 top-0 rounded-full bg-red-500 p-1 text-white shadow-lg transition-colors hover:bg-red-600"
                          >
                            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="flex size-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                          <svg className="size-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="relative">
                      <input
                        type="file"
                        id="businessLogo"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "businessLogo")}
                        className="sr-only"
                      />
                      <label
                        htmlFor="businessLogo"
                        className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        {formData.businessLogoPreview ? "Change Logo" : "Upload Logo"}
                      </label>
                    </div>
                  </div>

                  {uploadingFiles.businessLogo && <UploadProgress progress={uploadProgress.businessLogo || 0} />}

                  {fieldErrors.businessLogo && (
                    <p className="text-center text-sm text-red-600">Please upload your business logo</p>
                  )}

                  <div className="rounded-lg bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="size-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Logo Requirements</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <ul className="list-disc space-y-1 pl-5">
                            <li>Minimum size: 200x200 pixels</li>
                            <li>Maximum file size: 5MB</li>
                            <li>Supported formats: PNG, JPG, JPEG, SVG</li>
                            <li>High resolution recommended for best quality</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Basic Business Information */}
              {currentStep === 2 && (
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

              {/* Step 3: Business Address */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100">
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
                    options={countriesOptions}
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

                  <FormInputModule
                    label="City"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    required
                    error={fieldErrors.city}
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
                        fileName={formData.proofOfAddress.name}
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

              {/* Step 4: Proof of Business Formation */}
              {currentStep === 4 && (
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
                        Status report <span className="text-red-500">*</span>
                      </label>
                      {!formData.tinOrVatCertificate ? (
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
                        <p className="mt-1 text-xs text-red-600">Please upload Status report certificate</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Representative Information (LLC/Corporation) */}
              {currentStep === 5 && formData.businessType === "llc_corporation" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100">
                      <UserOutlineIcon size={32} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Business Representative</h3>
                    <p className="mt-2 text-sm text-gray-600">Provide business representative details</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormInputModule
                        label="First Name"
                        type="text"
                        name="representativeFirstName"
                        placeholder="Enter first name"
                        value={formData.representativeFirstName}
                        onChange={handleInputChange}
                        IconComponent={(iconProps) => <UserOutlineIcon size={18} {...iconProps} />}
                        required
                        error={fieldErrors.representativeFirstName}
                      />

                      <FormInputModule
                        label="Last Name"
                        type="text"
                        name="representativeLastName"
                        placeholder="Enter last name"
                        value={formData.representativeLastName}
                        onChange={handleInputChange}
                        IconComponent={(iconProps) => <UserOutlineIcon size={18} {...iconProps} />}
                        required
                        error={fieldErrors.representativeLastName}
                      />

                      <FormInputModule
                        label="Email Address"
                        type="email"
                        name="representativeEmail"
                        placeholder="Enter email address"
                        value={formData.representativeEmail}
                        onChange={handleInputChange}
                        IconComponent={(iconProps) => <EmailIconOutline size={18} {...iconProps} />}
                        required
                        error={fieldErrors.representativeEmail}
                      />

                      <FormInputModule
                        label="Phone Number"
                        type="tel"
                        name="representativePhone"
                        placeholder="Enter phone number"
                        value={formData.representativePhone}
                        onChange={handleInputChange}
                        IconComponent={(iconProps) => <UserOutlineIcon size={18} {...iconProps} />}
                        required
                        error={fieldErrors.representativePhone}
                      />
                    </div>

                    <FormInputModule
                      label="Position/Role"
                      type="text"
                      name="representativeRole"
                      placeholder="Enter position or role (e.g., Director, Manager, etc.)"
                      value={formData.representativeRole}
                      onChange={handleInputChange}
                      IconComponent={(iconProps) => <UserOutlineIcon size={18} {...iconProps} />}
                      required
                      error={fieldErrors.representativeRole}
                    />
                  </div>

                  <div className="rounded-lg bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="size-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Representative Information</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p className="mb-1">
                            The business representative will be the primary contact person for your business account.
                          </p>
                          <ul className="list-disc space-y-1 pl-5">
                            <li>Must be authorized to act on behalf of the business</li>
                            <li>Will receive important communications and notifications</li>
                            <li>Valid ID document is required for verification</li>
                          </ul>
                        </div>
                      </div>
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
                    disabled={isUploadingBusinessLogo}
                    className="w-full py-3"
                  >
                    {isUploadingBusinessLogo ? "Uploading..." : "Continue"}
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
                      disabled={isAddingBusinessInfo}
                      className="py-3"
                    >
                      {isAddingBusinessInfo ? "Saving..." : "Continue"}
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
                      disabled={isAddingBusinessAddress}
                      className="py-3"
                    >
                      {isAddingBusinessAddress ? "Saving..." : "Verify"}
                    </ButtonModule>
                  </>
                )}

                {currentStep === 4 && (
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
                    {formData.businessType === "sole_proprietorship" ? (
                      <ButtonModule type="submit" variant="primary" disabled={loading} className="py-3">
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <span className="ml-2">Creating Account...</span>
                          </div>
                        ) : (
                          "Create Profile"
                        )}
                      </ButtonModule>
                    ) : (
                      <ButtonModule
                        icon={<VscArrowRight />}
                        iconPosition="end"
                        type="button"
                        variant="primary"
                        onClick={nextStep}
                        disabled={isAddingBusinessFormation}
                        className="py-3"
                      >
                        {isAddingBusinessFormation ? "Saving..." : "Next"}
                      </ButtonModule>
                    )}
                  </>
                )}

                {currentStep === 5 && formData.businessType === "llc_corporation" && (
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
                      disabled={isAddingRepresentativeInfo}
                      className="py-3"
                    >
                      {isAddingRepresentativeInfo ? (
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
