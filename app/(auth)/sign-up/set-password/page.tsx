"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { PasswordInputModule } from "components/ui/Input/PasswordInput"
import { ButtonModule } from "components/ui/Button/Button"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"
import { setPassword, clearSetPasswordStatus } from "lib/redux/authSlice"
import { notify } from "components/ui/Notification/Notification"
import type { AppDispatch, RootState } from "lib/redux/store"

interface Testimonial {
  id: number
  image: string
  quote: string
  name: string
  title: string
  company: string
}

const SetPassword: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch<AppDispatch>()
  const { isSettingPassword, setPasswordError, setPasswordSuccess } = useSelector((state: RootState) => state.auth)

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState<number>(0)
  const [suggested, setSuggested] = useState("")
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Get email from URL parameters
  const email = searchParams.get("email") || ""

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000) // Change testimonial every 5 seconds

    return () => clearInterval(interval)
  }, [testimonials.length])

  // Show success notification and redirect on successful password set
  useEffect(() => {
    if (setPasswordSuccess) {
      notify("success", "Password set successfully!", {
        title: "Success",
        description: "Your account has been created. Redirecting to dashboard...",
      })
      setTimeout(() => {
        router.push("/")
      }, 2000)
    }
  }, [setPasswordSuccess, router])

  // Clear status when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearSetPasswordStatus())
    }
  }, [dispatch])

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

  // Check password strength
  const checkPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    return strength
  }

  const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setNewPassword(value)
    setPasswordStrength(checkPasswordStrength(value))

    // Clear form errors when user starts typing
    if (formError) setFormError(null)
    if (setPasswordError) dispatch(clearSetPasswordStatus())
  }

  const handleSuggestPassword = () => {
    const pwd = generatePassword()
    setSuggested(pwd)
  }

  const handleUseSuggested = () => {
    if (!suggested) return
    setNewPassword(suggested)
    setConfirmPassword(suggested)
    setPasswordStrength(checkPasswordStrength(suggested))
    if (formError) setFormError(null)
  }

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value)
    if (formError) setFormError(null)
    if (setPasswordError) dispatch(clearSetPasswordStatus())
  }

  const validateForm = (): boolean => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setFormError("Please fill in all fields")
      return false
    }

    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match")
      return false
    }

    if (newPassword.length < 8) {
      setFormError("Password must be at least 8 characters long")
      return false
    }

    if (passwordStrength < 3) {
      setFormError("Please choose a stronger password")
      return false
    }

    return true
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    dispatch(clearSetPasswordStatus())

    if (!validateForm()) return

    if (!email) {
      setFormError("Email not provided. Please start the registration process again.")
      return
    }

    // Dispatch set password action
    dispatch(
      setPassword({
        email: email,
        password: newPassword,
        confirmPassword: confirmPassword,
      })
    )
  }

  const isButtonDisabled = isSettingPassword || !newPassword.trim() || !confirmPassword.trim()

  return (
    <div className="relative flex min-h-screen grid-cols-1 bg-gradient-to-br from-[#ffffff]">
      {/* Logo with full-width border */}
      <div className="absolute left-0 right-0 top-4 z-10 w-screen border-b border-gray-200 pb-4">
        <div className="container w-full px-4">
          <Image src="/ultra-pay/logo.png" alt="Logo" width={155} height={100} />
        </div>
      </div>

      {/* Form Container - Responsive */}
      <div className="relative flex min-h-screen flex-col border-r-2 border-[#ffffff80] max-md:mx-auto max-md:w-full max-md:max-w-lg md:w-[50%] lg:w-[60%] xl:w-[70%] 2xl:w-[70%]">
        {/* Centered Form Content */}
        <div className="flex flex-1 items-center justify-center py-8">
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
              className="flex w-full max-w-2xl flex-col rounded-2xl max-sm:px-4 max-sm:pt-10 sm:px-6 md:px-8 lg:justify-center lg:px-10 lg:py-8"
            >
              <div className="mb-8 border-b pb-2 sm:pb-6">
                <h1 className="text-2xl font-bold text-[#1447E6] md:text-3xl">Set Your Password</h1>
                <p className="mt-1 text-[#101836] sm:mt-2">Create a secure password for your account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <PasswordInputModule
                    label="Password"
                    placeholder="Enter your password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                  />

                  {/* Password Strength Indicator */}
                  {newPassword && (
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
                        <li className={newPassword.length >= 8 ? "text-green-600" : ""}>• At least 8 characters</li>
                        <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>• One uppercase letter</li>
                        <li className={/[a-z]/.test(newPassword) ? "text-green-600" : ""}>• One lowercase letter</li>
                        <li className={/[0-9]/.test(newPassword) ? "text-green-600" : ""}>• One number</li>
                        <li className={/[^A-Za-z0-9]/.test(newPassword) ? "text-green-600" : ""}>
                          • One special character
                        </li>
                      </ul>
                      <div className="mt-3 flex flex-col items-start justify-between gap-2 text-xs sm:flex-row sm:items-center">
                        <button
                          type="button"
                          onClick={handleSuggestPassword}
                          className="text-[#1447E6] hover:underline"
                        >
                          Suggest a strong password
                        </button>
                        {suggested && (
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <code className="max-w-[200px] break-all rounded bg-gray-100 px-2 py-1 text-gray-700 sm:max-w-none">
                              {suggested}
                            </code>
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <PasswordInputModule
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && newPassword && (
                    <p className="mt-1 text-xs text-green-600">Passwords match</p>
                  )}
                </motion.div>

                {formError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-md bg-red-50 p-3 text-sm text-red-600"
                  >
                    {formError}
                  </motion.div>
                )}

                {setPasswordError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-md bg-red-50 p-3 text-sm text-red-600"
                  >
                    {setPasswordError}
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <ButtonModule
                    type="submit"
                    variant="primary"
                    loading={isSettingPassword}
                    disabled={isButtonDisabled}
                    className="w-full"
                  >
                    {isSettingPassword ? "Setting Password..." : "Set Password"}
                  </ButtonModule>
                </motion.div>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-4 text-center max-sm:mt-4"
              >
                <p className="text-sm text-[#101836]">
                  Already have an account?{" "}
                  <Link
                    href="/"
                    className="font-medium text-[#1447E6] transition-all duration-200 ease-in-out hover:text-[#100A55]"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </motion.main>
        </div>
      </div>

      {/* Testimonial Slider Container - Responsive */}
      <div
        className="relative z-50 bg-[url('/ultra-pay/bg.png')] bg-cover bg-center bg-no-repeat max-md:hidden md:w-[50%] lg:w-[40%] xl:w-[30%] 2xl:w-[30%]"
        style={{ backgroundPosition: "center 0%" }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute right-0 top-[-5%] z-0 flex h-full"
        >
          {/* Optional background image */}
        </motion.div>

        {/* Testimonial Slider */}
        <div className="flex h-full flex-col items-center justify-between px-4 py-8">
          <AnimatePresence mode="wait">
            {/* Placeholder for testimonials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex max-w-2xl flex-col items-center text-center"
            >
              {/* Testimonial content can be added here */}
            </motion.div>
          </AnimatePresence>

          {/* Marketing Content */}
          <div className="flex flex-col items-center justify-center">
            <div className="z-10 flex flex-col items-center justify-center pb-10">
              <motion.h1
                className="max-w-[100%] text-center text-2xl font-semibold uppercase text-[#FFFFFF] 2xl:text-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                Accept Crypto Like Cash. Without the Complexity
              </motion.h1>
              <div className="flex items-center justify-center">
                <motion.p
                  className="mt-2 max-w-[100%] text-center text-[#FFFFFF] 2xl:max-w-[80%]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  Let customers pay globally in crypto while you receive naira straight to your bank.
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetPassword
