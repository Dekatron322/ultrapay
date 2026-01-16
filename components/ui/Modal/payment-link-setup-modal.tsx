"use client"

import React, { useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { ButtonModule } from "../Button/Button"
import { FormInputModule, FormTextAreaModule } from "../Input/Input"
import { FormSelectModule } from "../Input/FormSelectModule"
import PaymentLinkGeneratedModal from "./payment-link-generated-modal"

interface PaymentLinkSetupModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onGenerateLink: (data: PaymentLinkData) => void
}

interface PaymentLinkData {
  amountType: string
  amount: string
  description: string
  referenceId: string
  expiryDate: string
}

const PaymentLinkSetupModal: React.FC<PaymentLinkSetupModalProps> = ({ isOpen, onRequestClose, onGenerateLink }) => {
  const [formData, setFormData] = useState<PaymentLinkData>({
    amountType: "Fixed Amount",
    amount: "",
    description: "",
    referenceId: "",
    expiryDate: "",
  })
  const [showGeneratedModal, setShowGeneratedModal] = useState(false)

  const handleInputChange = (field: keyof PaymentLinkData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleInputChangeEvent = (field: keyof PaymentLinkData) => (e: any) => {
    handleInputChange(field, e.target.value)
  }

  const handleSubmit = () => {
    if (!formData.description || !formData.referenceId) return
    if (formData.amountType === "Fixed Amount" && !formData.amount) return
    onGenerateLink(formData)
    setShowGeneratedModal(true)
  }

  const amountTypeOptions = [
    { value: "Fixed Amount", label: "Fixed Amount" },
    { value: "Customer Enters", label: "Customer Enters" },
  ]

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-md bg-white shadow-lg outline-none md:mx-auto md:mt-20 md:w-[500px]"
        overlayClassName="fixed z-[998] inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-hidden flex items-center justify-center p-4"
      >
        <div className="flex max-h-[85vh] w-full flex-col overflow-hidden">
          <div className="flex w-full flex-shrink-0 items-center justify-between bg-[#F3F4F6] p-4 md:p-6">
            <h2 className="text-lg font-bold text-gray-900 md:text-xl">Payment Link Setup</h2>
            <div onClick={onRequestClose} className="cursor-pointer rounded-lg p-1 hover:bg-gray-100">
              <CloseIcon />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
            <div className="space-y-6">
              {/* Amount Type */}
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  Amount Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3">
                  {amountTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange("amountType", option.value)}
                      className={`flex-1 rounded-lg border p-3 text-center transition-colors ${
                        formData.amountType === option.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          formData.amountType === option.value ? "font-medium text-blue-700" : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              {formData.amountType === "Fixed Amount" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Amount NGN <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      placeholder="0"
                      className="w-full rounded-md border border-gray-300 py-2 pl-8 pr-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <FormInputModule
                label="Description"
                type="text"
                name="description"
                placeholder="Payment description"
                value={formData.description}
                onChange={handleInputChangeEvent("description")}
                required
              />

              {/* Reference ID */}
              <FormInputModule
                label="Reference ID"
                type="text"
                name="referenceId"
                placeholder="Link-12345676543"
                value={formData.referenceId}
                onChange={handleInputChangeEvent("referenceId")}
                required
              />

              {/* Expiry */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Expiry (Optional) <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Brand Preview */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="mb-3 text-sm font-medium text-gray-700">Brand Preview</p>
                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-300">
                    <span className="text-xs text-gray-600">Logo</span>
                  </div>
                  <p className="font-medium text-gray-900">BMA Studio</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={onRequestClose}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  !formData.description ||
                  !formData.referenceId ||
                  (formData.amountType === "Fixed Amount" && !formData.amount)
                }
                className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Generate Link
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <PaymentLinkGeneratedModal
        isOpen={showGeneratedModal}
        onRequestClose={() => {
          setShowGeneratedModal(false)
          onRequestClose()
        }}
        linkData={formData}
      />
    </>
  )
}

export default PaymentLinkSetupModal
