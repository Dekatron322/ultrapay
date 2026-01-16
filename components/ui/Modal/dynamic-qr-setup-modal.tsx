"use client"

import React, { useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { ButtonModule } from "../Button/Button"
import { FormInputModule, FormTextAreaModule } from "../Input/Input"
import { FormSelectModule } from "../Input/FormSelectModule"
import DynamicQrGeneratedModal from "./dynamic-qr-generated-modal"

interface DynamicQrSetupModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onGenerateQr: (data: DynamicQrData) => void
}

interface DynamicQrData {
  amount: string
  description: string
  referenceId: string
  expiryDate: string
  customExpiry?: string
  internalNotes: string
  status: boolean
}

const DynamicQrSetupModal: React.FC<DynamicQrSetupModalProps> = ({ isOpen, onRequestClose, onGenerateQr }) => {
  const [formData, setFormData] = useState<DynamicQrData>({
    amount: "",
    description: "",
    referenceId: "",
    expiryDate: "None",
    customExpiry: "",
    internalNotes: "",
    status: true,
  })
  const [showGeneratedModal, setShowGeneratedModal] = useState(false)

  const handleInputChange = (field: keyof DynamicQrData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleInputChangeEvent = (field: keyof DynamicQrData) => (e: any) => {
    handleInputChange(field, e.target.value)
  }

  const handleSubmit = () => {
    if (!formData.amount || !formData.description || !formData.referenceId) return
    onGenerateQr(formData)
    setShowGeneratedModal(true)
  }

  const expiryOptions = [
    { value: "None", label: "None" },
    { value: "1 hour", label: "1 hour" },
    { value: "5 hours", label: "5 hours" },
    { value: "Custom", label: "Custom" },
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
            <h2 className="text-lg font-bold text-gray-900 md:text-xl">Dynamic QR Code</h2>
            <div onClick={onRequestClose} className="cursor-pointer rounded-lg p-1 hover:bg-gray-100">
              <CloseIcon />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
            <div className="space-y-6">
              {/* Amount */}
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

              {/* Description */}
              <FormInputModule
                label="Description"
                type="text"
                name="description"
                placeholder="e.g., Invoice Payment"
                value={formData.description}
                onChange={handleInputChangeEvent("description")}
                required
              />

              {/* Reference ID */}
              <FormInputModule
                label="Reference ID"
                type="text"
                name="referenceId"
                placeholder="INV-12345676543"
                value={formData.referenceId}
                onChange={handleInputChangeEvent("referenceId")}
                required
              />

              {/* Expiry Date */}
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  Expiry Date (Optional) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
                  {expiryOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange("expiryDate", option.value)}
                      className={`flex-1 rounded-lg border p-3 text-center transition-colors ${
                        formData.expiryDate === option.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          formData.expiryDate === option.value ? "font-medium text-blue-700" : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>

                {formData.expiryDate === "Custom" && (
                  <div className="mt-3">
                    <input
                      type="datetime-local"
                      value={formData.customExpiry}
                      onChange={(e) => handleInputChange("customExpiry", e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Internal Notes */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Internal Notes (Optional) <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.internalNotes}
                  onChange={(e) => handleInputChange("internalNotes", e.target.value)}
                  placeholder="For your reference only, not shown to customers"
                  rows={3}
                  className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status */}
              {/* <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">QR code will be active immediately</span>
                  <button
                    type="button"
                    onClick={() => handleInputChange("status", !formData.status)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.status ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                        formData.status ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div> */}
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
                disabled={!formData.amount || !formData.description || !formData.referenceId}
                className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Generate QR
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <DynamicQrGeneratedModal
        isOpen={showGeneratedModal}
        onRequestClose={() => {
          setShowGeneratedModal(false)
          onRequestClose()
        }}
        qrData={formData}
      />
    </>
  )
}

export default DynamicQrSetupModal
