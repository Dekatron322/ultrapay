"use client"

import React, { useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { ButtonModule } from "../Button/Button"
import { Copy, Download, Printer } from "lucide-react"

interface QrGeneratedModalProps {
  isOpen: boolean
  onRequestClose: () => void
  qrData: {
    label: string
    description: string
    currency: string
    status: boolean
  }
}

const QrGeneratedModal: React.FC<QrGeneratedModalProps> = ({ isOpen, onRequestClose, qrData }) => {
  const [copied, setCopied] = useState(false)

  const checkoutUrl = `https://pay.ultrapay.ng/s/${qrData.label.toLowerCase().replace(/\s+/g, "-")}`

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(checkoutUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadQr = () => {
    // Placeholder for download functionality
    console.log("Download QR code")
  }

  const handlePrint = () => {
    // Placeholder for print functionality
    console.log("Print QR code")
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
          <h2 className="text-lg font-bold text-gray-900 md:text-xl">QR Code Generated</h2>
          <div onClick={onRequestClose} className="cursor-pointer rounded-lg p-1 hover:bg-gray-100">
            <CloseIcon />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          {/* QR Code Display */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-gray-100 md:h-48 md:w-48">
              <div className="text-center">
                <div className="mb-2 flex h-28 w-28 items-center justify-center rounded-lg bg-gray-300 md:h-32 md:w-32">
                  <span className="text-sm text-gray-600">QR Code</span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div className="mb-6">
            <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">BMA Studio</h3>
            <p className="text-center font-medium text-gray-700">{qrData.label}</p>
            <p className="text-center text-sm text-gray-600">Amount entered by customer at checkout</p>
            <div className="mt-2 flex justify-center">
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  qrData.status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                {qrData.status ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="mb-6 space-y-4 rounded-lg bg-[#F9FAFB] p-4">
            <div className="flex items-center justify-between">
              <p className="mb-1 text-sm text-gray-500">Label</p>
              <p className="text-gray-900">{qrData.label}</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="mb-1 text-sm text-gray-500">Description</p>
              <p className="text-gray-900">{qrData.description || "No description provided"}</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="mb-1 text-sm text-gray-500">In Store Counter</p>
              <p className="text-gray-900">--</p>
            </div>
          </div>

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
          <div className="flex flex-col gap-3 md:flex-row">
            <button
              onClick={handleDownloadQr}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              Download QR
            </button>
            <button
              onClick={handlePrint}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button
              onClick={onRequestClose}
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default QrGeneratedModal
