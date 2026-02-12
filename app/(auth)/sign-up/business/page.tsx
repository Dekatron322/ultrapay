"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "lib/redux/store"
import { registerBusiness, clearBusinessRegistrationStatus } from "lib/redux/authSlice"
import { fetchCountries } from "lib/redux/systemsSlice"
import { notify } from "components/ui/Notification/Notification"
import { ButtonModule } from "components/ui/Button/Button"
import { FormInputModule } from "components/ui/Input/Input"
import { FormInputModule as EmailInput } from "components/ui/Input/EmailInput"
import { FormSelectModule } from "components/ui/Input/FormSelectModule"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"

interface Testimonial {
  id: number
  image: string
  quote: string
  name: string
  title: string
  company: string
}

const BusinessSignUp: React.FC = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const auth = useSelector((state: RootState) => state.auth)
  const systems = useSelector((state: RootState) => state.systems)
  const [email, setEmail] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [country, setCountry] = useState("")
  const [countryError, setCountryError] = useState("")
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [errorNotified, setErrorNotified] = useState(false)

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

  // Fetch countries on component mount
  useEffect(() => {
    dispatch(fetchCountries())
  }, [dispatch])

  // Show notifications for business registration errors only
  useEffect(() => {
    if (auth.businessRegistrationError && !errorNotified) {
      notify("error", "Registration failed", {
        title: "Error",
        description: auth.businessRegistrationError,
      })
      setErrorNotified(true)
    }
    // Reset flag when error is cleared
    if (!auth.businessRegistrationError && errorNotified) {
      setErrorNotified(false)
    }
  }, [auth.businessRegistrationError, errorNotified])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCountryError("")

    // Country validation
    if (!country.trim()) {
      setCountryError("Please select a country")
      return
    }

    // Basic validation
    if (!email.trim() || !businessName.trim()) {
      return
    }

    // Use the actual country ID from the API response
    const businessData = {
      countryId: parseInt(country) || 0,
      businessName: businessName.trim(),
      email: email.trim(),
    }

    try {
      const result = await dispatch(registerBusiness(businessData))
      if (registerBusiness.fulfilled.match(result)) {
        // Registration successful, check if email is already verified
        if (result.payload.data?.isVerified) {
          // Email already verified, redirect directly to set-password
          notify("success", "Email already verified!", {
            title: "Registration Successful",
            description: "Your email is already verified. Redirecting to set password...",
          })
          setTimeout(() => {
            router.push(`/sign-up/set-password?email=${encodeURIComponent(email.trim())}&verified=true`)
          }, 1500)
        } else {
          // Email needs verification, redirect to verify account page
          notify("success", "Redirecting to verification...", {
            title: "Registration Successful",
            description: "Your business has been registered successfully.",
          })
          setTimeout(() => {
            router.push(`/sign-up/verify-account?email=${encodeURIComponent(email.trim())}`)
          }, 1500)
        }
      }
    } catch (error) {
      // Error is handled by Redux state and useEffect above
      console.error("Business registration failed:", error)
    }
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
    // Clear error when user starts typing
    if (auth.businessRegistrationError) {
      dispatch(clearBusinessRegistrationStatus())
    }
  }

  const handleBusinessNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessName(event.target.value)
    // Clear error when user starts typing
    if (auth.businessRegistrationError) {
      dispatch(clearBusinessRegistrationStatus())
    }
  }

  const handleCountryChange = (
    event: React.ChangeEvent<HTMLSelectElement> | { target: { name: string; value: string | number } }
  ) => {
    setCountry(event.target.value as string)
    setCountryError("")
    // Clear error when user starts typing
    if (auth.businessRegistrationError) {
      dispatch(clearBusinessRegistrationStatus())
    }
  }

  const isButtonDisabled =
    auth.isRegisteringBusiness || email.trim() === "" || businessName.trim() === "" || country.trim() === ""

  // Get current testimonial safely
  const currentTestimonialData = testimonials[currentTestimonial]

  // Transform countries data for FormSelectModule
  const countryOptions = [
    { value: "", label: "Select a country" },
    ...systems.countries.map((country) => ({
      value: country.id.toString(),
      label: `${country.name} (${country.currency.ticker} ${country.currency.symbol})`,
      icon: country.currency.avatar,
      iconType: "svg" as const,
    })),
  ]

  return (
    <div className="relative flex min-h-screen grid-cols-1 bg-gradient-to-br from-[#ffffff]">
      {/* Logo with full-width border */}
      <div className="absolute left-0 right-0 top-4 z-10 w-screen border-b border-gray-200 pb-4">
        <div className="container  w-full px-4">
          <Image src="/ultra-pay/logo.png" alt="Logo" width={155} height={100} />
        </div>
      </div>

      {/* Form Container - FIXED for proper centering */}
      <div className="relative flex min-h-screen  flex-col border-r-2 border-[#ffffff80] 2xl:container max-md:mx-auto max-md:w-full max-md:max-w-lg md:w-[50%] lg:w-[60%] xl:w-[70%] 2xl:w-[70%]">
        {/* Centered Form Content - FIXED */}
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
              className="flex w-full max-w-2xl flex-col rounded-2xl max-sm:px-4 max-sm:pt-10 sm:px-6 md:px-8  lg:justify-center lg:px-10 lg:py-8"
            >
              <div className="mb-8 border-b pb-2 sm:pb-6">
                <h1 className="text-2xl font-bold text-[#1447E6] md:text-3xl">Join UltraPay as a Business</h1>
                <p className="text-[#101836] md:mt-2">Enter your business details to get started</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <FormSelectModule
                    label="Country of Registration"
                    name="country"
                    value={country}
                    onChange={handleCountryChange}
                    error={countryError || systems.error || false}
                    options={countryOptions}
                    loading={systems.loading}
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <FormInputModule
                    label="Business Name"
                    type="text"
                    name="business-name"
                    placeholder="Your business name"
                    value={businessName}
                    onChange={handleBusinessNameChange}
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
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

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className=" flex items-center justify-between"
                >
                  <div className="flex items-center md:mt-6">
                    <p className="block text-sm text-[#101828]">
                      By clicking continue, you accept our{" "}
                      <Link
                        href="/"
                        className="font-medium text-[#1447E6] underline transition-all duration-200 ease-in-out hover:text-[#100A55]"
                      >
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/"
                        className="font-medium text-[#1447E6] underline transition-all duration-200 ease-in-out hover:text-[#100A55]"
                      >
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <ButtonModule
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isButtonDisabled}
                    loading={auth.isRegisteringBusiness}
                    className="w-full transform  py-3 font-medium transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                    whileHover={!isButtonDisabled ? { scale: 1.01 } : {}}
                    whileTap={!isButtonDisabled ? { scale: 0.99 } : {}}
                  >
                    Continue
                  </ButtonModule>
                </motion.div>
              </form>

              {/* Demo credentials hint */}
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

      {/* Testimonial Slider Container - UNCHANGED */}
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

export default BusinessSignUp
