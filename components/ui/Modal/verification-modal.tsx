// components/Modals/VerificationModal.tsx
"use client"

import React from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { ButtonModule } from "../Button/Button"
import Image from "next/image"

interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="z-[999] mx-auto mt-20 w-[512px] max-w-[90%] overflow-hidden rounded-xl bg-white shadow-lg outline-none sm:max-w-md"
      overlayClassName="fixed z-[999] inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-hidden flex items-center justify-center p-4"
    >
      <div className="flex w-full items-center justify-between bg-[#F3F4F6] p-4">
        <h2 className="text-lg font-bold">Verification Status</h2>
        <div onClick={onClose} className="cursor-pointer">
          <CloseIcon />
        </div>
      </div>

      <div className="px-4 pb-6">
        <div className="mt-6 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center ">
            <Image src="/ultra-pay/verification.svg" alt="UltraPay Icon" width={100} height={100} />
          </div>

          <h3 className="mb-2 text-xl font-semibold text-gray-900">Your verification is now under review</h3>

          <p className="mb-6 text-sm text-gray-600">We&apos;ll notify you once it&apos;s complete</p>

          <ButtonModule variant="primary" className="w-full" size="lg" onClick={onClose}>
            Got it
          </ButtonModule>
        </div>
      </div>
    </Modal>
  )
}

export default VerificationModal
