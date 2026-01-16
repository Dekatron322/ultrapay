"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PasswordInputModule } from "components/ui/Input/PasswordInput"
import { ButtonModule } from "components/ui/Button/Button"
import { FormInputModule } from "components/ui/Input/Input"
import { FormInputModule as EmailInput } from "components/ui/Input/EmailInput"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface Testimonial {
  id: number
  image: string
  quote: string
  name: string
  title: string
  company: string
}

const ForgotPassword: React.FC = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    // Basic validation
    if (!email.trim()) {
      setError("Please enter your email address")
      setLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      // Redirect to check email page or show success message
      router.push("/reset-pin")
    }, 1500)
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const isButtonDisabled = loading || email.trim() === ""

  // Get current testimonial safely
  const currentTestimonialData = testimonials[currentTestimonial]

  return (
    <div className="relative flex min-h-screen grid-cols-1 bg-gradient-to-br from-[#ffffff]">
      {/* Form Container */}
      <div className="container relative flex flex-col items-center justify-center border-r-2 border-[#ffffff80] py-8 max-sm:px-5 md:w-[70%]">
        <div className="absolute left-0 top-4 w-full border-b border-gray-200 pb-4">
          <div className="px-8">
            <Image src="/ultra-pay/logo.png" alt="Logo" width={155} height={100} />
          </div>
        </div>
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
            className="w-full max-w-xl rounded-2xl lg:p-8 "
          >
            <div className="mb-8 border-b pb-6 ">
              <h1 className="text-3xl font-bold text-[#1447E6]">Forgot Password</h1>
              <p className="mt-2 text-[#101836]">
                Can't remember your password? Enter your registered email address to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
                <EmailInput
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
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

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
                <ButtonModule
                  variant="primary"
                  size="lg"
                  className="w-full transform py-3 font-medium transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                  type="submit"
                  disabled={isButtonDisabled}
                  loading={loading}
                  whileHover={!isButtonDisabled ? { scale: 1.01 } : {}}
                  whileTap={!isButtonDisabled ? { scale: 0.99 } : {}}
                >
                  {loading ? <div className="flex items-center justify-center">Sending...</div> : "Send Reset Link"}
                </ButtonModule>
              </motion.div>
            </form>

            {/* Demo credentials hint */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className=" max-sm:mt-4"
          >
            <p className="text-sm text-[#101836]">
              Remember your password?{" "}
              <Link
                href="/"
                className="font-medium text-[#1447E6] transition-all duration-200 ease-in-out hover:text-[#100A55]"
              >
                Sign In
              </Link>
            </p>
          </motion.div>
        </motion.main>
      </div>

      {/* Testimonial Slider Container */}
      <div
        className="relative w-[30%] bg-[url('/ultra-pay/bg.png')]  bg-cover bg-center bg-no-repeat max-sm:hidden"
        style={{ backgroundPosition: "center 0%" }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute right-0 top-[-5%] z-0 flex h-full"
        >
          {/* <img src="/auth-background.svg" alt="auth-background" className="w-full" /> */}
        </motion.div>

        {/* Testimonial Slider */}
        <div className="flex h-full flex-col items-center justify-between px-4 py-8">
          <AnimatePresence mode="wait">
            {currentTestimonialData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex max-w-2xl flex-col items-center text-center"
              >
                {/* Testimonial Quote */}

                {/* <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  src="/ultra-pay/image.png"
                  alt="testimonial"
                  className="w-[450px]"
                /> */}

                {/* Testimonial Author */}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Slider Indicators */}

          <div className="flex flex-col items-center justify-center">
            <div className=" z-10 flex  flex-col items-center justify-center  pb-10">
              <motion.h1
                className="max-w-[100%] text-center text-2xl font-semibold uppercase text-[#FFFFFF] 2xl:text-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                Accept Crypto Like Cash. Without the Complexity
              </motion.h1>
              <div className=" flex items-center justify-center">
                <motion.p
                  className="mt-2 max-w-[100%] text-center text-[#FFFFFF]  2xl:max-w-[80%]"
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

export default ForgotPassword
