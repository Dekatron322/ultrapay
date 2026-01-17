"use client"

import React, { useEffect, useState } from "react"
import { RxDotsVertical } from "react-icons/rx"
import { MdFormatListBulleted, MdGridView } from "react-icons/md"
import { PiNoteBold } from "react-icons/pi"
import { IoMdFunnel } from "react-icons/io"
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi"
import { GoXCircle } from "react-icons/go"
import { WiTime3 } from "react-icons/wi"
import { VscEye } from "react-icons/vsc"
import { SearchModule } from "components/ui/Search/search-module"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"

type SortOrder = "asc" | "desc" | null

interface Tenant {
  id: string
  name: string
  email: string
  phone: string
  unitNumber: string
  rentAmount: string
  leaseStart: string
  leaseEnd: string
  status: "ACTIVE" | "PENDING" | "OVERDUE"
  propertyId: string
  propertyName: string
  propertyType: "APARTMENT" | "HOUSE" | "COMMERCIAL" | "LAND"
  address: string
  city: string
  state: string
  nextPaymentDate: string
  paymentStatus: "PAID" | "PENDING" | "OVERDUE"
  emergencyContact: string
  notes: string
  avatar?: string
}

interface Property {
  id: string
  propertyId: string
  propertyName: string
  propertyType: "APARTMENT" | "HOUSE" | "COMMERCIAL" | "LAND"
  address: string
  city: string
  state: string
  status: "OCCUPIED" | "VACANT" | "UNDER_MAINTENANCE" | "RENTED"
  totalUnits: number
  occupiedUnits: number
  monthlyRent: string
  totalValue: string
  lastMaintenance: string
  nextMaintenance: string
  tenantCount: number
  propertyManager: string
  phoneNumber: string
  email: string
  createdAt: string
  updatedAt: string
  amenities: string[]
  images: string[]
}

// Sample tenant avatars/logo
const tenantAvatars = [
  "/real-estate/aivatar_rec_04.svg",
  "/real-estate/aivatar_rec_28.svg",
  "/real-estate/aivatar_rec_29.svg",
  "/real-estate/aivatar_rec_25.svg",
  "/real-estate/aivatar_rec_08.svg",
]

// Sample data for generating random tenants
const cities = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Benin"]
const states = ["Lagos", "FCT", "Rivers", "Oyo", "Kano", "Edo"]
const propertyTypes: ("APARTMENT" | "HOUSE" | "COMMERCIAL" | "LAND")[] = ["APARTMENT", "HOUSE", "COMMERCIAL", "LAND"]
const statuses: ("ACTIVE" | "PENDING" | "OVERDUE")[] = ["ACTIVE", "PENDING", "OVERDUE"]
const paymentStatuses: ("PAID" | "PENDING" | "OVERDUE")[] = ["PAID", "PENDING", "OVERDUE"]

// Generate random properties for tenant references
const generateRandomProperties = (count: number): Property[] => {
  return Array.from({ length: count }, (_, index) => {
    const id = `prop-${Date.now()}-${index}`
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)]!
    // const status = "OCCUPIED"
    const city = cities[Math.floor(Math.random() * cities.length)]!
    const state = states[Math.floor(Math.random() * states.length)]!
    const status: Property["status"] = "OCCUPIED"
    const totalUnits = propertyType === "LAND" ? 1 : Math.floor(Math.random() * 20) + 1
    const occupiedUnits = Math.floor(Math.random() * totalUnits)

    return {
      id,
      propertyId: `PROP${1000 + index}`,
      propertyName: `${propertyType} ${index + 1}`,
      propertyType,
      address: `Address ${index + 1}, ${city}`,
      city,
      state,
      status,
      totalUnits,
      occupiedUnits,
      monthlyRent: (Math.random() * 500000).toFixed(2),
      totalValue: (Math.random() * 50000000).toFixed(2),
      lastMaintenance: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      nextMaintenance: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      tenantCount: occupiedUnits,
      propertyManager: `Manager ${index + 1}`,
      phoneNumber: `+234${800000000 + index}`,
      email: `manager${index + 1}@example.com`,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      amenities: ["Swimming Pool", "Gym", "Parking", "Security"].slice(0, Math.floor(Math.random() * 4) + 2),
      images: ["/properties/apartment-1.png"],
    }
  })
}

// Generate random tenants
const generateRandomTenants = (count: number, properties: Property[]): Tenant[] => {
  return Array.from({ length: count }, (_, index) => {
    const property = properties[Math.floor(Math.random() * properties.length)]!
    const status = statuses[Math.floor(Math.random() * statuses.length)]!
    const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)]!
    const avatar = tenantAvatars[Math.floor(Math.random() * tenantAvatars.length)]

    return {
      id: `tenant-${Date.now()}-${index}`,
      name: `Tenant ${index + 1}`,
      email: `tenant${index + 1}@example.com`,
      phone: `+234${700000001 + index}`,
      unitNumber: `Unit ${String.fromCharCode(65 + (index % 5))}${(index % 10) + 1}`,
      rentAmount: (Math.random() * 500000).toFixed(2),
      leaseStart: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      leaseEnd: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      status,
      propertyId: property.id,
      propertyName: property.propertyName,
      propertyType: property.propertyType,
      address: property.address,
      city: property.city,
      state: property.state,
      nextPaymentDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      paymentStatus,
      emergencyContact: `+234${900000000 + index}`,
      notes: `Additional notes for tenant ${index + 1}`,
      avatar,
    }
  })
}

// Skeleton Components
const TenantCardSkeleton = () => (
  <div className="mt-3 overflow-hidden rounded-lg border bg-white p-0 shadow-sm">
    {/* Tenant Header Skeleton */}
    <div className="border-b p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
            <motion.div
              className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <div className="flex-1">
            <div className="mb-1 h-6 w-32 overflow-hidden rounded bg-gray-200">
              <motion.div
                className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.1,
                }}
              />
            </div>
            <div className="mb-2 h-4 w-24 overflow-hidden rounded bg-gray-200">
              <motion.div
                className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
              />
            </div>
          </div>
        </div>
        <div className="size-6 overflow-hidden rounded bg-gray-200">
          <motion.div
            className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />
        </div>
      </div>
    </div>

    {/* Tenant Details Skeleton */}
    <div className="p-4">
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-20 overflow-hidden rounded bg-gray-200">
              <motion.div
                className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4 + i * 0.1,
                }}
              />
            </div>
            <div className="h-4 w-16 overflow-hidden rounded bg-gray-200">
              <motion.div
                className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5 + i * 0.1,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <div className="h-9 flex-1 overflow-hidden rounded bg-gray-200">
          <motion.div
            className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.9,
            }}
          />
        </div>
      </div>
    </div>
  </div>
)

const TenantListItemSkeleton = () => (
  <div className="border-b bg-white p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
          <motion.div
            className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <div className="h-5 w-40 overflow-hidden rounded bg-gray-200">
              <motion.div
                className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.1,
                }}
              />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2,
                  }}
                />
              </div>
              <div className="h-6 w-20 overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 w-24 overflow-hidden rounded bg-gray-200">
                <motion.div
                  className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4 + i * 0.1,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="h-4 w-24 overflow-hidden rounded bg-gray-200">
            <motion.div
              className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
            />
          </div>
          <div className="mt-1 h-4 w-20 overflow-hidden rounded bg-gray-200">
            <motion.div
              className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.7,
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-20 overflow-hidden rounded bg-gray-200">
            <motion.div
              className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8,
              }}
            />
          </div>
          <div className="size-6 overflow-hidden rounded bg-gray-200">
            <motion.div
              className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.9,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
)

const HeaderSkeleton = () => (
  <div className="flex flex-col py-2">
    <div className="h-8 w-40 overflow-hidden rounded bg-gray-200">
      <motion.div
        className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
    <div className="mt-2 flex gap-4">
      <div className="h-10 w-80 overflow-hidden rounded bg-gray-200">
        <motion.div
          className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.1,
          }}
        />
      </div>
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-24 overflow-hidden rounded bg-gray-200">
            <motion.div
              className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2 + i * 0.1,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
)

const PaginationSkeleton = () => (
  <div className="mt-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="h-4 w-16 overflow-hidden rounded bg-gray-200">
        <motion.div
          className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <div className="h-8 w-16 overflow-hidden rounded bg-gray-200">
        <motion.div
          className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.1,
          }}
        />
      </div>
    </div>

    <div className="flex items-center gap-3">
      <div className="size-8 overflow-hidden rounded bg-gray-200">
        <motion.div
          className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />
      </div>
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="size-7 overflow-hidden rounded bg-gray-200">
            <motion.div
              className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3 + i * 0.1,
              }}
            />
          </div>
        ))}
      </div>
      <div className="size-8 overflow-hidden rounded bg-gray-200">
        <motion.div
          className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
        />
      </div>
    </div>

    <div className="h-4 w-24 overflow-hidden rounded bg-gray-200">
      <motion.div
        className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
    </div>
  </div>
)

const LandlordTenants = () => {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)
  const [rowsPerPage, setRowsPerPage] = useState(6)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchText, setSearchText] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")
  const [showStats, setShowStats] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [properties] = useState<Property[]>(() => generateRandomProperties(20))
  const [allTenants] = useState<Tenant[]>(() => generateRandomTenants(50, properties))

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const router = useRouter()

  // Simple loading state to drive skeleton UI
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [currentPage, rowsPerPage, viewMode, showStats, selectedProperty, selectedStatus, searchText])

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-dropdown-root="tenant-actions"]')) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  const handleViewDetails = (tenant: Tenant) => {
    router.push(`/tenants/tenant-detail/${tenant.id}`)
  }

  const handleSendReminder = (tenant: Tenant) => {
    console.log("Sending reminder to:", tenant.name)
    setActiveDropdown(null)
  }

  const handleExportData = (tenant: Tenant) => {
    console.log("Exporting data for:", tenant.name)
    setActiveDropdown(null)
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return { backgroundColor: "#EEF5F0", color: "#589E67" }
      case "PENDING":
        return { backgroundColor: "#FBF4EC", color: "#D28E3D" }
      case "OVERDUE":
        return { backgroundColor: "#F7EDED", color: "#AF4B4B" }
      default:
        return {}
    }
  }

  const getPaymentStatusStyle = (status: string) => {
    switch (status) {
      case "PAID":
        return { backgroundColor: "#EEF5F0", color: "#589E67" }
      case "PENDING":
        return { backgroundColor: "#FBF4EC", color: "#D28E3D" }
      case "OVERDUE":
        return { backgroundColor: "#F7EDED", color: "#AF4B4B" }
      default:
        return {}
    }
  }

  const getPropertyTypeStyle = (type: string) => {
    switch (type) {
      case "APARTMENT":
        return { backgroundColor: "#EDF2FE", color: "#4976F4" }
      case "HOUSE":
        return { backgroundColor: "#F4EDF7", color: "#954BAF" }
      case "COMMERCIAL":
        return { backgroundColor: "#FBF4EC", color: "#D28E3D" }
      case "LAND":
        return { backgroundColor: "#EEF5F0", color: "#589E67" }
      default:
        return { backgroundColor: "#FBF4EC", color: "#D28E3D" }
    }
  }

  const dotStyle = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return { backgroundColor: "#589E67" }
      case "PENDING":
        return { backgroundColor: "#D28E3D" }
      case "OVERDUE":
        return { backgroundColor: "#AF4B4B" }
      default:
        return {}
    }
  }

  const toggleSort = (column: keyof Tenant) => {
    const isAscending = sortColumn === column && sortOrder === "asc"
    setSortOrder(isAscending ? "desc" : "asc")
    setSortColumn(column)
  }

  const handleCancelSearch = () => {
    setSearchText("")
  }

  // Filter tenants based on search text, property, and status
  const filteredTenants = allTenants.filter((tenant: Tenant) => {
    const matchesSearch =
      searchText === "" ||
      Object.values(tenant).some((value) => value?.toString().toLowerCase().includes(searchText.toLowerCase()))
    const matchesProperty = selectedProperty === "" || tenant.propertyId === selectedProperty
    const matchesStatus = selectedStatus === "" || tenant.status === selectedStatus
    return matchesSearch && matchesProperty && matchesStatus
  })

  const totalRecords = filteredTenants.length
  const totalPages = Math.max(1, Math.ceil(totalRecords / rowsPerPage))
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedTenants = filteredTenants.slice(startIndex, startIndex + rowsPerPage)

  const handleRowsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(event.target.value))
    setCurrentPage(1)
  }

  const changePage = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page)
  }

  const TenantCard = ({ tenant }: { tenant: Tenant }) => (
    <div className="mt-3 overflow-hidden rounded-lg border bg-white p-0 shadow-sm transition-all hover:shadow-md">
      {/* Tenant Header with Avatar */}
      <div className="border-b p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Tenant Avatar/Logo */}
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#1447E6] to-[#954BAF]">
              {tenant.avatar ? (
                <img src={tenant.avatar} alt={tenant.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white">
                  <span className="text-lg font-semibold">{tenant.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-semibold text-gray-900">{tenant.name}</h3>
              <p className="mb-2 flex items-center gap-1 text-sm text-gray-600">
                <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {tenant.city}, {tenant.state}
              </p>
            </div>
          </div>
          <div className="relative" data-dropdown-root="tenant-actions">
            <RxDotsVertical
              onClick={() => toggleDropdown(tenant.id)}
              className="cursor-pointer text-gray-400 hover:text-gray-600"
            />
            {activeDropdown === tenant.id && (
              <div className="modal-style absolute right-0 top-full z-[100] mt-2 w-48 rounded border border-gray-300 bg-white shadow-lg">
                <ul className="text-sm">
                  <li
                    className="flex cursor-pointer items-center gap-2 border-b px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleViewDetails(tenant)}
                  >
                    <VscEye />
                    View Details
                  </li>
                  <li
                    className="flex cursor-pointer items-center gap-2 border-b px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleSendReminder(tenant)}
                  >
                    <WiTime3 /> Send Reminder
                  </li>
                  <li
                    className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleExportData(tenant)}
                  >
                    <PiNoteBold />
                    Export Data
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <div
            style={getStatusStyle(tenant.status)}
            className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
          >
            <span className="size-2 rounded-full" style={dotStyle(tenant.status)}></span>
            {tenant.status}
          </div>
          <div
            style={getPaymentStatusStyle(tenant.paymentStatus)}
            className="rounded-full px-2 py-1 text-xs font-medium"
          >
            {tenant.paymentStatus}
          </div>
          <div style={getPropertyTypeStyle(tenant.propertyType)} className="rounded-full px-2 py-1 text-xs font-medium">
            {tenant.propertyType}
          </div>
        </div>
      </div>

      {/* Tenant Details */}
      <div className="p-4">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Property:</span>
            <span className="font-medium">{tenant.propertyName}</span>
          </div>
          <div className="flex justify-between">
            <span>Unit:</span>
            <span className="font-medium">{tenant.unitNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Rent:</span>
            <span className="font-medium">₦{parseFloat(tenant.rentAmount).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Next Payment:</span>
            <span className="font-medium">{new Date(tenant.nextPaymentDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Contact:</span>
            <span className="font-medium">{tenant.phone}</span>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => handleViewDetails(tenant)}
            className="button-oulined flex flex-1 items-center justify-center gap-2 bg-white transition-all duration-300 ease-in-out focus-within:ring-2 focus-within:ring-[#1447E6] focus-within:ring-offset-2 hover:border-[#1447E6] hover:bg-[#f9f9f9]"
          >
            <VscEye className="size-4" />
            View Details
          </button>
        </div>
      </div>
    </div>
  )

  const TenantListItem = ({ tenant }: { tenant: Tenant }) => (
    <div className="border-b bg-white p-4 transition-all hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Tenant Avatar */}
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#1447E6] to-[#954BAF]">
            {tenant.avatar ? (
              <img src={tenant.avatar} alt={tenant.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white">
                <span className="text-lg font-semibold">{tenant.name.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h3 className="truncate font-semibold text-gray-900">{tenant.name}</h3>
              <div
                style={getStatusStyle(tenant.status)}
                className="flex items-center gap-1 rounded-full px-2 py-1 text-xs"
              >
                <span className="size-2 rounded-full" style={dotStyle(tenant.status)}></span>
                {tenant.status}
              </div>
              <div
                style={getPaymentStatusStyle(tenant.paymentStatus)}
                className="rounded-full px-2 py-1 text-xs font-medium"
              >
                {tenant.paymentStatus}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span>
                <strong>Property:</strong> {tenant.propertyName}
              </span>
              <span>
                <strong>Unit:</strong> {tenant.unitNumber}
              </span>
              <span>
                <strong>Rent:</strong> ₦{parseFloat(tenant.rentAmount).toLocaleString()}
              </span>
              <span>
                <strong>Next Payment:</strong> {new Date(tenant.nextPaymentDate).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {tenant.email} • {tenant.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-sm">
            <div className="font-medium text-gray-900">{tenant.propertyType}</div>
            <div className="text-gray-600">{tenant.city}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleViewDetails(tenant)} className="button-oulined flex items-center gap-2">
              <VscEye className="size-4" />
              View
            </button>
            <div className="relative" data-dropdown-root="tenant-actions">
              <RxDotsVertical
                onClick={() => toggleDropdown(tenant.id)}
                className="cursor-pointer text-gray-400 hover:text-gray-600"
              />
              {activeDropdown === tenant.id && (
                <div className="modal-style absolute right-0 top-full z-[100] mt-2 w-48 rounded border border-gray-300 bg-white shadow-lg">
                  <ul className="text-sm">
                    <li
                      className="flex cursor-pointer items-center gap-2 border-b px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleViewDetails(tenant)}
                    >
                      <VscEye />
                      View Details
                    </li>
                    <li
                      className="flex cursor-pointer items-center gap-2 border-b px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleSendReminder(tenant)}
                    >
                      <WiTime3 /> Send Reminder
                    </li>
                    <li
                      className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleExportData(tenant)}
                    >
                      <PiNoteBold />
                      Export Data
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Calculate statistics
  const totalTenants = allTenants.length
  const activeTenants = allTenants.filter((tenant) => tenant.status === "ACTIVE").length
  const pendingTenants = allTenants.filter((tenant) => tenant.status === "PENDING").length
  const overdueTenants = allTenants.filter((tenant) => tenant.status === "OVERDUE").length
  const totalMonthlyRent = allTenants.reduce((sum, tenant) => sum + parseFloat(tenant.rentAmount), 0)

  const StatsCard = ({
    title,
    value,
    subtitle,
    color,
  }: {
    title: string
    value: string
    subtitle: string
    color: string
  }) => (
    <div className="rounded-lg border bg-[#F9FAFB] p-4 transition-all hover:shadow-sm">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="mt-1 text-2xl font-semibold" style={{ color }}>
        {value}
      </p>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex-3 relative mt-5 flex items-start gap-6">
        {/* Main Content Skeleton */}
        <div className={`rounded-md border bg-white p-5 ${showStats ? "flex-1" : "w-full"}`}>
          <HeaderSkeleton />

          {/* Tenant Display Area Skeleton */}
          <div className="w-full">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <TenantCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {[...Array(5)].map((_, index) => (
                  <TenantListItemSkeleton key={index} />
                ))}
              </div>
            )}
          </div>

          <PaginationSkeleton />
        </div>

        {/* Stats Sidebar Skeleton */}
        {showStats && (
          <div className="w-80 rounded-md border bg-white p-5">
            <div className="border-b pb-4">
              <div className="h-6 w-40 overflow-hidden rounded bg-gray-200">
                <motion.div
                  className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="rounded-lg border bg-[#f9f9f9] p-4">
                  <div className="h-4 w-20 overflow-hidden rounded bg-gray-200">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.1,
                      }}
                    />
                  </div>
                  <div className="mt-2 h-6 w-16 overflow-hidden rounded bg-gray-200">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.1 + index * 0.1,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="flex-3 relative mt-5 flex items-start gap-6">
        {/* Main Content - Tenants List/Grid */}
        <div className={`rounded-md border bg-white p-5 ${showStats ? "flex-1" : "w-full"}`}>
          <div className="flex flex-col py-2">
            <p className="text-2xl font-medium">My Tenants</p>
            <div className="mt-2 flex gap-4">
              <SearchModule
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onCancel={handleCancelSearch}
                placeholder="Search by tenant name, email, or property"
                className="max-w-[300px] "
              />

              <div className="flex gap-2">
                <button
                  className={`button-oulined ${viewMode === "grid" ? "bg-[#f9f9f9]" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <MdGridView />
                  <p>Grid</p>
                </button>
                <button
                  className={`button-oulined ${viewMode === "list" ? "bg-[#f9f9f9]" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <MdFormatListBulleted />
                  <p>List</p>
                </button>
              </div>

              <button className="button-oulined" onClick={() => setShowStats(!showStats)}>
                {showStats ? "Hide Stats" : "Show Stats"}
              </button>

              {/* Property Filter */}
              <div className="relative">
                <button
                  type="button"
                  className="button-oulined flex items-center gap-2"
                  onClick={() => setIsPropertyDropdownOpen((prev) => !prev)}
                >
                  <span>
                    {selectedProperty
                      ? properties.find((p) => p.id === selectedProperty)?.propertyName
                      : "All Properties"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`size-4 transition-transform ${isPropertyDropdownOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {isPropertyDropdownOpen && (
                  <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-md border bg-white shadow-lg">
                    <button
                      type="button"
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-[#F3F4F6] ${
                        selectedProperty === "" ? "bg-[#F3F4F6] font-medium" : ""
                      }`}
                      onClick={() => {
                        setSelectedProperty("")
                        setIsPropertyDropdownOpen(false)
                      }}
                    >
                      All Properties
                    </button>
                    {properties.map((property) => (
                      <button
                        key={property.id}
                        type="button"
                        className={`block w-full px-3 py-2 text-left text-sm hover:bg-[#F3F4F6] ${
                          selectedProperty === property.id ? "bg-[#F3F4F6] font-medium" : ""
                        }`}
                        onClick={() => {
                          setSelectedProperty(property.id)
                          setIsPropertyDropdownOpen(false)
                        }}
                      >
                        {property.propertyName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative">
                <button
                  type="button"
                  className="button-oulined flex items-center gap-2"
                  onClick={() => setIsStatusDropdownOpen((prev) => !prev)}
                >
                  <span>{selectedStatus || "All Status"}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`size-4 transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {isStatusDropdownOpen && (
                  <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-md border bg-white shadow-lg">
                    <button
                      type="button"
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-[#F3F4F6] ${
                        selectedStatus === "" ? "bg-[#F3F4F6] font-medium" : ""
                      }`}
                      onClick={() => {
                        setSelectedStatus("")
                        setIsStatusDropdownOpen(false)
                      }}
                    >
                      All Status
                    </button>
                    {statuses.map((status) => (
                      <button
                        key={status}
                        type="button"
                        className={`block w-full px-3 py-2 text-left text-sm hover:bg-[#F3F4F6] ${
                          selectedStatus === status ? "bg-[#F3F4F6] font-medium" : ""
                        }`}
                        onClick={() => {
                          setSelectedStatus(status)
                          setIsStatusDropdownOpen(false)
                        }}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tenant Display Area */}
          <div className="w-full">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {paginatedTenants.map((tenant: Tenant) => (
                  <TenantCard key={tenant.id} tenant={tenant} />
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {paginatedTenants.map((tenant: Tenant) => (
                  <TenantListItem key={tenant.id} tenant={tenant} />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <p>Show rows</p>
              <select value={rowsPerPage} onChange={handleRowsChange} className="bg-[#F2F2F2] p-1">
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={18}>18</option>
                <option value={24}>24</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                className={`px-3 py-2 ${currentPage === 1 ? "cursor-not-allowed text-gray-400" : "text-[#1447E6]"}`}
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <BiSolidLeftArrow />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`flex h-[27px] w-[30px] items-center justify-center rounded-md ${
                      currentPage === index + 1 ? "bg-[#1447E6] text-white" : "bg-[#d8d6f5] text-gray-800"
                    }`}
                    onClick={() => changePage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                className={`px-3 py-2 ${
                  currentPage === totalPages ? "cursor-not-allowed text-gray-400" : "text-[#1447E6]"
                }`}
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <BiSolidRightArrow />
              </button>
            </div>
            <p>
              Page {currentPage} of {totalPages} ({totalRecords} total tenants)
            </p>
          </div>
        </div>

        {/* Statistics Sidebar */}
        <AnimatePresence initial={false}>
          {showStats && (
            <motion.div
              key="stats-sidebar"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ type: "spring", damping: 24, stiffness: 260 }}
              className="w-80 rounded-md border bg-white p-5"
            >
              <div className="border-b pb-4">
                <h2 className="text-lg font-semibold text-gray-900">Tenant Overview</h2>
              </div>

              <div className="mt-4 space-y-3">
                <StatsCard
                  title="Total Tenants"
                  value={totalTenants.toString()}
                  subtitle="Across all properties"
                  color="#1447E6"
                />
                <StatsCard
                  title="Active Tenants"
                  value={activeTenants.toString()}
                  subtitle="Currently renting"
                  color="#589E67"
                />
                <StatsCard
                  title="Pending Tenants"
                  value={pendingTenants.toString()}
                  subtitle="Awaiting approval"
                  color="#D28E3D"
                />
                <StatsCard
                  title="Overdue Tenants"
                  value={overdueTenants.toString()}
                  subtitle="Rent payments due"
                  color="#AF4B4B"
                />
                <StatsCard
                  title="Monthly Revenue"
                  value={`₦${totalMonthlyRent.toLocaleString()}`}
                  subtitle="Total monthly rent"
                  color="#4976F4"
                />
              </div>

              {/* Quick Actions */}
              <div className="mt-6 rounded-lg bg-[#F3F4F6] p-3">
                <h3 className="mb-2 font-medium text-gray-900">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full rounded bg-[#1447E6] px-3 py-2 text-sm text-white hover:bg-[#5a4fdf]">
                    Add New Tenant
                  </button>
                  <button className="w-full rounded border border-[#1447E6] bg-white px-3 py-2 text-sm text-[#1447E6] hover:bg-[#F3F4F6]">
                    Send Bulk Reminders
                  </button>
                  <button className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Export Tenant Data
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default LandlordTenants
