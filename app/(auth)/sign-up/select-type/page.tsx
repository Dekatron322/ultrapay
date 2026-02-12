"use client"
import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ButtonModule } from "components/ui/Button/Button"
import { motion } from "framer-motion"
import Image from "next/image"

interface SignUpOption {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  route: string
}

const SignUpTypeSelection: React.FC = () => {
  const router = useRouter()

  const signUpOptions: SignUpOption[] = [
    {
      id: "business",
      title: "Business Owner",
      description: "Perfect for businesses, companies, and organizations looking to manage payments and operations.",
      icon: "/ultra-pay/business-icon.svg",
      features: [
        "Multi-user account management",
        "Business analytics and reporting",
        "Team collaboration tools",
        "Advanced payment processing",
      ],
      route: "/sign-up/business",
    },
    {
      id: "professional",
      title: "Professional",
      description: "Ideal for freelancers, consultants, and individual professionals managing their own practice.",
      icon: "/ultra-pay/professional-icon.svg",
      features: [
        "Personal account management",
        "Simplified invoicing",
        "Basic payment processing",
        "Mobile-first experience",
      ],
      route: "/sign-up/professional",
    },
  ]

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-[#ffffff]">
      {/* Logo with full-width border */}
      <div className="absolute left-0 right-0 top-4 z-10 w-screen border-b border-gray-200 pb-4">
        <div className="container w-full px-4">
          <Image src="/ultra-pay/logo.png" alt="Logo" width={155} height={100} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex min-h-screen flex-col 2xl:container max-md:mx-auto max-md:w-full max-md:max-w-lg md:w-full">
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
              className="flex w-full max-w-4xl flex-col rounded-2xl max-sm:px-4 max-sm:pt-10 sm:px-6 md:px-8 lg:justify-center lg:px-10 lg:py-8"
            >
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-[#1447E6] md:text-3xl">Choose Your Account Type</h1>
                <p className="mt-2 text-[#101836]">Select the option that best describes your needs</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {signUpOptions.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-[#1447E6]/20 hover:shadow-md"
                  >
                    <div className="mb-4 flex items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1447E6]/10">
                        <Image src={option.icon} alt={option.title} width={32} height={32} className="size-8" />
                      </div>
                    </div>

                    <h3 className="mb-2 text-center text-xl font-semibold text-[#101836]">{option.title}</h3>

                    <p className="mb-4 text-center text-sm text-[#6B7280]">{option.description}</p>

                    <ul className="mb-6 space-y-2">
                      {option.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-sm text-[#101836]">
                          <div className="mr-2 mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-[#1447E6]" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <ButtonModule onClick={() => router.push(option.route)} className="w-full" variant="primary">
                      Choose {option.title}
                    </ButtonModule>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-[#6B7280]">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="font-medium text-[#1447E6] hover:text-[#1447E6]/80">
                    Sign in
                  </Link>
                </p>
              </div>
            </motion.div>
          </motion.main>
        </div>
      </div>
    </div>
  )
}

export default SignUpTypeSelection
