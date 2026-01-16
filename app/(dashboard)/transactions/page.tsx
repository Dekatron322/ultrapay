"use client"

import DashboardNav from "components/Navbar/DashboardNav"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { USDTIcon, USDCIcon, BTCIcon } from "components/Icons/LogoIcons"
import Image from "next/image"
import TransactionDetailsModal from "components/ui/Modal/transaction-details-modal"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ChevronDown, ChevronUp, Filter, SortAsc, SortDesc, X, Eye } from "lucide-react"
import React from "react"

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

// Transaction interface
interface Transaction {
  id: number
  reference: string
  paymentSource: string
  assetPaid: string
  amount: number
  assetQuantity: number
  status: "successful" | "confirming" | "expired"
  date: string
  customerName?: string
  customerEmail?: string
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
  // Accordion state for each filter section
  const [expandedSections, setExpandedSections] = useState({
    status: true,
    paymentSource: true,
    assetType: true,
    amountRange: true,
    dateRange: true,
    sortBy: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }
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
                  <button
                    type="button"
                    onClick={() => toggleSection("status")}
                    className="mb-1.5 flex w-full items-center justify-between text-xs font-medium text-gray-700 md:text-sm"
                    aria-expanded={expandedSections.status}
                  >
                    <span>Status</span>
                    {expandedSections.status ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </button>
                  {expandedSections.status && (
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
                  )}
                </div>

                {/* Payment Source Filter */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection("paymentSource")}
                    className="mb-1.5 flex w-full items-center justify-between text-xs font-medium text-gray-700 md:text-sm"
                    aria-expanded={expandedSections.paymentSource}
                  >
                    <span>Payment Source</span>
                    {expandedSections.paymentSource ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </button>
                  {expandedSections.paymentSource && (
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
                  )}
                </div>

                {/* Asset Type Filter */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection("assetType")}
                    className="mb-1.5 flex w-full items-center justify-between text-xs font-medium text-gray-700 md:text-sm"
                    aria-expanded={expandedSections.assetType}
                  >
                    <span>Asset Type</span>
                    {expandedSections.assetType ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </button>
                  {expandedSections.assetType && (
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
                  )}
                </div>

                {/* Amount Range */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection("amountRange")}
                    className="mb-1.5 flex w-full items-center justify-between text-xs font-medium text-gray-700 md:text-sm"
                    aria-expanded={expandedSections.amountRange}
                  >
                    <span>Amount Range</span>
                    {expandedSections.amountRange ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </button>
                  {expandedSections.amountRange && (
                    <div className="space-y-3">
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
                    </div>
                  )}
                </div>

                {/* Date Range Filters */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection("dateRange")}
                    className="mb-1.5 flex w-full items-center justify-between text-xs font-medium text-gray-700 md:text-sm"
                    aria-expanded={expandedSections.dateRange}
                  >
                    <span>Date Range</span>
                    {expandedSections.dateRange ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </button>
                  {expandedSections.dateRange && (
                    <div className="space-y-3">
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
                    </div>
                  )}
                </div>

                {/* Sort Options */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection("sortBy")}
                    className="mb-1.5 flex w-full items-center justify-between text-xs font-medium text-gray-700 md:text-sm"
                    aria-expanded={expandedSections.sortBy}
                  >
                    <span>Sort By</span>
                    {expandedSections.sortBy ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </button>
                  {expandedSections.sortBy && (
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

// Transaction Table Component
const TransactionTable = ({
  transactions,
  onView,
  selectedCurrencySymbol,
  isLoading,
}: {
  transactions: Transaction[]
  onView: (transaction: Transaction) => void
  selectedCurrencySymbol: string
  isLoading: boolean
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }
  const getAssetIcon = (asset: string) => {
    switch (asset) {
      case "USDT":
        return <USDTIcon size={24} className="mr-2" />
      case "BTC":
        return <BTCIcon size={24} className="mr-2" />
      case "USDC":
        return <USDCIcon size={24} className="mr-2" />
      default:
        return <div className="mr-2 h-6 w-6 rounded-full bg-gray-200"></div>
    }
  }

  const getPaymentSourceIcon = (source: string) => {
    switch (source) {
      case "Payment Link":
        return (
          <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
            <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        return <div className="mr-2 h-8 w-8 rounded-lg bg-gray-100"></div>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "successful":
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
            <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-600"></div>
            Successful
          </span>
        )
      case "confirming":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700">
            <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-yellow-600"></div>
            Confirming
          </span>
        )
      case "expired":
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
            <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-600"></div>
            Expired
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
            <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-gray-600"></div>
            Unknown
          </span>
        )
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                <div className="h-3 w-24 animate-pulse rounded bg-gray-200"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                <div className="h-3 w-20 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Desktop Table View */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Date & Time
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Reference
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Payment Source
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Asset Paid
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="transition-colors duration-150 hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-2">
                  <div className="text-sm text-gray-900">{formatDate(transaction.date)}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-2">
                  <div className="text-sm font-medium text-gray-900">{transaction.reference}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-2">
                  <div className="flex items-center">
                    {getPaymentSourceIcon(transaction.paymentSource)}
                    <span className="text-sm text-gray-900">{transaction.paymentSource}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-2">
                  <div className="flex items-center">
                    {getAssetIcon(transaction.assetPaid)}
                    <span className="text-sm text-gray-900">{transaction.assetPaid}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-2">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {selectedCurrencySymbol}
                      {transaction.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {transaction.assetQuantity} {transaction.assetPaid}
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-2">{getStatusBadge(transaction.status)}</td>
                <td className="whitespace-nowrap px-6 py-2">
                  <button
                    onClick={() => onView(transaction)}
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-900"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Table View */}
      <div className="block w-full overflow-x-auto lg:hidden">
        <div className="min-w-full">
          <table className="w-full divide-y divide-gray-200">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Ref
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Source
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Asset
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {transactions.map((transaction) => (
                <React.Fragment key={transaction.id}>
                  <tr
                    className="cursor-pointer transition-colors duration-150 hover:bg-gray-50"
                    onClick={() => toggleRow(transaction.id)}
                  >
                    <td className="whitespace-nowrap px-2 py-3">
                      <div className="text-xs text-gray-900">
                        {new Date(transaction.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-2 py-3">
                      <div className="max-w-[70px] truncate text-xs font-medium text-gray-900">
                        {transaction.reference}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-2 py-3">
                      <div className="flex items-center">
                        <div className="mr-1 flex h-5 w-5 items-center justify-center rounded-lg bg-blue-100">
                          <svg
                            className="h-2.5 w-2.5 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                          </svg>
                        </div>
                        <span className="text-xs text-gray-900">{transaction.paymentSource}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-2 py-3">
                      <div className="flex items-center">
                        <div className="mr-1">{getAssetIcon(transaction.assetPaid)}</div>
                        <span className="text-xs text-gray-900">{transaction.assetPaid}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-2 py-3">
                      <div>
                        <div className="text-xs font-medium text-gray-900">
                          {selectedCurrencySymbol}
                          {transaction.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.assetQuantity} {transaction.assetPaid}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-2 py-3">{getStatusBadge(transaction.status)}</td>
                    <td className="whitespace-nowrap px-2 py-3">
                      <div className="flex items-center gap-1">
                        {expandedRows.has(transaction.id) ? (
                          <ChevronUp className="h-3 w-3 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-3 w-3 text-gray-500" />
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Accordion Details Row */}
                  {expandedRows.has(transaction.id) && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-4 py-2">
                        <div className="space-y-3">
                          {/* Transaction Details */}
                          <div className="grid grid-cols-1 gap-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Transaction ID:</span>
                              <span className="font-medium text-gray-900">{transaction.reference}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Payment Source:</span>
                              <span className="font-medium text-gray-900">{transaction.paymentSource}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Asset Paid:</span>
                              <span className="font-medium text-gray-900">{transaction.assetPaid}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Amount:</span>
                              <span className="font-medium text-gray-900">
                                {selectedCurrencySymbol}
                                {transaction.amount.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Asset Quantity:</span>
                              <span className="font-medium text-gray-900">
                                {transaction.assetQuantity} {transaction.assetPaid}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Status:</span>
                              <div>{getStatusBadge(transaction.status)}</div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Date:</span>
                              <span className="font-medium text-gray-900">
                                {new Date(transaction.date).toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            {transaction.customerName && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">Customer Name:</span>
                                <span className="font-medium text-gray-900">{transaction.customerName}</span>
                              </div>
                            )}
                            {transaction.customerEmail && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">Customer Email:</span>
                                <span className="max-w-[200px] truncate text-xs font-medium text-gray-900">
                                  {transaction.customerEmail}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 border-t border-gray-200 pt-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onView(transaction)
                              }}
                              className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                            >
                              <Eye className="h-3 w-3" />
                              View Details
                            </button>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326"
                                />
                              </svg>
                              Share
                            </button>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              Download
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {transactions.length === 0 && (
        <div className="p-8 text-center">
          <div className="mx-auto flex items-center justify-center">
            <Image src="/ultra-pay/empty-activity.svg" alt="No transactions" width={80} height={80} />
          </div>
          <h3 className="mt-4 text-sm font-medium text-gray-900">No transactions found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your filters or wait for new transactions to appear.
          </p>
        </div>
      )}
    </div>
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

  // Enhanced mock transaction data
  const mockTransactions: Transaction[] = [
    {
      id: 1,
      reference: "TXN-001234",
      paymentSource: "Payment Link",
      assetPaid: "USDT",
      amount: 15000,
      assetQuantity: 15000,
      status: "successful",
      date: "2024-01-09T10:30:00Z",
      customerName: "John Doe",
      customerEmail: "john@example.com",
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
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
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
      customerName: "Bob Johnson",
      customerEmail: "bob@example.com",
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
      customerName: "Alice Brown",
      customerEmail: "alice@example.com",
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
      customerName: "Charlie Wilson",
      customerEmail: "charlie@example.com",
    },
    {
      id: 6,
      reference: "TXN-001239",
      paymentSource: "Static QR",
      assetPaid: "USDT",
      amount: 35000,
      assetQuantity: 35000,
      status: "successful",
      date: "2024-01-08T14:20:00Z",
      customerName: "David Lee",
      customerEmail: "david@example.com",
    },
    {
      id: 7,
      reference: "TXN-001240",
      paymentSource: "Payment Link",
      assetPaid: "USDC",
      amount: 18500,
      assetQuantity: 18500,
      status: "confirming",
      date: "2024-01-08T11:45:00Z",
      customerName: "Emma Davis",
      customerEmail: "emma@example.com",
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

          <div className="mx-auto w-full px-3 py-4 2xl:container md:px-4 lg:px-6 2xl:px-16">
            <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">Dashboard Overview</h1>
                <p className="text-sm font-medium text-gray-500">
                  Monitor your payment activity, track settlement, and manage your account.
                </p>
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
                  <div className="border-gray-200 last:border-r-0 max-2xl:pb-6 max-sm:border-b max-sm:pb-4 sm:max-2xl:rounded-md sm:max-2xl:bg-[#f9f9f9] sm:max-2xl:p-4 md:pr-6  2xl:border-r">
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
                  <div className="border-gray-200 last:border-r-0 max-2xl:pb-6 max-sm:border-b max-sm:pb-4 sm:max-2xl:rounded-md sm:max-2xl:bg-[#f9f9f9] sm:max-2xl:p-4 md:pr-6  2xl:border-r">
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
                  <div className="border-gray-200 last:border-r-0 max-2xl:pb-6 max-sm:border-b max-sm:pb-4 sm:max-2xl:rounded-md sm:max-2xl:bg-[#f9f9f9] sm:max-2xl:p-4 md:pr-6  2xl:border-r">
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

            {/* Recent Activities */}
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
                <div className="flex items-center gap-3">
                  {/* Filter Button for ALL screens up to 2xl */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 2xl:hidden"
                  >
                    <Filter className="size-4" />
                    Filters
                    {getActiveFilterCount() > 0 && (
                      <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-xs text-white">
                        {getActiveFilterCount()}
                      </span>
                    )}
                  </button>

                  {/* Active filters badge - Desktop only (2xl and above) */}
                  {getActiveFilterCount() > 0 && (
                    <div className="hidden items-center gap-2 2xl:flex">
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        {getActiveFilterCount()} active filter{getActiveFilterCount() !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}

                  {/* Hide/Show Filters button - Desktop only (2xl and above) */}
                  <button
                    type="button"
                    onClick={() => setShowDesktopFilters((prev) => !prev)}
                    className="hidden items-center gap-1 whitespace-nowrap rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 sm:px-4 2xl:flex"
                  >
                    {showDesktopFilters ? <X className="size-4" /> : <Filter className="size-4" />}
                    {showDesktopFilters ? "Hide filters" : "Show filters"}
                  </button>

                  <button className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Export
                  </button>
                </div>
              </div>

              {!showActivities ? (
                // Empty State
                <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                  <div className="mx-auto flex items-center justify-center">
                    <Image src="/ultra-pay/empty-activity.svg" alt="Empty Activity" width={80} height={80} />
                  </div>
                  <h3 className="mt-4 text-sm font-medium text-gray-900">No activities yet</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Your recent payment activities will appear here once you start receiving payments.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={toggleActivities}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      Simulate Activities
                    </button>
                  </div>
                </div>
              ) : (
                // Transaction Table
                <>
                  <TransactionTable
                    transactions={filteredTransactions}
                    onView={handleViewTransaction}
                    selectedCurrencySymbol={selectedCurrencySymbol}
                    isLoading={isLoading}
                  />

                  {/* Pagination */}
                  {filteredTransactions.length > 0 && (
                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                      <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to{" "}
                        <span className="font-medium">{filteredTransactions.length}</span> of{" "}
                        <span className="font-medium">{mockTransactions.length}</span> results
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          disabled
                          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-400"
                        >
                          Previous
                        </button>
                        <button className="rounded-md border border-blue-600 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600">
                          1
                        </button>
                        <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                          2
                        </button>
                        <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                          3
                        </button>
                        <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <button onClick={toggleActivities} className="text-sm text-blue-600 hover:text-blue-700">
                      Clear Activities
                    </button>
                  </div>
                </>
              )}
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
    </section>
  )
}
