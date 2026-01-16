"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import WelcomeModal from "components/ui/Modal/welcome-modal"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// Time filter types
type TimeFilter = "day" | "week" | "month" | "all"

export default function Dashboard() {
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<number>(1)
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState<string>("NGN")
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("month")
  const [isLoading, setIsLoading] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)
  const router = useRouter()

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
    const baseMultiplier = timeFilter === "day" ? 0.03 : timeFilter === "week" ? 0.2 : timeFilter === "month" ? 1 : 4

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

  // Calculate derived metrics
  const collectionEfficiencyColor =
    utilityData.collectionEfficiency >= 90
      ? "text-green-500"
      : utilityData.collectionEfficiency >= 80
      ? "text-yellow-500"
      : "text-red-500"

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
            </div>
            <div className="mt-5">
              <h1 className="text-lg font-semibold text-gray-900 ">Quick Setup Guide 1/3</h1>
              <p className="text-sm font-medium text-gray-500">Follow these steps to get started with UltraPay.</p>

              <div className="mt-4 space-y-3">
                <div
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50"
                  onClick={() => router.push("/account-setup")}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">Complete your account setup</h3>
                    <p className="text-xs text-green-600">Verified</p>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <div
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50"
                  onClick={() => router.push("/add-settlement-bank")}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100">
                    <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">Add settlement Bank Account</h3>
                    <p className="text-xs text-yellow-600">Not Verified</p>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <div className="flex cursor-not-allowed items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 opacity-60">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500">Create your first payment</h3>
                    <p className="text-xs text-gray-400">Pending</p>
                  </div>
                  <svg className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      <h3 className="text-sm font-medium text-gray-500">Today's Collection</h3>
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                        <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center gap-1 text-red-600">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                        <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

                <div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

                <div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
