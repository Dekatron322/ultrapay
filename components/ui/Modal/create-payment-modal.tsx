"use client"

import React, { useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { Link, QrCode } from "lucide-react"
import { VscCode } from "react-icons/vsc"
import StaticQrSetupModal from "./static-qr-setup-modal"
import DynamicQrSetupModal from "./dynamic-qr-setup-modal"
import PaymentLinkSetupModal from "./payment-link-setup-modal"

interface CreatePaymentModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onSelectType: (type: string) => void
}

const CreatePaymentModal: React.FC<CreatePaymentModalProps> = ({ isOpen, onRequestClose, onSelectType }) => {
  const [showStaticQrSetup, setShowStaticQrSetup] = useState(false)
  const [showDynamicQrSetup, setShowDynamicQrSetup] = useState(false)
  const [showPaymentLinkSetup, setShowPaymentLinkSetup] = useState(false)
  const paymentTypes = [
    {
      id: "static-qr",
      title: "Static QR Code",
      description: "QR code for in-store payments. Customer inputs amount.",
      icon: <QrCode className="size-6 text-purple-600" />,
      color: "purple",
    },
    {
      id: "dynamic-qr",
      title: "Dynamic QR Code",
      description: "One-time QR with fixed amount and optional expiry.",
      icon: <QrCode className="size-6 text-blue-600" />,
      color: "blue",
    },
    {
      id: "payment-link",
      title: "Payment Link",
      description: "Branded checkout link to share via Whatsapp, email, or SMS.",
      icon: <Link className="size-6 text-green-600" />,
      color: "green",
    },
    {
      id: "api-intent",
      title: "API payment Intent",
      description: "Programmatic payment for developers and integrations.",
      icon: <VscCode className="size-6 text-orange-600" />,
      color: "orange",
    },
  ]

  const getColorClasses = (color: string) => {
    return "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
  }

  const handleSelectType = (type: string) => {
    if (type === "static-qr") {
      setShowStaticQrSetup(true)
    } else if (type === "dynamic-qr") {
      setShowDynamicQrSetup(true)
    } else if (type === "payment-link") {
      setShowPaymentLinkSetup(true)
    } else {
      onSelectType(type)
      onRequestClose()
    }
  }

  const handleStaticQrGenerate = (data: any) => {
    onSelectType("static-qr")
    // You can pass the QR data to parent if needed
    console.log("Static QR Data:", data)
  }

  const handleDynamicQrGenerate = (data: any) => {
    onSelectType("dynamic-qr")
    // You can pass the QR data to parent if needed
    console.log("Dynamic QR Data:", data)
  }

  const handlePaymentLinkGenerate = (data: any) => {
    onSelectType("payment-link")
    // You can pass the link data to parent if needed
    console.log("Payment Link Data:", data)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className=" max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-md bg-white shadow-lg outline-none md:mx-auto md:mt-20 md:w-[800px]"
        overlayClassName="fixed z-[998] inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-hidden flex items-center justify-center p-4"
      >
        <div className="flex max-h-[85vh] w-full flex-col overflow-hidden">
          <div className="flex w-full flex-shrink-0 items-center justify-between bg-[#F3F4F6] p-4 md:p-6">
            <h2 className="text-lg font-bold text-gray-900 md:text-xl">Create Payment</h2>
            <div onClick={onRequestClose} className="cursor-pointer rounded-lg p-1 hover:bg-gray-100">
              <CloseIcon />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
            <p className="mb-6 text-gray-600">Choose the type of payment endpoint you want to create</p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {paymentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleSelectType(type.id)}
                  className={`flex items-start gap-4 rounded-lg border p-4 text-left transition-colors ${getColorClasses(
                    type.color
                  )}`}
                >
                  <div className="flex-shrink-0 rounded-lg bg-gray-50 p-3">{type.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{type.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{type.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <StaticQrSetupModal
        isOpen={showStaticQrSetup}
        onRequestClose={() => setShowStaticQrSetup(false)}
        onGenerateQr={handleStaticQrGenerate}
      />

      <DynamicQrSetupModal
        isOpen={showDynamicQrSetup}
        onRequestClose={() => setShowDynamicQrSetup(false)}
        onGenerateQr={handleDynamicQrGenerate}
      />

      <PaymentLinkSetupModal
        isOpen={showPaymentLinkSetup}
        onRequestClose={() => setShowPaymentLinkSetup(false)}
        onGenerateLink={handlePaymentLinkGenerate}
      />
    </>
  )
}

export default CreatePaymentModal
