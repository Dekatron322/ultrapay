"use client"

import DashboardNav from "components/Navbar/DashboardNav"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { USDTIcon, USDCIcon, BTCIcon } from "components/Icons/LogoIcons"
import Image from "next/image"
import PaymentDetailsModal from "components/ui/Modal/payment-details-modal"
import DeletePaymentModal from "components/ui/Modal/delete-payment-modal"
import PausePlayPaymentModal from "components/ui/Modal/pause-play-payment-modal"
import CreatePaymentModal from "components/ui/Modal/create-payment-modal"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Filter,
  SortAsc,
  SortDesc,
  X,
  Eye,
  Copy,
  Play,
  Pause,
  Trash2,
} from "lucide-react"
import { ButtonModule } from "components/ui/Button/Button"
import { AddIcon } from "components/Icons/Icons"
import { VscAdd, VscEye, VscCopy, VscDebugStart, VscDebugPause, VscTrash, VscCheck } from "react-icons/vsc"

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

// Payment interface
interface Payment {
  id: number
  type: "Static QR" | "Dynamic QR" | "Link" | "API"
  label: string
  amount: string
  status: "Active" | "Completed" | "Awaiting"
  created: string
  lastActivity: string
  totalReceived?: number
  successfulPayments?: number
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

// Redesigned Payment Table Component
const PaymentTable = ({
  payments,
  onView,
  onCopy,
  onToggle,
  onDelete,
  copiedPaymentId,
}: {
  payments: Payment[]
  onView: (payment: Payment) => void
  onCopy: (payment: Payment) => void
  onToggle: (payment: Payment) => void
  onDelete: (payment: Payment) => void
  copiedPaymentId: number | null
}) => {
  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
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
      case "Dynamic QR":
        return (
          <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        )
      case "Link":
        return (
          <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
        )
      case "API":
        return (
          <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
            <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>
        )
      default:
        return <div className="mr-2 h-8 w-8 rounded-lg bg-gray-100"></div>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
            <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-600"></div>
            Active
          </span>
        )
      case "Completed":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-600"></div>
            Completed
          </span>
        )
      case "Awaiting":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700">
            <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-yellow-600"></div>
            Awaiting
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

  const getAmountTypeBadge = (amount: string) => {
    const isFlexible = amount === "Flexible"
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
          isFlexible ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"
        }`}
      >
        {amount}
      </span>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border-gray-200 bg-white sm:border">
      {/* Desktop Table View */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Label/Reference
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
                Created
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Last Activity
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
            {payments.map((payment) => (
              <tr key={payment.id} className="transition-colors duration-150 hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-2">
                  <div className="flex items-center">
                    {getPaymentTypeIcon(payment.type)}
                    <span className="text-sm font-medium text-gray-900">{payment.type}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-2">
                  <div className="text-sm font-medium text-gray-900">{payment.label}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-2">
                  <div>{getAmountTypeBadge(payment.amount)}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-2">{getPaymentStatusBadge(payment.status)}</td>
                <td className="whitespace-nowrap px-6 py-2 text-sm text-gray-500">{payment.created}</td>
                <td className="whitespace-nowrap px-6 py-2 text-sm text-gray-500">{payment.lastActivity}</td>
                <td className="whitespace-nowrap px-6 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(payment)}
                      className="rounded-lg p-1.5 text-blue-600 transition-colors hover:bg-blue-50"
                      title="View details"
                    >
                      <VscEye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onCopy(payment)}
                      className="rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-gray-50"
                      title="Copy reference"
                    >
                      {copiedPaymentId === payment.id ? (
                        <VscCheck className="h-4 w-4 text-green-500" />
                      ) : (
                        <VscCopy className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onToggle(payment)}
                      className={`rounded-lg p-1.5 transition-colors ${
                        payment.status === "Active"
                          ? "text-yellow-600 hover:bg-yellow-50"
                          : "text-green-600 hover:bg-green-50"
                      }`}
                      title={payment.status === "Active" ? "Pause payment" : "Activate payment"}
                    >
                      {payment.status === "Active" ? (
                        <VscDebugPause className="h-4 w-4" />
                      ) : (
                        <VscDebugStart className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onDelete(payment)}
                      className="rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-50"
                      title="Delete payment"
                    >
                      <VscTrash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-4 lg:hidden">
        {payments.map((payment) => (
          <div key={payment.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                {getPaymentTypeIcon(payment.type)}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{payment.type}</h3>
                  <p className="text-xs text-gray-500">{payment.label}</p>
                </div>
              </div>
              {getPaymentStatusBadge(payment.status)}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-sm font-medium text-gray-900">{payment.amount}</p>
                <div className="mt-1">{getAmountTypeBadge(payment.amount)}</div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm font-medium text-gray-900">{payment.created}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Activity</p>
                <p className="text-sm font-medium text-gray-900">{payment.lastActivity}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <button
                onClick={() => onView(payment)}
                className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50"
                title="View details"
              >
                <VscEye className="h-4 w-4" />
              </button>
              <button
                onClick={() => onCopy(payment)}
                className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-50"
                title="Copy reference"
              >
                {copiedPaymentId === payment.id ? (
                  <VscCheck className="h-4 w-4 text-green-500" />
                ) : (
                  <VscCopy className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => onToggle(payment)}
                className={`rounded-lg p-1.5 ${
                  payment.status === "Active"
                    ? "text-yellow-600 hover:bg-yellow-50"
                    : "text-green-600 hover:bg-green-50"
                }`}
                title={payment.status === "Active" ? "Pause payment" : "Activate payment"}
              >
                {payment.status === "Active" ? (
                  <VscDebugPause className="h-4 w-4" />
                ) : (
                  <VscDebugStart className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => onDelete(payment)}
                className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                title="Delete payment"
              >
                <VscTrash className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {payments.length === 0 && (
        <div className="p-8 text-center">
          <div className="mx-auto flex items-center justify-center">
            <Image src="/ultra-pay/empty-transaction.svg" alt="No payments" width={80} height={80} />
          </div>
          <h3 className="mt-4 text-sm font-medium text-gray-900">No payments found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your filters or create a new payment to get started.
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isPausePlayModalOpen, setIsPausePlayModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [pausePlayAction, setPausePlayAction] = useState<"pause" | "play">("pause")
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [pausePlayLoading, setPausePlayLoading] = useState(false)
  const [copiedPaymentId, setCopiedPaymentId] = useState<number | null>(null)
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

  const handleViewPayment = (payment: any) => {
    setSelectedTransaction(payment)
    setIsModalOpen(true)
  }

  const handleCopyPayment = (payment: any) => {
    navigator.clipboard.writeText(payment.label)
    setCopiedPaymentId(payment.id)
    setTimeout(() => setCopiedPaymentId(null), 2000)
  }

  const handleTogglePayment = (payment: any) => {
    setSelectedPayment(payment)
    setPausePlayAction(payment.status === "Active" ? "pause" : "play")
    setIsPausePlayModalOpen(true)
  }

  const handleConfirmPausePlay = async () => {
    setPausePlayLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log(`${pausePlayAction} payment:`, selectedPayment?.id)
      setIsPausePlayModalOpen(false)
      setSelectedPayment(null)
      // Could add toast notification here
    } catch (error) {
      console.error(`Error ${pausePlayAction}ing payment:`, error)
    } finally {
      setPausePlayLoading(false)
    }
  }

  const handleClosePausePlayModal = () => {
    setIsPausePlayModalOpen(false)
    setSelectedPayment(null)
  }

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true)
  }

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false)
  }

  const handleSelectPaymentType = (type: string) => {
    console.log("Selected payment type:", type)
    // TODO: Navigate to payment creation form based on type
    // Could add navigation logic here
  }

  const handleDeletePayment = (payment: any) => {
    setSelectedPayment(payment)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    setDeleteLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Deleted payment:", selectedPayment?.id)
      setIsDeleteModalOpen(false)
      setSelectedPayment(null)
      // Could add toast notification here
    } catch (error) {
      console.error("Error deleting payment:", error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedPayment(null)
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
      totalRevenue: Math.floor(25000000 + Math.random() * 5000000) * baseMultiplier,
      collectionEfficiency: 85 + Math.random() * 10,
      outstandingArrears: Math.floor(45000000 + Math.random() * 5000000),
      todaysCollection: Math.floor(1500000 + Math.random() * 500000),
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

  // Enhanced mock payment data
  const mockPayments: Payment[] = [
    {
      id: 1,
      type: "Static QR",
      label: "In-store Counter",
      amount: "Flexible",
      status: "Active",
      created: "Oct 12, 2025",
      lastActivity: "2 hours ago",
      totalReceived: 24500,
      successfulPayments: 42,
    },
    {
      id: 2,
      type: "Dynamic QR",
      label: "INV-20931",
      amount: "₦45,000",
      status: "Completed",
      created: "Oct 12, 2025",
      lastActivity: "1 day ago",
      totalReceived: 45000,
      successfulPayments: 1,
    },
    {
      id: 3,
      type: "Link",
      label: "October Subscription",
      amount: "Fixed ₦10,000",
      status: "Active",
      created: "Oct 12, 2025",
      lastActivity: "3 hours ago",
      totalReceived: 100000,
      successfulPayments: 10,
    },
    {
      id: 4,
      type: "API",
      label: "intent_7gH29",
      amount: "₦120,000",
      status: "Awaiting",
      created: "Oct 12, 2025",
      lastActivity: "-",
      totalReceived: 0,
      successfulPayments: 0,
    },
    {
      id: 5,
      type: "Static QR",
      label: "Website Payment",
      amount: "Flexible",
      status: "Active",
      created: "Oct 11, 2025",
      lastActivity: "5 hours ago",
      totalReceived: 178500,
      successfulPayments: 89,
    },
    {
      id: 6,
      type: "Dynamic QR",
      label: "INV-20932",
      amount: "₦75,000",
      status: "Completed",
      created: "Oct 10, 2025",
      lastActivity: "2 days ago",
      totalReceived: 75000,
      successfulPayments: 1,
    },
  ]

  // Filter options
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Completed", label: "Completed" },
    { value: "Awaiting", label: "Awaiting" },
  ]

  const paymentSourceOptions = [
    { value: "", label: "All Types" },
    { value: "Static QR", label: "Static QR" },
    { value: "Dynamic QR", label: "Dynamic QR" },
    { value: "Link", label: "Link" },
    { value: "API", label: "API" },
  ]

  const assetTypeOptions = [
    { value: "", label: "All Amount Types" },
    { value: "Flexible", label: "Flexible" },
    { value: "Fixed", label: "Fixed" },
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

  // Filter and sort payments
  const getFilteredPayments = () => {
    let filtered = [...mockPayments]

    // Apply status filter
    if (appliedFilters.status) {
      filtered = filtered.filter((payment) => payment.status === appliedFilters.status)
    }

    // Apply payment type filter
    if (appliedFilters.paymentSource) {
      filtered = filtered.filter((payment) => payment.type === appliedFilters.paymentSource)
    }

    // Apply amount type filter
    if (appliedFilters.assetType) {
      filtered = filtered.filter((payment) =>
        appliedFilters.assetType === "Flexible" ? payment.amount === "Flexible" : payment.amount.includes("Fixed")
      )
    }

    // Apply sorting
    if (appliedFilters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any

        if (appliedFilters.sortBy === "date") {
          aValue = new Date(a.created).getTime()
          bValue = new Date(b.created).getTime()
        } else if (appliedFilters.sortBy === "amount") {
          // Extract numeric values for sorting
          aValue = parseInt(a.amount.replace(/[^0-9]/g, "")) || 0
          bValue = parseInt(b.amount.replace(/[^0-9]/g, "")) || 0
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

  const filteredPayments = getFilteredPayments()

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

          <div className="mx-auto px-3 py-4  2xl:container sm:px-4 lg:px-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>
                <p className="text-sm font-medium text-gray-500">
                  Create and manage payment endpoints across all channels
                </p>
              </div>
              <ButtonModule size="sm" icon={<VscAdd />} className="gap-1" onClick={handleOpenCreateModal}>
                Create Payment
              </ButtonModule>
            </div>

            {/* Summary Stats */}
            <div className="my-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="grid grid-cols-1  gap-6 md:grid-cols-2 2xl:grid-cols-4">
                  {/* Total Payments */}
                  <div className="border-gray-200 last:border-r-0 max-2xl:pb-6 max-sm:border-b max-sm:pb-4 sm:max-2xl:rounded-md sm:max-2xl:bg-[#f9f9f9] sm:max-2xl:p-4 md:pr-6  2xl:border-r">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
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
                        <span className="text-sm font-medium">12%</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500">Total Payments</h3>
                      <p className="mt-2 text-2xl font-semibold text-gray-900">{mockPayments.length}</p>
                      <div className="mt-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>This month:</span>
                          <span>{Math.floor(mockPayments.length * 0.8)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Payments */}
                  <div className="border-gray-200 pr-6 last:border-r-0 max-sm:border-b max-sm:pb-4 sm:max-2xl:rounded-md sm:max-2xl:bg-[#f9f9f9] sm:max-2xl:p-4 2xl:border-r">
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
                        <span className="text-sm font-medium">8%</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500">Active Payments</h3>
                      <p className="mt-2 text-2xl font-semibold text-gray-900">
                        {mockPayments.filter((p) => p.status === "Active").length}
                      </p>
                      <div className="mt-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Completion rate:</span>
                          <span>85%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Received */}
                  <div className="border-gray-200 pr-6 last:border-r-0 max-sm:border-b  max-sm:pb-4 sm:max-2xl:rounded-md sm:max-2xl:bg-[#f9f9f9] sm:max-2xl:p-4 2xl:border-r">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                        <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                        <span className="text-sm font-medium">24%</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500">Total Received</h3>
                      <p className="mt-2 text-2xl font-semibold text-gray-900">
                        ₦{mockPayments.reduce((sum, p) => sum + (p.totalReceived || 0), 0).toLocaleString()}
                      </p>
                      <div className="mt-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Average per payment:</span>
                          <span>
                            ₦
                            {Math.floor(
                              mockPayments.reduce((sum, p) => sum + (p.totalReceived || 0), 0) / mockPayments.length
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Successful Transactions */}
                  <div className="pr-6 last:pr-0 sm:max-2xl:rounded-md sm:max-2xl:bg-[#f9f9f9] sm:max-2xl:p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                        <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500">Successful Transactions</h3>
                      <p className="mt-2 text-2xl font-semibold text-gray-900">
                        {mockPayments.reduce((sum, p) => sum + (p.successfulPayments || 0), 0)}
                      </p>
                      <div className="mt-3 text-sm text-gray-600 sm:px-4 2xl:px-0">
                        <div className="flex justify-between">
                          <span>Success rate:</span>
                          <span>92%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Table Section */}
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Payment Endpoints</h2>
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
                </div>
              </div>

              {/* Payment Table */}
              <PaymentTable
                payments={filteredPayments}
                onView={handleViewPayment}
                onCopy={handleCopyPayment}
                onToggle={handleTogglePayment}
                onDelete={handleDeletePayment}
                copiedPaymentId={copiedPaymentId}
              />

              {/* Pagination */}
              {filteredPayments.length > 0 && (
                <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">{filteredPayments.length}</span> of{" "}
                    <span className="font-medium">{filteredPayments.length}</span> results
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

      <PaymentDetailsModal isOpen={isModalOpen} onRequestClose={handleCloseModal} payment={selectedTransaction} />

      <DeletePaymentModal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        paymentLabel={selectedPayment?.label || ""}
        paymentType={selectedPayment?.type || ""}
        paymentCreated={selectedPayment?.created || ""}
        paymentStatus={selectedPayment?.status || ""}
      />

      <PausePlayPaymentModal
        isOpen={isPausePlayModalOpen}
        onRequestClose={handleClosePausePlayModal}
        onConfirm={handleConfirmPausePlay}
        loading={pausePlayLoading}
        paymentLabel={selectedPayment?.label || ""}
        paymentType={selectedPayment?.type || ""}
        paymentCreated={selectedPayment?.created || ""}
        paymentStatus={selectedPayment?.status || ""}
        action={pausePlayAction}
      />

      <CreatePaymentModal
        isOpen={isCreateModalOpen}
        onRequestClose={handleCloseCreateModal}
        onSelectType={handleSelectPaymentType}
      />
    </section>
  )
}
