"use client"

import React, { useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { BTCIcon, USDCIcon, USDTIcon } from "components/Icons/LogoIcons"

interface Transaction {
  id: number
  reference: string
  paymentSource: string
  assetPaid: string
  amount: number
  assetQuantity: number
  status: string
  date: string
}

interface TransactionDetailsModalProps {
  isOpen: boolean
  onRequestClose: () => void
  transaction: Transaction | null
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({ isOpen, onRequestClose, transaction }) => {
  const [copied, setCopied] = useState(false)

  const handleCopyTransactionId = () => {
    // Copy to clipboard
    navigator.clipboard.writeText("txn_7f8a9b2c3d4e5")
    setCopied(true)
    // Reset back to copy icon after 2 seconds
    setTimeout(() => setCopied(false), 2000)
  }
  const getAssetIcon = (asset: string) => {
    switch (asset) {
      case "USDT":
        return <USDTIcon size={20} />
      case "USDC":
        return <USDCIcon size={20} />
      case "BTC":
        return <BTCIcon size={20} />
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-300"></div>
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!transaction) return null

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed right-0 top-0 z-[999] h-full w-full max-w-md bg-white shadow-xl outline-none"
      overlayClassName="fixed z-[998] inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Request Summary</h2>
          <div onClick={onRequestClose} className="cursor-pointer rounded-lg p-1 hover:bg-gray-100">
            <CloseIcon />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex-1 border-t border-[#E5E7EB]"></div>
            <p className="whitespace-nowrap rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1 font-medium text-gray-900">
              Request Summary
            </p>
            <div className="flex-1 border-t border-[#E5E7EB]"></div>
          </div>
          <div className="">
            <label className="block text-center text-2xl font-medium ">NGN300,000</label>
          </div>
          <div className="flex w-full items-center justify-center gap-1 text-gray-500">
            <div className="flex items-center">{getAssetIcon(transaction.assetPaid)}</div>
            <p className="text-sm font-semibold">
              {transaction.amount.toLocaleString()} {transaction.assetPaid}
            </p>
          </div>

          {/* Amount and Asset */}
          <div className="mt-1">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">Amount</label>
              </div>
              <div className="flex flex-col items-end ">
                <span className="text-sm font-medium text-gray-900">NGN300,000</span>
                <span className="text-xs font-medium text-gray-500">
                  {transaction.assetPaid} {transaction.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">Asset</label>
              </div>
              <div className="flex flex-col items-end rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-2 py-1">
                <span className="text-xs font-medium text-[#101828]">{transaction.assetPaid}</span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">Transaction ID:</label>
              </div>
              <div className="flex  items-center gap-1">
                <span className="text-sm font-medium text-[#101828]">txn_7f8a9b2c3d4e5</span>
                <div onClick={handleCopyTransactionId} className="cursor-pointer rounded p-1 hover:bg-gray-100">
                  {copied ? (
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">Reference:</label>
              </div>
              <div className="flex  items-center gap-1">
                <span className="text-sm font-medium text-[#101828]">REF-2024-001</span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">Date:</label>
              </div>
              <div className="flex  items-center gap-1">
                <span className="text-sm font-medium text-[#101828]">18/10/2023. | 12:45 pm</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-500">Status:</label>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                    transaction.status
                  )}`}
                >
                  <div
                    className={`mr-2 h-2 w-2 rounded-full ${
                      transaction.status === "successful"
                        ? "bg-green-500"
                        : transaction.status === "confirming"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">NGN Amount Credited:</label>
              </div>
              <div className="flex  items-center gap-1">
                <span className="text-sm font-medium text-[#101828]">NGN 300,000</span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">Exchange Rate:</label>
              </div>
              <div className="flex  items-center gap-1">
                <span className="text-sm font-medium text-[#101828]">1 USDT = NGN 1,490.00</span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">Settlement status</label>
              </div>
              <div className="flex  items-center gap-1">
                <span className="text-sm font-medium text-[#101828]">Pending</span>
              </div>
            </div>
          </div>

          <div className="my-4 flex items-center gap-2">
            <div className="flex-1 border-t border-[#E5E7EB]"></div>
            <p className="whitespace-nowrap rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1 font-medium text-gray-900">
              Crypto Details
            </p>
            <div className="flex-1 border-t border-[#E5E7EB]"></div>
          </div>

          {/* Payment Source */}
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">Amount:</label>
              </div>
              <div className="flex  items-center gap-1">
                <span className="text-sm font-medium text-[#101828]">
                  {transaction.assetPaid} {transaction.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">Blockchain Network:</label>
              </div>
              <div className="flex  items-center gap-1">
                <span className="text-sm font-medium text-[#101828]">Tron</span>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">Customer Wallet:</label>
              </div>
              <div className="flex  items-center gap-1">
                <span className="text-sm font-medium text-[#101828]">0x8f3e2a1b9c35Cc6623C0523243o8i</span>
                <div onClick={handleCopyTransactionId} className="cursor-pointer rounded p-1 hover:bg-gray-100">
                  {copied ? (
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">Transaction Hash:</label>
              </div>
              <div className="flex  items-center gap-1">
                <span className="text-sm font-medium text-[#101828]">ox8f3e2a1b9c35Cc6623C5232...</span>
                <div onClick={handleCopyTransactionId} className="cursor-pointer rounded p-1 hover:bg-gray-100">
                  {copied ? (
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex gap-3">
            <button
              onClick={onRequestClose}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Download Receipt
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default TransactionDetailsModal
