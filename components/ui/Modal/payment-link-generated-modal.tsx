"use client"

import React, { useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { Copy, Eye, Share2 } from "lucide-react"

interface PaymentLinkGeneratedModalProps {
  isOpen: boolean
  onRequestClose: () => void
  linkData: {
    amountType: string
    amount: string
    description: string
    referenceId: string
    expiryDate: string
  }
}

const PaymentLinkGeneratedModal: React.FC<PaymentLinkGeneratedModalProps> = ({ isOpen, onRequestClose, linkData }) => {
  const [copied, setCopied] = useState(false)

  const formattedAmount = linkData.amount ? `₦${parseFloat(linkData.amount).toLocaleString()}.00` : "Customer Enters"
  const checkoutUrl = `https://pay.ultrapay.ng/s/${linkData.referenceId}`

  const getExpiryText = () => {
    if (!linkData.expiryDate) return "No expiry"
    return new Date(linkData.expiryDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(checkoutUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    // Placeholder for share functionality
    console.log("Share payment link")
  }

  const handlePreview = () => {
    // Placeholder for preview functionality
    console.log("Preview payment link")
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-md bg-white shadow-lg outline-none md:mx-auto md:mt-20 md:w-[550px]"
      overlayClassName="fixed z-[998] inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-hidden flex items-center justify-center p-4"
    >
      <div className="flex max-h-[85vh] w-full flex-col overflow-hidden">
        <div className="flex w-full flex-shrink-0 items-center justify-between bg-[#F3F4F6] p-4 md:p-6">
          <h2 className="text-lg font-bold text-gray-900 md:text-xl">Payment Link Generated</h2>
          <div onClick={onRequestClose} className="cursor-pointer rounded-lg p-1 hover:bg-gray-100">
            <CloseIcon />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          {/* Payment Link Preview */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 md:p-6">
            {/* Header */}
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                  <span className="text-xs font-bold text-white">UP</span>
                </div>
                <span className="text-sm font-medium text-gray-900">Pay with UltraPay</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                  Active
                </span>
              </div>
            </div>

            {/* Business Info */}
            <div className="mb-4">
              <h3 className="mb-1 text-lg font-semibold text-gray-900">BMA Studio</h3>
              <p className="text-gray-700">{linkData.description}</p>
              {linkData.amountType === "Fixed Amount" && (
                <p className="mt-2 text-xl font-bold text-gray-900 md:text-2xl">{formattedAmount}</p>
              )}
              <p className="mt-1 text-sm text-gray-600">Reference: {linkData.referenceId}</p>
            </div>

            {/* Payment Button Preview */}
            <div className="rounded-lg bg-blue-600 p-3 text-center">
              <p className="font-medium text-white">
                {linkData.amountType === "Fixed Amount" ? `Pay ${formattedAmount}` : "Enter Amount"}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="mb-6 space-y-4 rounded-lg bg-[#F9FAFB] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Amount Type</p>
              <p className="text-gray-900">{linkData.amountType}</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Reference</p>
              <p className="text-gray-900">{linkData.referenceId}</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Expiry</p>
              <p className="text-gray-900">{getExpiryText()}</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-gray-900">{linkData.description}</p>
            </div>
          </div>

          {/* Status */}

          {/* Checkout URL */}
          <div className="mb-6">
            <p className="mb-2 text-sm text-gray-500">Checkout URL</p>
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
                <p className="truncate text-sm text-gray-700">{checkoutUrl}</p>
              </div>
              <button
                onClick={handleCopyUrl}
                className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 md:w-auto"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy URL"}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button
              onClick={handlePreview}
              className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <button
              onClick={onRequestClose}
              className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default PaymentLinkGeneratedModal
