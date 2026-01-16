"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ButtonModule } from "components/ui/Button/Button"
import { motion, AnimatePresence } from "framer-motion"
import { VscArrowLeft } from "react-icons/vsc"
import Image from "next/image"

interface Testimonial {
  id: number
  image: string
  quote: string
  name: string
  title: string
  company: string
}

const ResetPin: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [counter, setCounter] = useState<number>(60)
  const [canResend, setCanResend] = useState<boolean>(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const router = useRouter()
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

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
    // Focus on the first input box when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleResend = () => {
    if (!canResend) return
    setOtp(Array(6).fill(""))
    setError(null)
    setCounter(60)
    setCanResend(false)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    // Basic validation
    const code = otp.join("")
    if (code.length !== 6 || otp.some((d) => d.trim() === "")) {
      setError("Please enter the 6-digit code")
      setLoading(false)
      return
    }
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      // Redirect to set-password page
      router.push("/change-password")
    }, 1500)
  }

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus()
    inputRefs.current[index]?.select?.()
  }

  const handleChange = (index: number, value: string) => {
    if (error) setError(null)
    // Allow only digits
    const v = value.replace(/\D/g, "")
    if (v.length === 0) {
      const next = [...otp]
      next[index] = ""
      setOtp(next)
      return
    }
    const digit = v.charAt(0)
    const next = [...otp]
    next[index] = digit
    setOtp(next)
    if (index < 5) {
      focusInput(index + 1)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault()
      const next = [...otp]
      if (next[index]) {
        next[index] = ""
        setOtp(next)
        return
      }
      if (index > 0) {
        focusInput(index - 1)
        const prev = [...otp]
        prev[index - 1] = ""
        setOtp(prev)
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

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text").replace(/\D/g, "")
    if (!text) return
    const next = [...otp]
    for (let i = 0; i < 6; i++) {
      const ch = text.charAt(i)
      next[i] = ch ? ch : next[i] ?? ""
    }
    setOtp(next.slice(0, 6))
    // focus last filled or last box
    const lastIndex = Math.min(text.length, 6) - 1
    if (lastIndex >= 0) focusInput(lastIndex)
  }

  const isButtonDisabled = loading || otp.some((d) => d.trim() === "")
  const minutes = Math.floor(counter / 60)
  const seconds = counter % 60

  return (
    <div className="relative flex min-h-screen grid-cols-1 bg-gradient-to-br from-[#ffffff]">
      {/* Logo with full-width border - Responsive */}
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
              className="flex w-full max-w-xl flex-col rounded-2xl max-sm:px-4 max-sm:pt-10 sm:px-6 md:px-8 lg:justify-center lg:px-10 lg:py-8"
            >
              {/* Back Link - Responsive */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="mb-4 text-left max-sm:mt-4 sm:mb-6 md:mb-8"
              >
                <div className="flex items-center gap-2 text-sm text-[#101836]">
                  <VscArrowLeft className="text-[#1447E6]" />
                  <Link href="/sign-up" className="font-medium text-[#1447E6] transition-all duration-200 ease-in-out">
                    Go Back
                  </Link>
                </div>
              </motion.div>

              <div className="mb-8 border-b pb-2 sm:pb-6">
                <h1 className="text-2xl font-bold text-[#1447E6] md:text-3xl">Reset password</h1>
                <p className="mt-1 text-[#101836] sm:mt-2">
                  Enter the security code sent to{" "}
                  <span className="font-medium text-[#1447E6]">bmastudio@ultrapay.com</span>. to secure your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <label className="mb-4 block text-center text-sm font-medium text-[#101836] sm:mb-6">
                    Enter 6-digit code
                  </label>
                  <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5">
                    {otp.map((val, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          inputRefs.current[idx] = el
                        }}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        className="h-12 w-12 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] text-center text-xl focus:border-[#1447E6] focus:outline-none focus:ring-2 focus:ring-[#1447E6] focus:ring-offset-2 sm:h-14 sm:w-14 md:h-14 md:w-16"
                        value={val}
                        onChange={(e) => handleChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        onPaste={handlePaste}
                      />
                    ))}
                  </div>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-md bg-red-50 p-3 text-sm text-red-600"
                  >
                    {error}
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
                    size="lg"
                    disabled={isButtonDisabled}
                    loading={loading}
                    className="w-full transform py-3 font-medium transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                    whileHover={!isButtonDisabled ? { scale: 1.01 } : {}}
                    whileTap={!isButtonDisabled ? { scale: 0.99 } : {}}
                  >
                    Sign In
                  </ButtonModule>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-center"
                >
                  <p className="text-sm text-[#101836]">
                    Didn't receive the code?{" "}
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={!canResend}
                      className={`font-medium transition-all duration-200 ease-in-out ${
                        canResend ? "text-[#1447E6] underline hover:text-[#100A55]" : "cursor-not-allowed text-gray-400"
                      }`}
                    >
                      {canResend ? "Resend" : `Resend (${minutes}:${seconds.toString().padStart(2, "0")})`}
                    </button>
                  </p>
                </motion.div>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-4 max-sm:mt-4"
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

export default ResetPin
