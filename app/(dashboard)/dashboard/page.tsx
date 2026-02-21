"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import WelcomeModal from "components/ui/Modal/welcome-modal"
import StaticQrSetupModal from "components/ui/Modal/static-qr-setup-modal"
import PaymentLinkSetupModal from "components/ui/Modal/payment-link-setup-modal"
import WithdrawModal from "components/ui/Modal/withdraw-modal"
import { FormSelectModule } from "components/ui/Input/FormSelectModule"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchKycStatus } from "lib/redux/merchantKycSlice"
import type { AppDispatch, RootState } from "lib/redux/store"
import Image from "next/image"
import { DateRange } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

// Time filter types
type TimeFilter = "today" | "this_week" | "this_month" | "this_year" | "all_time" | "custom"

interface DateRangeType {
  startDate: Date
  endDate: Date
  key: string
}

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  // Redux state for KYC status
  const { kycStatus, isFetchingKycStatus } = useSelector((state: RootState) => state.merchantKyc)

  const [selectedCurrencyId, setSelectedCurrencyId] = useState<number>(1)
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState<string>("NGN")
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("today")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateRange, setDateRange] = useState<DateRangeType[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)
  const [showStaticQrSetupModal, setShowStaticQrSetupModal] = useState(false)
  const [showPaymentLinkSetupModal, setShowPaymentLinkSetupModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawLoading, setWithdrawLoading] = useState(false)

  // Fetch KYC status on component mount
  useEffect(() => {
    dispatch(fetchKycStatus())
  }, [dispatch])

  // Helper functions to determine setup status
  const getAccountSetupStatus = () => {
    if (!kycStatus) return { completed: false, status: "Loading", step: 1 }

    // KYC is completed only if label is NOT "NotCaptured"
    const kycCompleted = kycStatus.status.label !== "NotCaptured"
    const phoneCompleted = kycStatus.isPhoneConfirmed

    if (phoneCompleted && kycCompleted) {
      return { completed: true, status: "Verified", step: 3 }
    } else if (phoneCompleted) {
      return { completed: false, status: "KYC Pending", step: 2 }
    } else {
      return { completed: false, status: "Not Verified", step: 1 }
    }
  }

  const getSetupProgress = () => {
    if (!kycStatus) return { currentStep: 1, totalSteps: 3, completed: 0 }

    // Use actual KYC status value for step display
    const kycValue = kycStatus.status.value // Use the actual value from API
    const phoneCompleted = kycStatus.isPhoneConfirmed
    const kycCompleted = kycStatus.status.label !== "NotCaptured"

    let completed = 0
    if (phoneCompleted) completed = 1 // Phone verification completed
    if (kycCompleted) completed = 2 // KYC completed

    return {
      currentStep: kycValue, // Show actual KYC status value (1, 2, 3, etc.)
      totalSteps: 3,
      completed,
    }
  }

  // Check if KYC is incomplete (value 1 or 0)
  const isKycIncomplete = () => {
    if (!kycStatus) return true
    return kycStatus.status.value <= 1 // 0 or 1 means incomplete
  }

  // Mock currencies data
  const currenciesData = {
    data: [
      { id: 1, symbol: "NGN", name: "Nigerian Naira" },
      { id: 2, symbol: "USD", name: "US Dollar" },
      { id: 3, symbol: "EUR", name: "Euro" },
    ],
  }

  // Generate random utility data based on time filter
  const generateUtilityData = () => {
    let baseMultiplier = 1

    if (timeFilter === "today") {
      baseMultiplier = 0.03
    } else if (timeFilter === "this_week") {
      baseMultiplier = 0.2
    } else if (timeFilter === "this_month") {
      baseMultiplier = 1
    } else if (timeFilter === "this_year") {
      baseMultiplier = 12
    } else if (timeFilter === "all_time") {
      baseMultiplier = 24
    } else if (timeFilter === "custom") {
      // Calculate multiplier based on custom date range
      const daysDiff = Math.ceil(
        ((dateRange[0]?.endDate?.getTime() || 0) - (dateRange[0]?.startDate?.getTime() || 0)) / (1000 * 60 * 60 * 24)
      )
      baseMultiplier = Math.max(0.03, daysDiff / 30) // Minimum 0.03, scale based on days
    }

    return {
      // Customer metrics
      totalCustomers: Math.floor(125000 + Math.random() * 5000),
      prepaidCustomers: Math.floor(85000 + Math.random() * 3000),
      postpaidCustomers: Math.floor(35000 + Math.random() * 2000),
      estimatedBillingCustomers: Math.floor(5000 + Math.random() * 1000),

      // Financial metrics
      totalRevenue: Math.floor(25000000 + Math.random() * 5000000) * baseMultiplier,
      collectionEfficiency: 85 + Math.random() * 10, // Percentage
      outstandingArrears: Math.floor(45000000 + Math.random() * 5000000),

      // Operational metrics
      newConnectionsMTD: Math.floor(1200 + Math.random() * 300) * baseMultiplier,
      prepaidVends: Math.floor(50000 + Math.random() * 10000) * baseMultiplier,
      tokensGenerated: Math.floor(75000 + Math.random() * 15000) * baseMultiplier,
      metersProgrammed: Math.floor(1800 + Math.random() * 400) * baseMultiplier,
      pendingMeterProgramming: 425,
      arrearsCollectedMTD: Math.floor(12000000 + Math.random() * 3000000) * baseMultiplier,

      // New summary metrics
      todaysCollection: Math.floor(1500000 + Math.random() * 500000),
      pendingConfirmations: Math.floor(450000 + Math.random() * 150000),
      settledToday: Math.floor(1250000 + Math.random() * 350000),
      availableBalance: Math.floor(8500000 + Math.random() * 2000000),
    }
  }

  const [utilityData, setUtilityData] = useState(generateUtilityData())

  useEffect(() => {
    // Refresh utility data when time filter changes
    setUtilityData(generateUtilityData())
  }, [timeFilter])

  useEffect(() => {
    if (currenciesData?.data) {
      const selectedCurrency = currenciesData.data.find((currency) => currency.id === selectedCurrencyId)
      if (selectedCurrency) {
        setSelectedCurrencySymbol(selectedCurrency.symbol)
      }
    }
  }, [selectedCurrencyId])

  const handleWelcomeModalClose = () => {
    setShowWelcomeModal(false)
  }

  const handleGetStarted = () => {
    setShowWelcomeModal(false)
    router.push("/account-setup")
  }

  const handleStaticQrGenerate = (data: any) => {
    console.log("Static QR Data:", data)
  }

  const handlePaymentLinkGenerate = (data: any) => {
    console.log("Payment Link Data:", data)
  }

  const handleWithdraw = async (amount: number) => {
    setWithdrawLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      console.log("Withdraw amount:", amount)
      setShowWithdrawModal(false)
    } finally {
      setWithdrawLoading(false)
    }
  }

  // Calculate derived metrics
  const collectionEfficiencyColor =
    utilityData.collectionEfficiency >= 90
      ? "text-green-500"
      : utilityData.collectionEfficiency >= 80
      ? "text-yellow-500"
      : "text-red-500"

  const handleDateRangeSelect = () => {
    setShowDatePicker(false)
    setTimeFilter("custom")
    setUtilityData(generateUtilityData())
  }

  const handleDateRangeChange = (ranges: any) => {
    setDateRange([ranges.selection])
  }

  const formatDateRange = () => {
    if (timeFilter === "custom" && dateRange[0]) {
      const start = dateRange[0].startDate.toLocaleDateString()
      const end = dateRange[0].endDate.toLocaleDateString()
      return `${start} - ${end}`
    }
    return ""
  }

  return (
    <section className="size-full">
      <div className="flex min-h-screen w-full bg-gradient-to-br from-[#F9FAFB] to-[#F9FAFB]">
        <div className="flex w-full flex-col">
          <DashboardNav />

          <div className="mx-auto w-full py-4 2xl:container max-sm:px-3 md:px-4 lg:px-6 2xl:px-16">
            <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">Dashboard Overview</h1>
                <p className="text-sm font-medium text-gray-500">
                  Monitor your payment activity, track settlement, and manage your account.
                </p>
              </div>

              {/* Time Range Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Time Range:</span>
                <div className="w-32 sm:hidden">
                  <FormSelectModule
                    label=""
                    name="timeFilter"
                    value={timeFilter}
                    onChange={(e) => {
                      const value = e.target.value as TimeFilter
                      if (value === "custom") {
                        setShowDatePicker(true)
                      } else {
                        setTimeFilter(value)
                      }
                    }}
                    options={[
                      { value: "today", label: "Today" },
                      { value: "this_week", label: "This Week" },
                      { value: "this_month", label: "This Month" },
                      { value: "this_year", label: "This Year" },
                      { value: "all_time", label: "All Time" },
                      { value: "custom", label: "Custom" },
                    ]}
                    size="sm"
                  />
                </div>
                <div className="hidden rounded-lg border border-gray-200 bg-white p-1 sm:inline-flex">
                  <button
                    onClick={() => setTimeFilter("today")}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      timeFilter === "today" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setTimeFilter("this_week")}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      timeFilter === "this_week" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => setTimeFilter("this_month")}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      timeFilter === "this_month" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    This Month
                  </button>
                  <button
                    onClick={() => setTimeFilter("this_year")}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      timeFilter === "this_year" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    This Year
                  </button>
                  <button
                    onClick={() => setTimeFilter("all_time")}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      timeFilter === "all_time" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    All Time
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        timeFilter === "custom" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Custom
                    </button>

                    {/* Date Range Picker Dropdown */}
                    {showDatePicker && (
                      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 sm:rounded-lg sm:border sm:border-gray-200 sm:bg-white sm:shadow-lg">
                        <div className="w-full max-w-sm rounded-lg bg-white p-4 sm:max-w-none sm:border-0 sm:p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">Select Date Range</h3>
                            <button
                              onClick={() => setShowDatePicker(false)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>

                          <DateRange
                            ranges={dateRange}
                            onChange={handleDateRangeChange}
                            moveRangeOnFirstSelection={false}
                            rangeColors={["#2563eb"]}
                            className="custom-date-range"
                          />

                          <div className="mt-4 flex justify-end gap-2">
                            <button
                              onClick={() => setShowDatePicker(false)}
                              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleDateRangeSelect}
                              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <h1 className="text-lg font-semibold text-gray-900 ">
                Quick Setup Guide {getSetupProgress().currentStep}/{getSetupProgress().totalSteps}
              </h1>
              <p className="text-sm font-medium text-gray-500">Follow these steps to get started with UltraPay.</p>

              <div className="mt-4 space-y-3">
                <div
                  className={`flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-colors ${
                    getAccountSetupStatus().completed
                      ? "cursor-pointer hover:bg-gray-50"
                      : "cursor-pointer hover:bg-gray-50"
                  }`}
                  onClick={() => router.push("/account-setup")}
                >
                  <div
                    className={`flex size-6 items-center justify-center rounded-full ${
                      getAccountSetupStatus().completed ? "bg-green-100" : "bg-yellow-100"
                    }`}
                  >
                    {getAccountSetupStatus().completed ? (
                      <svg className="size-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="size-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">Complete your account setup</h3>
                    <p
                      className={`text-xs ${getAccountSetupStatus().completed ? "text-green-600" : "text-yellow-600"}`}
                    >
                      {getAccountSetupStatus().status}
                    </p>
                  </div>
                  <svg className="size-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <div
                  className={`flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors ${
                    isKycIncomplete()
                      ? "cursor-not-allowed bg-gray-50 opacity-60"
                      : "cursor-pointer bg-white hover:bg-gray-50"
                  }`}
                  onClick={() => !isKycIncomplete() && router.push("/add-settlement-bank")}
                >
                  <div
                    className={`flex size-6 items-center justify-center rounded-full ${
                      isKycIncomplete() ? "bg-gray-100" : "bg-yellow-100"
                    }`}
                  >
                    <svg
                      className={`size-4 ${isKycIncomplete() ? "text-gray-400" : "text-yellow-600"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm font-medium ${isKycIncomplete() ? "text-gray-500" : "text-gray-900"}`}>
                      Add settlement Bank Account
                    </h3>
                    <p className={`text-xs ${isKycIncomplete() ? "text-gray-400" : "text-yellow-600"}`}>
                      {isKycIncomplete() ? "Complete KYC first" : "Not Verified"}
                    </p>
                  </div>
                  <svg
                    className={`size-5 ${isKycIncomplete() ? "text-gray-300" : "text-gray-400"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <div
                  className={`flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors ${
                    isKycIncomplete()
                      ? "cursor-not-allowed bg-gray-50 opacity-60"
                      : "cursor-not-allowed bg-gray-50 opacity-60"
                  }`}
                >
                  <div
                    className={`flex size-6 items-center justify-center rounded-full ${
                      isKycIncomplete() ? "bg-gray-100" : "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`size-4 ${isKycIncomplete() ? "text-gray-400" : "text-gray-400"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm font-medium ${isKycIncomplete() ? "text-gray-500" : "text-gray-500"}`}>
                      Create your first payment
                    </h3>
                    <p className={`text-xs ${isKycIncomplete() ? "text-gray-400" : "text-gray-400"}`}>
                      {isKycIncomplete() ? "Complete KYC first" : "Pending"}
                    </p>
                  </div>
                  <svg
                    className={`size-5 ${isKycIncomplete() ? "text-gray-300" : "text-gray-300"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Customer Metrics */}
            <div className="my-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="grid grid-cols-1  gap-6 md:grid-cols-2 2xl:grid-cols-4">
                  {/* Today's Collection */}
                  <div className="border-gray-200 last:border-r-0 max-2xl:pb-6 max-sm:border-b max-sm:pb-4 sm:max-2xl:rounded-md sm:max-2xl:bg-[#f9f9f9] sm:max-2xl:p-4 md:pr-6  2xl:border-r">
                    <div className="flex items-center justify-between">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
                        <svg className="size-5  text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 11l5-5m0 0l5 5m-5-5v12"
                          />
                        </svg>
                        <span className="text-sm font-medium">12.5%</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500">Today&apos;s Collection</h3>
                      {isLoading ? (
                        <div className="mt-2 h-8 w-32 animate-pulse rounded bg-gray-200"></div>
                      ) : (
                        <p className="mt-2 text-2xl font-semibold text-gray-900">
                          {selectedCurrencySymbol}
                          {utilityData.todaysCollection.toLocaleString()}
                        </p>
                      )}
                      <div className="mt-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Yesterday:</span>
                          <span>
                            {selectedCurrencySymbol}
                            {(utilityData.todaysCollection * 0.89).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pending Confirmations */}
                  <div className="border-gray-200 pr-6 last:border-r-0 max-sm:border-b max-sm:pb-4 sm:max-2xl:rounded-md sm:max-2xl:bg-[#f9f9f9] sm:max-2xl:p-4 2xl:border-r">
                    <div className="flex items-center justify-between">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-100">
                        <svg className="size-5  text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center gap-1 text-red-600">
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 13l-5 5m0 0l-5-5m5 5V6"
                          />
                        </svg>
                        <span className="text-sm font-medium">8.2%</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500">Pending Confirmations</h3>
                      {isLoading ? (
                        <div className="mt-2 h-8 w-32 animate-pulse rounded bg-gray-200"></div>
                      ) : (
                        <p className="mt-2 text-2xl font-semibold text-gray-900">
                          {selectedCurrencySymbol}
                          {utilityData.pendingConfirmations.toLocaleString()}
                        </p>
                      )}
                      <div className="mt-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Transactions:</span>
                          <span>{Math.floor(utilityData.pendingConfirmations / 2500).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Settled Today */}
                  <div className="border-gray-200 pr-6 last:border-r-0 max-sm:border-b  max-sm:pb-4 sm:max-2xl:rounded-md sm:max-2xl:bg-[#f9f9f9] sm:max-2xl:p-4 2xl:border-r">
                    <div className="flex items-center justify-between">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-green-100">
                        <svg className="size-5  text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 11l5-5m0 0l5 5m-5-5v12"
                          />
                        </svg>
                        <span className="text-sm font-medium">15.3%</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500">Settled Today</h3>
                      {isLoading ? (
                        <div className="mt-2 h-8 w-32 animate-pulse rounded bg-gray-200"></div>
                      ) : (
                        <p className="mt-2 text-2xl font-semibold text-gray-900">
                          {selectedCurrencySymbol}
                          {utilityData.settledToday.toLocaleString()}
                        </p>
                      )}
                      <div className="mt-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Settlement rate:</span>
                          <span>
                            {((utilityData.settledToday / (utilityData.todaysCollection || 1)) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Available Balance */}
                  <div className="pr-6 last:pr-0 sm:max-2xl:rounded-md sm:max-2xl:bg-[#f9f9f9] sm:max-2xl:p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100">
                        <svg className="size-5  text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500">Available Balance</h3>
                      {isLoading ? (
                        <div className="mt-2 h-8 w-32 animate-pulse rounded bg-gray-200"></div>
                      ) : (
                        <p className="mt-2 text-2xl font-semibold text-gray-900">
                          {selectedCurrencySymbol}
                          {utilityData.availableBalance.toLocaleString()}
                        </p>
                      )}
                      <div className="mt-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Withdrawal limit:</span>
                          <span>{selectedCurrencySymbol}10,000,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div
                  className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50"
                  onClick={() => setShowStaticQrSetupModal(true)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
                      <svg className="size-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Static QR Code</h3>
                      <p className="text-xs text-gray-500">Generate QR for payments</p>
                    </div>
                  </div>
                </div>

                <div
                  className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50"
                  onClick={() => setShowPaymentLinkSetupModal(true)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-green-100">
                      <svg className="size-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Create Payment Link</h3>
                      <p className="text-xs text-gray-500">Share payment link</p>
                    </div>
                  </div>
                </div>

                <div
                  className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50"
                  onClick={() => setShowWithdrawModal(true)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-purple-100">
                      <svg className="size-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Withdraw</h3>
                      <p className="text-xs text-gray-500">Transfer to bank account</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700">View all</button>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-8">
                <div className="text-center">
                  <div className="mx-auto flex  items-center justify-center ">
                    <Image src="/ultra-pay/empty-activity.svg" alt="Empty Activity" width={60} height={60} />
                  </div>
                  <h3 className="mt-4 text-sm font-medium text-gray-900">No activities yet</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Your recent payment activities will appear here once you start receiving payments.
                  </p>
                  <div className="mt-6">
                    <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                      Create your first payment
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Operational Metrics */}
            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* <Card title="New Connections (MTD)" icon={<ConnectionIcon />}>
                <div className="mb-2 flex items-center justify-between border-b py-2">
                  <Text>Meter Installations</Text>
                </div>
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-32 rounded bg-gray-200"></div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Metric size="lg">{utilityData.newConnectionsMTD.toLocaleString()}</Metric>
                    <TrendIndicator value="8.7%" positive={true} />
                  </div>
                )}
              </Card> */}

              {/* <Card title="Prepaid Vends" icon={<VendingIcon />}>
                <div className="mb-2 flex items-center justify-between border-b py-2">
                  <Text>Token Transactions</Text>
                </div>
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-32 rounded bg-gray-200"></div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Metric size="lg">{utilityData.prepaidVends.toLocaleString()}</Metric>
                    <TrendIndicator value="15.3%" positive={true} />
                  </div>
                )}
              </Card> */}

              {/* <Card title="Tokens Generated" icon={<TokenGeneratedIcon />}>
                <div className="mb-2 flex items-center justify-between border-b py-2">
                  <Text>KCT, CTT, CCT Tokens</Text>
                </div>
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-32 rounded bg-gray-200"></div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Metric size="lg">{utilityData.tokensGenerated.toLocaleString()}</Metric>
                    <TrendIndicator value="12.1%" positive={true} />
                  </div>
                )}
              </Card> */}

              {/* <Card title="Meters Programmed" icon={<MetersProgrammedIcon />}>
                <div className="mb-2 flex items-center justify-between border-b py-2">
                  <Text>{utilityData.pendingMeterProgramming} pending</Text>
                </div>
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-32 rounded bg-gray-200"></div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Metric size="lg">{utilityData.metersProgrammed.toLocaleString()}</Metric>
                    <TrendIndicator value="5.6%" positive={true} />
                  </div>
                )}
              </Card> */}
            </div>

            {/* Additional Financial Metric */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* <Card title="Arrears Collected (MTD)" icon={<FiDollarSign className="size-6" />}>
                <div className="mb-2 flex items-center justify-between border-b py-2">
                  <Text>Via Prepaid Deductions</Text>
                  <Text className="text-xs">Month to Date</Text>
                </div>
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-32 rounded bg-gray-200"></div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Metric>
                      {selectedCurrencySymbol}
                      {utilityData.arrearsCollectedMTD.toLocaleString()}
                    </Metric>
                    <div className="flex items-center">
                      <TrendIndicator value="18.4%" positive={true} />
                    </div>
                  </div>
                )}
                <div className="mt-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Target:</span>
                    <span>{selectedCurrencySymbol}15,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Achievement:</span>
                    <span>{((utilityData.arrearsCollectedMTD / 15000000) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </Card> */}

              {/* Transaction Volume Charts */}
              {/* <Card
                title={`Revenue Trend - ${
                  timeFilter === "day"
                    ? "Today"
                    : timeFilter === "week"
                    ? "This Week"
                    : timeFilter === "month"
                    ? "This Month"
                    : "All Time"
                }`}
              >
                <div className="mt-4 h-64">
                  <ProfitChart />
                </div>
              </Card> */}
            </div>
          </div>
        </div>
      </div>

      <StaticQrSetupModal
        isOpen={showStaticQrSetupModal}
        onRequestClose={() => setShowStaticQrSetupModal(false)}
        onGenerateQr={handleStaticQrGenerate}
      />

      <PaymentLinkSetupModal
        isOpen={showPaymentLinkSetupModal}
        onRequestClose={() => setShowPaymentLinkSetupModal(false)}
        onGenerateLink={handlePaymentLinkGenerate}
      />

      <WithdrawModal
        isOpen={showWithdrawModal}
        onRequestClose={() => setShowWithdrawModal(false)}
        onWithdraw={handleWithdraw}
        loading={withdrawLoading}
        currentBalance={utilityData.availableBalance}
      />

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onRequestClose={handleWelcomeModalClose}
        onGetStarted={handleGetStarted}
        loading={false}
      />
    </section>
  )
}
