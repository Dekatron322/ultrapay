"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CheckCircle, CreditCard, Shield, User, Webhook } from "lucide-react"

const tabs = [
  { id: "personal", label: "Personal Info", icon: User, href: "/profile" },
  { id: "kyb", label: "KYB Verification", icon: CheckCircle, href: "/kyb-verification" },
  { id: "bank", label: "Bank Details", icon: CreditCard, href: "/bank-details" },
  { id: "security", label: "Security", icon: Shield, href: "/security" },
  { id: "api", label: "API Keys & Webhooks", icon: Webhook, href: "/api-keys-webhooks" },
]

export default function ProfileSidebar() {
  const pathname = usePathname()

  // Determine active tab based on current pathname
  const getActiveTab = () => {
    if (pathname.startsWith("/kyb-verification")) return "kyb"
    if (pathname.startsWith("/bank-details")) return "bank"
    if (pathname.startsWith("/security")) return "security"
    if (pathname.startsWith("/api-keys-webhooks")) return "api"
    return "personal" // default for /profile
  }

  const activeTab = getActiveTab()

  return (
    <div className="w-full md:w-64 md:flex-shrink-0">
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex w-full items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="size-5  flex-shrink-0" />
                <span className="truncate">{tab.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
