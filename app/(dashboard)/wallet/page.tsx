"use client"

import DashboardNav from "components/Navbar/DashboardNav"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BTCIcon, USDCIcon, USDTIcon } from "components/Icons/LogoIcons"
import Image from "next/image"
import TransactionDetailsModal from "components/ui/Modal/transaction-details-modal"
import WithdrawModal from "components/ui/Modal/withdraw-modal"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ChevronDown, ChevronUp, Filter, SortAsc, SortDesc, X } from "lucide-react"
import { ButtonModule } from "components/ui/Button/Button"

// Time filter types
type TimeFilter = "day" | "week" | "month" | "all"

// Filter types
interface DashboardFilters {
  status?: string
  paymentSource?: string
  assetType?: string
  minAmount?: number
  maxAmount?: number
  dateFrom?: string
  dateTo?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

interface SortOption {
  label: string
  value: string
  order: "asc" | "desc"
}

// Mobile Filter Sidebar Component
const MobileFilterSidebar = ({
  isOpen,
  onClose,
  localFilters,
  handleFilterChange,
  handleSortChange,
  applyFilters,
  resetFilters,
  getActiveFilterCount,
  statusOptions,
  paymentSourceOptions,
  assetTypeOptions,
  sortOptions,
  isSortExpanded,
  setIsSortExpanded,
}: {
  isOpen: boolean
  onClose: () => void
  localFilters: DashboardFilters
  handleFilterChange: (key: keyof DashboardFilters, value: string | number | boolean | undefined) => void
  handleSortChange: (option: SortOption) => void
  applyFilters: () => void
  resetFilters: () => void
  getActiveFilterCount: () => number
  statusOptions: Array<{ value: string; label: string }>
  paymentSourceOptions: Array<{ value: string; label: string }>
  assetTypeOptions: Array<{ value: string; label: string }>
  sortOptions: SortOption[]
  isSortExpanded: boolean
  setIsSortExpanded: (value: boolean | ((prev: boolean) => boolean)) => void
}) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="mobile-filter-sidebar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-stretch justify-end bg-black/30 backdrop-blur-sm 2xl:hidden"
          onClick={onClose}
        >
          <motion.div
            key="mobile-filter-content"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="flex h-full w-full max-w-sm flex-col bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Fixed */}
            <div className="flex-shrink-0 border-b bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="flex size-8 items-center justify-center rounded-full hover:bg-gray-100"
                  >
                    <ArrowLeft className="size-5" />
                  </button>
                  <div>
                    <h2 className="text-lg font-semibold">Filters & Sorting</h2>
                    {getActiveFilterCount() > 0 && (
                      <p className="text-xs text-gray-500">{getActiveFilterCount()} active filter(s)</p>
                    )}
                  </div>
                </div>
                <button onClick={resetFilters} className="text-sm text-blue-600 hover:text-blue-800">
                  Clear All
                </button>
              </div>
            </div>

            {/* Filter Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {/* Status Filter */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-sm">Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {statusOptions
                      .filter((opt) => opt.value !== "")
                      .map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            handleFilterChange(
                              "status",
                              localFilters.status === option.value ? undefined : option.value
                            )
                          }
                          className={`rounded-md px-3 py-2 text-xs transition-colors md:text-sm ${
                            localFilters.status === option.value
                              ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Payment Source Filter */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-sm">Payment Source</label>
                  <div className="grid grid-cols-2 gap-2">
                    {paymentSourceOptions
                      .filter((opt) => opt.value !== "")
                      .map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            handleFilterChange(
                              "paymentSource",
                              localFilters.paymentSource === option.value ? undefined : option.value
                            )
                          }
                          className={`rounded-md px-3 py-2 text-xs transition-colors md:text-sm ${
                            localFilters.paymentSource === option.value
                              ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Asset Type Filter */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-sm">Asset Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {assetTypeOptions
                      .filter((opt) => opt.value !== "")
                      .map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            handleFilterChange(
                              "assetType",
                              localFilters.assetType === option.value ? undefined : option.value
                            )
                          }
                          className={`rounded-md px-3 py-2 text-xs transition-colors md:text-sm ${
                            localFilters.assetType === option.value
                              ? "bg-purple-50 text-purple-700 ring-1 ring-purple-200"
                              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Amount Range */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-sm">Min Amount</label>
                  <input
                    type="number"
                    value={localFilters.minAmount || ""}
                    onChange={(e) =>
                      handleFilterChange("minAmount", e.target.value ? Number(e.target.value) : undefined)
                    }
                    placeholder="Enter minimum amount"
                    className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-sm">Max Amount</label>
                  <input
                    type="number"
                    value={localFilters.maxAmount || ""}
                    onChange={(e) =>
                      handleFilterChange("maxAmount", e.target.value ? Number(e.target.value) : undefined)
                    }
                    placeholder="Enter maximum amount"
                    className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
                  />
                </div>

                {/* Date Range Filters */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-sm">Date From</label>
                  <input
                    type="date"
                    value={localFilters.dateFrom || ""}
                    onChange={(e) => handleFilterChange("dateFrom", e.target.value || undefined)}
                    className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-sm">Date To</label>
                  <input
                    type="date"
                    value={localFilters.dateTo || ""}
                    onChange={(e) => handleFilterChange("dateTo", e.target.value || undefined)}
                    className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
                  />
                </div>

                {/* Sort Options */}
                <div>
                  <button
                    type="button"
                    onClick={() => setIsSortExpanded((prev) => !prev)}
                    className="mb-1.5 flex w-full items-center justify-between text-xs font-medium text-gray-700 md:text-sm"
                    aria-expanded={isSortExpanded}
                  >
                    <span>Sort By</span>
                    {isSortExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </button>

                  {isSortExpanded && (
                    <div className="space-y-2">
                      {sortOptions.map((option) => (
                        <button
                          key={`${option.value}-${option.order}`}
                          onClick={() => handleSortChange(option)}
                          className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors md:text-sm ${
                            localFilters.sortBy === option.value && localFilters.sortOrder === option.order
                              ? "bg-purple-50 text-purple-700 ring-1 ring-purple-200"
                              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>{option.label}</span>
                          {localFilters.sortBy === option.value && localFilters.sortOrder === option.order && (
                            <span className="text-purple-600">
                              {option.order === "asc" ? (
                                <SortAsc className="size-4" />
                              ) : (
                                <SortDesc className="size-4" />
                              )}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons - Fixed */}
            <div className="flex-shrink-0 border-t bg-white p-4 2xl:hidden">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    applyFilters()
                    onClose()
                  }}
                  className="button-filled flex-1 rounded-md bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    resetFilters()
                    onClose()
                  }}
                  className="button-outlined flex-1 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                >
                  Reset All
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Desktop Filters Sidebar Component
const DesktopFiltersSidebar = ({
  showDesktopFilters,
  localFilters,
  handleFilterChange,
  handleSortChange,
  applyFilters,
  resetFilters,
  getActiveFilterCount,
  statusOptions,
  paymentSourceOptions,
  assetTypeOptions,
  sortOptions,
  isSortExpanded,
  setIsSortExpanded,
}: {
  showDesktopFilters: boolean
  localFilters: DashboardFilters
  handleFilterChange: (key: keyof DashboardFilters, value: string | number | boolean | undefined) => void
  handleSortChange: (option: SortOption) => void
  applyFilters: () => void
  resetFilters: () => void
  getActiveFilterCount: () => number
  statusOptions: Array<{ value: string; label: string }>
  paymentSourceOptions: Array<{ value: string; label: string }>
  assetTypeOptions: Array<{ value: string; label: string }>
  sortOptions: SortOption[]
  isSortExpanded: boolean
  setIsSortExpanded: (value: boolean | ((prev: boolean) => boolean)) => void
}) => {
  if (!showDesktopFilters) return null

  return (
    <motion.div
      key="desktop-filters-sidebar"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="hidden h-svh w-full flex-col rounded-md border bg-white 2xl:flex 2xl:w-96 2xl:self-start"
    >
      <div className="flex-shrink-0 border-b bg-white p-3 md:p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 md:text-lg">Filters & Sorting</h2>
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 md:text-sm"
          >
            <X className="size-3 md:size-4" />
            Clear All
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-5">
        <div className="space-y-4">
          {/* Status Filter */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-sm">Status</label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions
                .filter((opt) => opt.value !== "")
                .map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      handleFilterChange("status", localFilters.status === option.value ? undefined : option.value)
                    }
                    className={`rounded-md px-3 py-2 text-xs transition-colors md:text-sm ${
                      localFilters.status === option.value
                        ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
            </div>
          </div>

          {/* Payment Source Filter */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-sm">Payment Source</label>
            <div className="grid grid-cols-2 gap-2">
              {paymentSourceOptions
                .filter((opt) => opt.value !== "")
                .map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      handleFilterChange(
                        "paymentSource",
                        localFilters.paymentSource === option.value ? undefined : option.value
                      )
                    }
                    className={`rounded-md px-3 py-2 text-xs transition-colors md:text-sm ${
                      localFilters.paymentSource === option.value
                        ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
            </div>
          </div>

          {/* Asset Type Filter */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-sm">Asset Type</label>
            <div className="grid grid-cols-2 gap-2">
              {assetTypeOptions
                .filter((opt) => opt.value !== "")
                .map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      handleFilterChange(
                        "assetType",
                        localFilters.assetType === option.value ? undefined : option.value
                      )
                    }
                    className={`rounded-md px-3 py-2 text-xs transition-colors md:text-sm ${
                      localFilters.assetType === option.value
                        ? "bg-purple-50 text-purple-700 ring-1 ring-purple-200"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
            </div>
          </div>

          {/* Amount Range */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-sm">Min Amount</label>
            <input
              type="number"
              value={localFilters.minAmount || ""}
              onChange={(e) => handleFilterChange("minAmount", e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Enter minimum amount"
              className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-sm">Max Amount</label>
            <input
              type="number"
              value={localFilters.maxAmount || ""}
              onChange={(e) => handleFilterChange("maxAmount", e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Enter maximum amount"
              className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
            />
          </div>

          {/* Date Range Filters */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-sm">Date From</label>
            <input
              type="date"
              value={localFilters.dateFrom || ""}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value || undefined)}
              className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-sm">Date To</label>
            <input
              type="date"
              value={localFilters.dateTo || ""}
              onChange={(e) => handleFilterChange("dateTo", e.target.value || undefined)}
              className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
            />
          </div>

          {/* Sort Options */}
          <div>
            <button
              type="button"
              onClick={() => setIsSortExpanded((prev) => !prev)}
              className="mb-1.5 flex w-full items-center justify-between text-xs font-medium text-gray-700 md:text-sm"
              aria-expanded={isSortExpanded}
            >
              <span>Sort By</span>
              {isSortExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>

            {isSortExpanded && (
              <div className="space-y-2">
                {sortOptions.map((option) => (
                  <button
                    key={`${option.value}-${option.order}`}
                    onClick={() => handleSortChange(option)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors md:text-sm ${
                      localFilters.sortBy === option.value && localFilters.sortOrder === option.order
                        ? "bg-purple-50 text-purple-700 ring-1 ring-purple-200"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>{option.label}</span>
                    {localFilters.sortBy === option.value && localFilters.sortOrder === option.order && (
                      <span className="text-purple-600">
                        {option.order === "asc" ? <SortAsc className="size-4" /> : <SortDesc className="size-4" />}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex-shrink-0 space-y-3 border-t bg-white p-3 md:p-5">
        <button
          onClick={applyFilters}
          className="button-filled flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700"
        >
          <Filter className="size-4" />
          Apply Filters
        </button>
        <button
          onClick={resetFilters}
          className="button-outlined flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-700 hover:bg-gray-50"
        >
          <X className="size-4" />
          Reset All
        </button>
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<number>(1)
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState<string>("₦")
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("month")
  const [isLoading, setIsLoading] = useState(false)
  const [showActivities, setShowActivities] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false)
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false)
  const router = useRouter()

  // Filter states
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [showDesktopFilters, setShowDesktopFilters] = useState(false)
  const [isSortExpanded, setIsSortExpanded] = useState(false)

  // Local state for filters
  const [localFilters, setLocalFilters] = useState<DashboardFilters>({
    status: undefined,
    paymentSource: undefined,
    assetType: undefined,
    minAmount: undefined,
    maxAmount: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    sortBy: "",
    sortOrder: "asc",
  })

  // Applied filters state
  const [appliedFilters, setAppliedFilters] = useState<DashboardFilters>({
    status: undefined,
    paymentSource: undefined,
    assetType: undefined,
    minAmount: undefined,
    maxAmount: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    sortBy: undefined,
    sortOrder: undefined,
  })

  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTransaction(null)
  }

  // Mock currencies data
  const currenciesData = {
    data: [
      { id: 1, symbol: "₦", name: "Nigerian Naira" },
      { id: 2, symbol: "$", name: "US Dollar" },
      { id: 3, symbol: "€", name: "Euro" },
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

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrencyId = Number(event.target.value)
    setSelectedCurrencyId(newCurrencyId)
  }

  const handleTimeFilterChange = (filter: TimeFilter) => {
    setTimeFilter(filter)
  }

  const handleWithdraw = async (amount: number) => {
    setIsWithdrawLoading(true)
    try {
      // Simulate API call for withdrawal
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Withdrawal processed:", { amount })
      setWithdrawModalOpen(false)
      // You can add success notification here
    } catch (error) {
      console.error("Withdrawal failed:", error)
      // You can add error notification here
    } finally {
      setIsWithdrawLoading(false)
    }
  }

  // Mock transaction data
  const mockTransactions = [
    {
      id: 1,
      reference: "TXN-001234",
      paymentSource: "Payment Link",
      assetPaid: "USDT",
      amount: 15000,
      assetQuantity: 15000,
      status: "successful",
      date: "2024-01-09T10:30:00Z",
    },
    {
      id: 2,
      reference: "TXN-001235",
      paymentSource: "Static QR",
      assetPaid: "BTC",
      amount: 8500,
      assetQuantity: 0.00021,
      status: "confirming",
      date: "2024-01-09T09:15:00Z",
    },
    {
      id: 3,
      reference: "TXN-001236",
      paymentSource: "Payment Link",
      assetPaid: "USDC",
      amount: 2500,
      assetQuantity: 2500,
      status: "successful",
      date: "2024-01-09T08:45:00Z",
    },
    {
      id: 4,
      reference: "TXN-001237",
      paymentSource: "Static QR",
      assetPaid: "USDT",
      amount: 22000,
      assetQuantity: 22000,
      status: "successful",
      date: "2024-01-09T07:30:00Z",
    },
    {
      id: 5,
      reference: "TXN-001238",
      paymentSource: "Payment Link",
      assetPaid: "BTC",
      amount: 12000,
      assetQuantity: 0.00029,
      status: "expired",
      date: "2024-01-09T06:15:00Z",
    },
  ]

  // Filter options
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "successful", label: "Successful" },
    { value: "confirming", label: "Confirming" },
    { value: "expired", label: "Expired" },
  ]

  const paymentSourceOptions = [
    { value: "", label: "All Sources" },
    { value: "Payment Link", label: "Payment Link" },
    { value: "Static QR", label: "Static QR" },
  ]

  const assetTypeOptions = [
    { value: "", label: "All Assets" },
    { value: "USDT", label: "USDT" },
    { value: "BTC", label: "BTC" },
    { value: "USDC", label: "USDC" },
  ]

  const sortOptions: SortOption[] = [
    { label: "Date (Newest)", value: "date", order: "desc" },
    { label: "Date (Oldest)", value: "date", order: "asc" },
    { label: "Amount (High to Low)", value: "amount", order: "desc" },
    { label: "Amount (Low to High)", value: "amount", order: "asc" },
    { label: "Status (A-Z)", value: "status", order: "asc" },
    { label: "Status (Z-A)", value: "status", order: "desc" },
  ]

  // Filter handlers
  const handleFilterChange = (key: keyof DashboardFilters, value: string | number | boolean | undefined) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }))
  }

  const handleSortChange = (option: SortOption) => {
    setLocalFilters((prev) => ({
      ...prev,
      sortBy: option.value,
      sortOrder: option.order,
    }))
  }

  const applyFilters = () => {
    setAppliedFilters({
      status: localFilters.status,
      paymentSource: localFilters.paymentSource,
      assetType: localFilters.assetType,
      minAmount: localFilters.minAmount,
      maxAmount: localFilters.maxAmount,
      dateFrom: localFilters.dateFrom,
      dateTo: localFilters.dateTo,
      sortBy: localFilters.sortBy || undefined,
      sortOrder: localFilters.sortBy ? localFilters.sortOrder : undefined,
    })
  }

  const resetFilters = () => {
    setLocalFilters({
      status: undefined,
      paymentSource: undefined,
      assetType: undefined,
      minAmount: undefined,
      maxAmount: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      sortBy: "",
      sortOrder: "asc",
    })
    setAppliedFilters({
      status: undefined,
      paymentSource: undefined,
      assetType: undefined,
      minAmount: undefined,
      maxAmount: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      sortBy: undefined,
      sortOrder: undefined,
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (appliedFilters.status) count++
    if (appliedFilters.paymentSource) count++
    if (appliedFilters.assetType) count++
    if (appliedFilters.minAmount) count++
    if (appliedFilters.maxAmount) count++
    if (appliedFilters.dateFrom) count++
    if (appliedFilters.dateTo) count++
    if (appliedFilters.sortBy) count++
    return count
  }

  // Filter and sort transactions
  const getFilteredTransactions = () => {
    let filtered = [...mockTransactions]

    // Apply status filter
    if (appliedFilters.status) {
      filtered = filtered.filter((transaction) => transaction.status === appliedFilters.status)
    }

    // Apply payment source filter
    if (appliedFilters.paymentSource) {
      filtered = filtered.filter((transaction) => transaction.paymentSource === appliedFilters.paymentSource)
    }

    // Apply asset type filter
    if (appliedFilters.assetType) {
      filtered = filtered.filter((transaction) => transaction.assetPaid === appliedFilters.assetType)
    }

    // Apply amount range filter
    if (appliedFilters.minAmount !== undefined) {
      filtered = filtered.filter((transaction) => transaction.amount >= appliedFilters.minAmount!)
    }

    if (appliedFilters.maxAmount !== undefined) {
      filtered = filtered.filter((transaction) => transaction.amount <= appliedFilters.maxAmount!)
    }

    // Apply date range filter
    if (appliedFilters.dateFrom) {
      const fromDate = new Date(appliedFilters.dateFrom)
      filtered = filtered.filter((transaction) => new Date(transaction.date) >= fromDate)
    }

    if (appliedFilters.dateTo) {
      const toDate = new Date(appliedFilters.dateTo)
      toDate.setHours(23, 59, 59, 999) // End of day
      filtered = filtered.filter((transaction) => new Date(transaction.date) <= toDate)
    }

    // Apply sorting
    if (appliedFilters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any

        if (appliedFilters.sortBy === "date") {
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
        } else if (appliedFilters.sortBy === "amount") {
          aValue = a.amount
          bValue = b.amount
        } else if (appliedFilters.sortBy === "status") {
          aValue = a.status
          bValue = b.status
        }

        if (appliedFilters.sortOrder === "asc") {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    }

    return filtered
  }

  const filteredTransactions = getFilteredTransactions()

  const toggleActivities = () => {
    setShowActivities(!showActivities)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "successful":
        return "text-green-600 bg-green-100"
      case "confirming":
        return "text-yellow-600 bg-yellow-100"
      case "expired":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case "successful":
        return "bg-green-600"
      case "confirming":
        return "bg-yellow-600"
      case "expired":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getAssetIcon = (asset: string) => {
    switch (asset) {
      case "USDT":
        return <USDTIcon size={28} className="mr-2" />
      case "BTC":
        return <BTCIcon size={28} className="mr-2" />
      case "USDC":
        return <USDCIcon size={28} className="mr-2" />
      default:
        return <div className="mr-2 size-7  rounded-full bg-gray-300"></div>
    }
  }

  const getPaymentSourceIcon = (source: string) => {
    switch (source) {
      case "Payment Link":
        return (
          <div className="mr-2 flex size-7  items-center justify-center rounded-full bg-blue-100">
            <svg className="size-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
        )
      case "Static QR":
        return (
          <div className="mr-2 flex size-7  items-center justify-center rounded-full bg-purple-100">
            <svg className="size-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
              />
            </svg>
          </div>
        )
      default:
        return <div className="mr-2 size-7  rounded-full bg-gray-300"></div>
    }
  }

  const Card = ({
    children,
    className = "",
    title,
    icon,
    trend,
  }: {
    children: React.ReactNode
    className?: string
    title?: string
    icon?: React.ReactNode
    trend?: { value: string; positive: boolean }
  }) => (
    <div className={`rounded-xl border-[] bg-[#FFFFFF] p-6 shadow-sm transition-all hover:shadow-md ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      {children}
      {trend && (
        <div className={`mt-2 text-sm ${trend.positive ? "text-green-500" : "text-red-500"}`}>
          {trend.positive ? "↑" : "↓"} {trend.value}
        </div>
      )}
    </div>
  )

  const Metric = ({ children, size = "lg" }: { children: React.ReactNode; size?: "sm" | "lg" }) => (
    <p className={`flex items-end gap-2 font-bold text-gray-900 ${size === "lg" ? "text-3xl" : "text-2xl"}`}>
      {children}
    </p>
  )

  const Text = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <p className={`text-sm font-medium text-gray-500 ${className}`}>{children}</p>
  )

  const TrendIndicator = ({ value, positive }: { value: string; positive: boolean }) => (
    <span className={`inline-flex items-center ${positive ? "text-green-500" : "text-red-500"}`}>
      {positive ? (
        <svg className="mr-1 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      ) : (
        <svg className="mr-1 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
      {value}
    </span>
  )

  const TimeFilterButton = ({ filter, label }: { filter: TimeFilter; label: string }) => (
    <button
      onClick={() => handleTimeFilterChange(filter)}
      className={`flex items-center justify-center rounded-md px-3 py-1 pt-2 text-sm font-medium ${
        timeFilter === filter ? "bg-[#1447E6] text-[#FFFFFF]" : "text-gray-500 hover:bg-[#D8D6F5] hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  )

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

          <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
            {/* Simplified Wallet Header for Mobile */}
            <div className="mb-6 lg:hidden">
              <div className="mb-4">
                <h1 className="text-xl font-semibold text-gray-900">Welcome, John Doe</h1>
                <p className="text-sm text-gray-500">Customer Wallet</p>
              </div>
            </div>

            {/* Customer Wallet Card - Mobile Optimized */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 sm:h-12 sm:w-12">
                    <svg
                      className="size-5  text-white sm:h-6 sm:w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Customer Wallet</h3>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      Manage your account balance and transactions
                    </p>
                    <p className="text-xs text-gray-500 sm:hidden">Balance & Transactions</p>
                  </div>
                </div>
                <ButtonModule
                  size="sm"
                  variant="primary"
                  onClick={() => setWithdrawModalOpen(true)}
                  className="sm:size-md"
                >
                  Withdraw Fund
                </ButtonModule>
              </div>

              {/* Balance Display - Mobile Optimized */}
              <div className="mb-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
                <div className="text-center">
                  <p className="mb-1 text-sm font-medium text-gray-500">Available Balance</p>
                  <p className="text-3xl font-bold text-gray-900 sm:text-4xl">₦12,500.00</p>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <div className="size-2  rounded-full bg-green-500"></div>
                    <p className="text-xs text-green-600">+2.5% from last month</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats - Mobile Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {/* Pending Transactions */}
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="mb-1 text-xs font-medium text-gray-500 sm:text-sm">Pending</p>
                  <p className="text-lg font-bold text-gray-900 sm:text-xl">3</p>
                  <p className="mt-1 text-xs text-amber-600">Awaiting confirmation</p>
                </div>

                {/* Wallet Status */}
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="mb-1 text-xs font-medium text-gray-500 sm:text-sm">Status</p>
                  <div className="flex items-center gap-2">
                    <div className="size-2  rounded-full bg-green-500"></div>
                    <p className="text-lg font-bold text-gray-900 sm:text-xl">Active</p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">All systems operational</p>
                </div>

                {/* Last Updated - Mobile only */}
                <div className="col-span-2 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:col-span-1">
                  <p className="mb-1 text-xs font-medium text-gray-500 sm:text-sm">Last updated</p>
                  <div className="flex items-center gap-2">
                    <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-900">2 mins ago</p>
                  </div>
                  <button
                    onClick={() => router.push("/customer-portal/wallet/transactions")}
                    className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 sm:text-sm"
                  >
                    View History →
                  </button>
                </div>
              </div>
            </div>

            {/* Wallet Metrics - Mobile Optimized */}
            <div className="my-6">
              <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
                <h3 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg">Wallet Overview</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Total Wallet Balance */}
                  <div className="rounded-lg border border-gray-100 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 sm:h-10 sm:w-10">
                        <svg
                          className="size-4 text-blue-600 sm:h-5 sm:w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 11l5-5m0 0l5 5m-5-5v12"
                          />
                        </svg>
                        <span className="text-xs font-medium sm:text-sm">12.5%</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 className="text-xs font-medium text-gray-500 sm:text-sm">Total Balance</h3>
                      {isLoading ? (
                        <div className="mt-2 h-6 w-24 animate-pulse rounded bg-gray-200 sm:h-8 sm:w-32"></div>
                      ) : (
                        <p className="mt-1 text-xl font-semibold text-gray-900 sm:text-2xl">
                          {selectedCurrencySymbol}
                          {utilityData.availableBalance.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pending Deposits */}
                  <div className="rounded-lg border border-gray-100 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-yellow-100 sm:h-10 sm:w-10">
                        <svg
                          className="size-4 text-yellow-600 sm:h-5 sm:w-5"
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
                      <div className="flex items-center gap-1 text-red-600">
                        <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 13l-5 5m0 0l-5-5m5 5V6"
                          />
                        </svg>
                        <span className="text-xs font-medium sm:text-sm">8.2%</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 className="text-xs font-medium text-gray-500 sm:text-sm">Pending Deposits</h3>
                      {isLoading ? (
                        <div className="mt-2 h-6 w-24 animate-pulse rounded bg-gray-200 sm:h-8 sm:w-32"></div>
                      ) : (
                        <p className="mt-1 text-xl font-semibold text-gray-900 sm:text-2xl">
                          {selectedCurrencySymbol}
                          {utilityData.pendingConfirmations.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Today's Transactions */}
                  <div className="rounded-lg border border-gray-100 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-green-100 sm:h-10 sm:w-10">
                        <svg
                          className="size-4 text-green-600 sm:h-5 sm:w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 11l5-5m0 0l5 5m-5-5v12"
                          />
                        </svg>
                        <span className="text-xs font-medium sm:text-sm">15.3%</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 className="text-xs font-medium text-gray-500 sm:text-sm">Today&apos;s Transactions</h3>
                      {isLoading ? (
                        <div className="mt-2 h-6 w-24 animate-pulse rounded bg-gray-200 sm:h-8 sm:w-32"></div>
                      ) : (
                        <p className="mt-1 text-xl font-semibold text-gray-900 sm:text-2xl">
                          {selectedCurrencySymbol}
                          {utilityData.settledToday.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Withdrawal Limit */}
                  <div className="rounded-lg border border-gray-100 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-purple-100 sm:h-10 sm:w-10">
                        <svg
                          className="size-4 text-purple-600 sm:h-5 sm:w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 className="text-xs font-medium text-gray-500 sm:text-sm">Withdrawal Limit</h3>
                      {isLoading ? (
                        <div className="mt-2 h-6 w-24 animate-pulse rounded bg-gray-200 sm:h-8 sm:w-32"></div>
                      ) : (
                        <p className="mt-1 text-xl font-semibold text-gray-900 sm:text-2xl">
                          {selectedCurrencySymbol}10,000,000
                        </p>
                      )}
                      <div className="mt-2">
                        <div className="h-1 w-full rounded-full bg-gray-200">
                          <div className="h-1 w-1/4 rounded-full bg-purple-600"></div>
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-gray-500">
                          <span>Daily used</span>
                          <span>{selectedCurrencySymbol}2,500,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities - Mobile Optimized */}
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900 sm:text-lg">Recent Activities</h2>
                <div className="flex items-center gap-2">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs hover:bg-gray-50 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
                  >
                    <Filter className="size-3 sm:size-4" />
                    <span className="hidden sm:inline">Filters</span>
                    {getActiveFilterCount() > 0 && (
                      <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-xs text-white">
                        {getActiveFilterCount()}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white">
                {!showActivities ? (
                  // Empty State
                  <div className="p-6 text-center sm:p-8">
                    <div className="mx-auto flex items-center justify-center">
                      <Image
                        src="/ultra-pay/empty-activity.svg"
                        alt="Empty Activity"
                        width={50}
                        height={50}
                        className="sm:h-16 sm:w-16"
                      />
                    </div>
                    <h3 className="mt-3 text-sm font-medium text-gray-900 sm:mt-4 sm:text-base">No activities yet</h3>
                    <p className="mt-1 text-xs text-gray-500 sm:mt-2 sm:text-sm">
                      Your recent payment activities will appear here.
                    </p>
                    <div className="mt-4">
                      <button
                        onClick={toggleActivities}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 sm:px-4 sm:py-2 sm:text-sm"
                      >
                        Simulate Activities
                      </button>
                    </div>
                  </div>
                ) : (
                  // Transaction State - Mobile List View
                  <div className="divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <div key={transaction.id} className="p-4 hover:bg-gray-50 sm:p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {getAssetIcon(transaction.assetPaid)}
                              <div>
                                <div className="text-sm font-medium text-gray-900">{transaction.reference}</div>
                                <div className="mt-1 flex items-center gap-2">
                                  {getPaymentSourceIcon(transaction.paymentSource)}
                                  <span className="text-xs text-gray-500">{transaction.paymentSource}</span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-xs text-gray-500">Amount</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {selectedCurrencySymbol}
                                  {transaction.amount.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {transaction.assetQuantity} {transaction.assetPaid}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Date</p>
                                <p className="text-sm font-medium text-gray-900">{formatDate(transaction.date)}</p>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex flex-col items-end">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${getStatusColor(
                                transaction.status
                              )}`}
                            >
                              <div
                                className={`mr-1 size-2  rounded-full ${getStatusDotColor(transaction.status)}`}
                              ></div>
                              {transaction.status}
                            </span>
                            <button
                              onClick={() => handleViewTransaction(transaction)}
                              className="mt-2 text-xs text-blue-600 hover:text-blue-900 sm:text-sm"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Filters Sidebar (2xl and above) - Separate Container */}
        <DesktopFiltersSidebar
          showDesktopFilters={showDesktopFilters}
          localFilters={localFilters}
          handleFilterChange={handleFilterChange}
          handleSortChange={handleSortChange}
          applyFilters={applyFilters}
          resetFilters={resetFilters}
          getActiveFilterCount={getActiveFilterCount}
          statusOptions={statusOptions}
          paymentSourceOptions={paymentSourceOptions}
          assetTypeOptions={assetTypeOptions}
          sortOptions={sortOptions}
          isSortExpanded={isSortExpanded}
          setIsSortExpanded={setIsSortExpanded}
        />
      </div>

      {/* Mobile Filter Sidebar */}
      <MobileFilterSidebar
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        localFilters={localFilters}
        handleFilterChange={handleFilterChange}
        handleSortChange={handleSortChange}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
        getActiveFilterCount={getActiveFilterCount}
        statusOptions={statusOptions}
        paymentSourceOptions={paymentSourceOptions}
        assetTypeOptions={assetTypeOptions}
        sortOptions={sortOptions}
        isSortExpanded={isSortExpanded}
        setIsSortExpanded={setIsSortExpanded}
      />

      <TransactionDetailsModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        transaction={selectedTransaction}
      />

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onRequestClose={() => setWithdrawModalOpen(false)}
        onWithdraw={handleWithdraw}
        loading={isWithdrawLoading}
        currentBalance={12500}
      />
    </section>
  )
}
