"use client"

import React, { useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { VscCode, VscCopy, VscLink, VscVr } from "react-icons/vsc"

interface Payment {
  id: number
  type: string
  label: string
  amount: string
  status: string
  created: string
  lastActivity: string
}

interface PaymentDetailsModalProps {
  isOpen: boolean
  onRequestClose: () => void
  payment: Payment | null
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({ isOpen, onRequestClose, payment }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case "Static QR":
        return <VscVr className="size-5  text-purple-600" />
      case "Dynamic QR":
        return <VscVr className="size-5  text-blue-600" />
      case "Link":
        return <VscLink className="size-5  text-green-600" />
      case "API":
        return <VscCode className="size-5  text-orange-600" />
      default:
        return <div className="size-5  rounded-full bg-gray-300"></div>
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-600 bg-green-100"
      case "Completed":
        return "text-blue-600 bg-blue-100"
      case "Awaiting":
        return "text-yellow-600 bg-yellow-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Completed":
        return "bg-blue-500"
      case "Awaiting":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  if (!payment) return null

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
          <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
          <div onClick={onRequestClose} className="cursor-pointer rounded-lg p-1 hover:bg-gray-100">
            <CloseIcon />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Payment Type */}
          <div className="mb-4 flex items-center gap-2">
            <div className="flex-1 border-t border-[#E5E7EB]"></div>
            <p className="whitespace-nowrap rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1 font-medium text-gray-900">
              Payment Type
            </p>
            <div className="flex-1 border-t border-[#E5E7EB]"></div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center">{getPaymentTypeIcon(payment.type)}</div>
              <p className="text-lg font-semibold text-gray-900">{payment.type}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">Label/Reference:</label>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-[#101828]">{payment.label}</span>
                <div onClick={() => handleCopy(payment.label)} className="cursor-pointer rounded p-1 hover:bg-gray-100">
                  {copied ? (
                    <svg className="size-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <VscCopy className="size-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">Amount:</label>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-[#101828]">{payment.amount}</span>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-500">Status:</label>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                    payment.status
                  )}`}
                >
                  <div className={`mr-2 size-2  rounded-full ${getStatusDotColor(payment.status)}`}></div>
                  {payment.status}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">Created:</label>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-[#101828]">{payment.created}</span>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">Last Activity:</label>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-[#101828]">{payment.lastActivity}</span>
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="my-4 flex items-center gap-2">
            <div className="flex-1 border-t border-[#E5E7EB]"></div>
            <p className="whitespace-nowrap rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1 font-medium text-gray-900">
              Additional Details
            </p>
            <div className="flex-1 border-t border-[#E5E7EB]"></div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">Payment ID:</label>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-[#101828]">PAY-{payment.id.toString().padStart(6, "0")}</span>
                <div
                  onClick={() => handleCopy(`PAY-${payment.id.toString().padStart(6, "0")}`)}
                  className="cursor-pointer rounded p-1 hover:bg-gray-100"
                >
                  {copied ? (
                    <svg className="size-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <VscCopy className="size-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Method:</label>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-[#101828]">{payment.type}</span>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">Total Transactions:</label>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-[#101828]">127</span>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-500">Total Revenue:</label>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-[#101828]">₦2,450,000</span>
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
              Edit Payment
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default PaymentDetailsModal
