"use client"

import React, { useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { ButtonModule } from "../Button/Button"
import { FormInputModule, FormTextAreaModule } from "../Input/Input"
import { FormSelectModule } from "../Input/FormSelectModule"
import QrGeneratedModal from "./qr-generated-modal"

interface StaticQrSetupModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onGenerateQr: (data: StaticQrData) => void
}

interface StaticQrData {
  label: string
  description: string
  currency: string
  status: boolean
}

const StaticQrSetupModal: React.FC<StaticQrSetupModalProps> = ({ isOpen, onRequestClose, onGenerateQr }) => {
  const [formData, setFormData] = useState<StaticQrData>({
    label: "",
    description: "",
    currency: "NGN",
    status: true,
  })
  const [showGeneratedModal, setShowGeneratedModal] = useState(false)

  const handleInputChange = (field: keyof StaticQrData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleInputChangeEvent = (field: keyof StaticQrData) => (e: any) => {
    handleInputChange(field, e.target.value)
  }

  const handleSubmit = () => {
    if (!formData.label.trim()) return
    onGenerateQr(formData)
    setShowGeneratedModal(true)
  }

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
            <h2 className="text-lg font-bold text-gray-900 md:text-xl">Static QR Setup</h2>
            <div onClick={onRequestClose} className="cursor-pointer rounded-lg p-1 hover:bg-gray-100">
              <CloseIcon />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
            <div className="space-y-6">
              {/* Label / Nickname */}
              <FormInputModule
                label="Label / Nickname"
                type="text"
                name="label"
                placeholder="e.g., In-store counter"
                value={formData.label}
                onChange={handleInputChangeEvent("label")}
                required
              />

              {/* Description */}
              <FormTextAreaModule
                label="Description (Optional)"
                name="description"
                placeholder="Shown at checkout..."
                value={formData.description}
                onChange={handleInputChangeEvent("description")}
                rows={3}
              />

              {/* Default Currency */}
              <FormSelectModule
                label="Default Currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChangeEvent("currency")}
                options={[
                  { value: "NGN", label: "NGN" },
                  { value: "USD", label: "USD" },
                  { value: "EUR", label: "EUR" },
                  { value: "GBP", label: "GBP" },
                ]}
                required
              />

              {/* Status */}
              <div>
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
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.status ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
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
                disabled={!formData.label.trim()}
                className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Generate QR
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <QrGeneratedModal
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

export default StaticQrSetupModal
