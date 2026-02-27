"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { ButtonModule } from "components/ui/Button/Button"
import { FormInputModule as BasicFormInput } from "components/ui/Input/Input"
import { motion } from "framer-motion"
import { FormSelectModule } from "components/ui/Input/FormSelectModule"
import { HousesOutlineIcon, SecurityIconOutline } from "components/Icons/LogoIcons"
import { VscArrowLeft, VscArrowRight } from "react-icons/vsc"
import { notify } from "components/ui/Notification/Notification"
import {
  clearAddBankStatus,
  clearAddBvnStatus,
  addSettlementBankAccount,
  addSettlementBankBvn,
} from "lib/redux/settlementBankSlice"
import { RootState, AppDispatch } from "lib/redux/store"

const AddSettlementBank: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { isAddingBvn, addBvnSuccess, bvnData, addBvnError, isAddingBank, addBankSuccess, bankData, addBankError } =
    useSelector((state: RootState) => state.settlementBank)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false) // For final submission only
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})
  const router = useRouter()

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: BVN Verification
    bvn: "",
    bvnVerified: false,
    bvnData: null as { fullName: string; bvnVerifiedAt: string; bvn: string } | null,

    // Step 2: Bank Account Details
    accountName: "",
    accountNumber: "",
    bankName: "",
    bankCode: "",
  })

  const bankOptions = [
    { value: "001", label: "Access Bank" },
    { value: "002", label: "Citibank" },
    { value: "003", label: "Diamond Bank" },
    { value: "004", label: "Ecobank Nigeria" },
    { value: "005", label: "Fidelity Bank" },
    { value: "006", label: "First Bank" },
    { value: "007", label: "FCMB" },
    { value: "008", label: "Guaranty Trust Bank" },
    { value: "009", label: "Heritage Bank" },
    { value: "010", label: "Keystone Bank" },
    { value: "011", label: "Providus Bank" },
    { value: "012", label: "Stanbic IBTC" },
    { value: "013", label: "Standard Chartered" },
    { value: "014", label: "Sterling Bank" },
    { value: "015", label: "Union Bank" },
    { value: "016", label: "United Bank for Africa" },
    { value: "017", label: "Unity Bank" },
    { value: "018", label: "Wema Bank" },
    { value: "019", label: "Zenith Bank" },
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

    // Auto-fill bank name when bank is selected
    if (name === "bankCode") {
      setFormData((prev) => ({
        ...prev,
        bankName: bankOptions.find((bank) => bank.value === value)?.label || "",
      }))
    }
  }

  // BVN verification function
  const verifyBVN = async () => {
    if (!formData.bvn.trim() || formData.bvn.length !== 11) {
      setFormError("Please enter a valid 11-digit BVN number")
      return
    }

    dispatch(clearAddBvnStatus())
    dispatch(addSettlementBankBvn({ bvn: formData.bvn }))
  }

  // Handle BVN verification response
  useEffect(() => {
    if (addBvnSuccess && bvnData) {
      setFormData((prev) => ({
        ...prev,
        bvnVerified: true,
        bvnData: {
          fullName: "Cray Ibra", // Default name for BVN verification
          bvnVerifiedAt: bvnData.bvnVerifiedAt,
          bvn: bvnData.bvn,
        },
        accountName: "Cray Ibra", // Auto-fill with default name
      }))
      setFormError("BVN verified successfully ✓")
      setTimeout(() => setFormError(null), 3000)
    }

    if (addBvnError) {
      setFormError(addBvnError)
    }
  }, [addBvnSuccess, bvnData, addBvnError])

  // Handle bank account addition response
  useEffect(() => {
    if (addBankSuccess && bankData) {
      // Show success notification
      notify("success", "Account successfully added", {
        title: "Settlement bank account added successfully",
        duration: 3000,
      })

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    }

    if (addBankError) {
      setFormError(addBankError)
    }
  }, [addBankSuccess, bankData, addBankError, router])

  // Validation functions for each step
  const validateStep1 = () => {
    const { bvn, bvnVerified } = formData
    const errors: Record<string, boolean> = {}

    if (!bvn.trim()) errors.bvn = true
    if (!bvnVerified) errors.bvnVerified = true

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setFormError("Please verify your BVN to continue")
      return false
    }

    if (!/^\d{11}$/.test(bvn.replace(/\D/g, ""))) {
      setFieldErrors({ bvn: true })
      setFormError("BVN must be 11 digits")
      return false
    }

    setFieldErrors({})
    return true
  }

  const validateStep2 = () => {
    const { accountName, accountNumber, bankCode } = formData
    const errors: Record<string, boolean> = {}

    if (!accountName.trim()) errors.accountName = true
    if (!accountNumber.trim()) errors.accountNumber = true
    if (!bankCode.trim()) errors.bankCode = true

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setFormError("Please fill in all bank account details")
      return false
    }

    if (!/^\d{10}$/.test(accountNumber.replace(/\D/g, ""))) {
      setFieldErrors({ accountNumber: true })
      setFormError("Account number must be 10 digits")
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

    if (!validateStep2()) return

    dispatch(clearAddBankStatus())
    dispatch(
      addSettlementBankAccount({
        bankCode: formData.bankCode,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountName: formData.accountName,
      })
    )
  }

  // Step progress component
  const StepProgress = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2].map((step) => (
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
                    {step === 1 && <SecurityIconOutline size={14} />}
                    {step === 2 && <HousesOutlineIcon size={14} />}
                  </>
                )}
              </div>
              <span className={`mt-2 text-xs font-medium ${step === currentStep ? "text-[#1447E6]" : "text-gray-500"}`}>
                {step === 1 && "BVN Verification"}
                {step === 2 && "Bank Account Details"}
              </span>
            </div>
            {step < 2 && <div className={`mx-4 h-0.5 flex-1 ${step < currentStep ? "bg-[#1447E6]" : "bg-gray-300"}`} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  )

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
            <div className="mb-10">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  <VscArrowLeft />
                  Go Back
                </button>
                <h1 className="text-3xl font-bold text-[#1447E6]">Add Settlement Bank</h1>
                <div className="w-16"></div>
              </div>
            </div>

            <StepProgress />

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: BVN Verification */}
              {currentStep === 1 && (
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
                    <h3 className="text-xl font-semibold text-gray-900">BVN Verification</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Enter your 11-digit Bank Verification Number to verify your identity
                    </p>
                  </div>

                  <div className="space-y-4">
                    <BasicFormInput
                      label="Bank Verification Number (BVN)"
                      type="text"
                      name="bvn"
                      placeholder="Enter your 11-digit BVN"
                      value={formData.bvn}
                      onChange={handleInputChange}
                      maxLength={11}
                      required
                      error={fieldErrors.bvn}
                    />
                    <p className="text-sm text-gray-400">
                      Dial the USSD Code <span className="font-bold text-[#1447E6]">*565*0#</span> with the phone number
                      you registered with to check your BVN.
                    </p>

                    {formData.bvnVerified && formData.bvnData && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg border border-dashed border-green-600 bg-green-50 p-4"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <svg className="size-5  text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-green-800">BVN Verified Successfully</h4>
                            <div className="mt-2 text-sm text-green-700">
                              <p>
                                <strong>Full Name:</strong> {formData.bvnData.fullName}
                              </p>
                              <p>
                                <strong>BVN Verified At:</strong>{" "}
                                {formData.bvnData.bvnVerifiedAt
                                  ? new Date(formData.bvnData.bvnVerifiedAt).toLocaleString()
                                  : "N/A"}
                              </p>
                              <p>
                                <strong>BVN:</strong> {formData.bvnData.bvn}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Bank Account Details */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100">
                      <HousesOutlineIcon size={32} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Bank Account Details</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Enter your bank account information for settlement payments
                    </p>
                  </div>

                  <div className="space-y-4">
                    <FormSelectModule
                      label="Bank Name"
                      name="bankCode"
                      value={formData.bankCode}
                      onChange={handleInputChange}
                      options={bankOptions}
                      required
                      error={fieldErrors.bankCode}
                    />

                    <BasicFormInput
                      label="Account Name"
                      type="text"
                      name="accountName"
                      placeholder="Account name (auto-filled from BVN)"
                      value={formData.accountName}
                      onChange={handleInputChange}
                      readOnly={formData.bvnVerified}
                      required
                      error={fieldErrors.accountName}
                    />

                    <BasicFormInput
                      label="Account Number"
                      type="text"
                      name="accountNumber"
                      placeholder="Enter your 10-digit account number"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      maxLength={10}
                      required
                      error={fieldErrors.accountNumber}
                    />

                    {formData.accountNumber.length === 10 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg border border-dashed border-blue-600 bg-blue-50 p-4"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <svg className="size-5  text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-blue-800">Account Details Ready</h4>
                            <div className="mt-2 text-sm text-blue-700">
                              <p>
                                <strong>Bank:</strong> {formData.bankName || "Not selected"}
                              </p>
                              <p>
                                <strong>Account Name:</strong> {formData.accountName || "Not available"}
                              </p>
                              <p>
                                <strong>Account Number:</strong> {formData.accountNumber}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
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
                  <>
                    <ButtonModule
                      icon={<VscArrowRight />}
                      iconPosition="end"
                      type="button"
                      variant="primary"
                      onClick={formData.bvnVerified ? nextStep : verifyBVN}
                      disabled={isAddingBvn}
                      className="w-full py-3"
                    >
                      {isAddingBvn ? "Verifying..." : formData.bvnVerified ? "Continue" : "Verify BVN"}
                    </ButtonModule>
                  </>
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
                    <ButtonModule type="submit" variant="primary" disabled={isAddingBank} className="py-3">
                      {isAddingBank ? (
                        <div className="flex items-center justify-center">
                          <span className="ml-2">Adding Bank Account...</span>
                        </div>
                      ) : (
                        "Add Bank Account"
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

export default AddSettlementBank
