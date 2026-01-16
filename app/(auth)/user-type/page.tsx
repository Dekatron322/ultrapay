"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ButtonModule } from "components/ui/Button/Button"
import { FormInputModule } from "components/ui/Input/EmailInput"
import { motion, AnimatePresence } from "framer-motion"
import { HousesOutlineIcon, UserOutlineIcon, SettingIconOutline } from "components/Icons/LogoIcons"

interface Testimonial {
  id: number
  image: string
  quote: string
  name: string
  title: string
  company: string
}

const SelectUserType: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const router = useRouter()

  const departments = [
    {
      id: "landlord",
      title: "Landlord",
      description: "Property owners managing their real estate investments",
      icon: <HousesOutlineIcon color="#1447E6" size={20} />,
    },
    {
      id: "agent",
      title: "Agent",
      description: "Real estate professionals helping clients buy, sell, or rent properties",
      icon: <UserOutlineIcon color="#1447E6" size={20} />,
    },
    {
      id: "tenant",
      title: "Tenant",
      description: "Individuals renting or looking to rent properties",
      icon: <UserOutlineIcon color="#1447E6" size={20} />,
    },
    {
      id: "worker",
      title: "Technician",
      description: "Service providers for maintenance and property services",
      icon: <SettingIconOutline color="#1447E6" size={20} />,
    },
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

    // Validation
    if (!selectedDepartment) {
      setError("Please select a department")
      setLoading(false)
      return
    }

    // Here you would typically handle the department selection
    // For now, redirect to sign up page with the selected department
    router.push(`/sign-up/${selectedDepartment}`)
  }

  const handleDepartmentSelect = (departmentId: string) => {
    setSelectedDepartment(departmentId)
    // Clear error when user selects a department
    if (error) setError(null)
  }

  const isButtonDisabled = loading || !selectedDepartment

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
              <h1 className="text-3xl font-bold text-[#1447E6]">Select User Type</h1>
              <p className="mt-2 text-[#101836]">Select the type of user you are to create an account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Department Selection Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {departments.map((department, index) => (
                  <motion.div
                    key={department.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className={`relative cursor-pointer rounded-xl border p-4 transition-all duration-300 hover:border-[#1447E6] hover:bg-[#f8f7ff] ${
                      selectedDepartment === department.id
                        ? "border-[#1447E6] bg-[#E8E6F9] ring-2 ring-[#1447E6] ring-opacity-50"
                        : "border-[#E5E7EB] bg-white"
                    }`}
                    onClick={() => handleDepartmentSelect(department.id)}
                  >
                    {/* Circular Check Icon - Top Right Corner */}
                    <div
                      className={`absolute -right-2 -top-2 transition-all duration-300 ${
                        selectedDepartment === department.id ? "scale-100 opacity-100" : "scale-50 opacity-0"
                      }`}
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1447E6]">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6]">
                        <span className="text-2xl">{department.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#101836]">{department.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{department.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-red-50 p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </motion.div>
              )}

              {/* Continue Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="pt-4"
              >
                <ButtonModule
                  type="submit"
                  disabled={isButtonDisabled}
                  variant="primary"
                  className="w-full transform  py-3 font-medium transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                      <span className="ml-2">Processing...</span>
                    </div>
                  ) : (
                    "Continue to Sign Up"
                  )}
                </ButtonModule>
              </motion.div>
            </form>

            {/* Demo credentials hint */}
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
          <div className=" z-10 flex items-center justify-center pt-32">
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
          <div className="  z-10 flex items-center justify-center px-10 ">
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

export default SelectUserType
