// components/Modals/WelcomeModal.tsx
"use client"

import React, { useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { ButtonModule } from "../Button/Button"
import Image from "next/image"
import { BankVerificationOutline, UserDetailsOutline, UserVerificationOutline } from "components/Icons/LogoIcons"
import { useSelector } from "react-redux"
import { RootState } from "lib/redux/store"

interface WelcomeModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onGetStarted: () => void
  loading?: boolean
  kycStatus?: any
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onRequestClose,
  onGetStarted,
  loading = false,
  kycStatus,
}) => {
  const { user } = useSelector((state: RootState) => state.auth)

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="z-[999] mx-4 max-w-sm overflow-hidden rounded-xl bg-white shadow-lg outline-none lg:mt-20 lg:w-[512px] lg:max-w-md"
      overlayClassName="fixed z-[999] inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-hidden flex items-center justify-center"
    >
      <div className="flex w-full items-center justify-between bg-[#F3F4F6] p-4">
        <h2 className="text-lg font-bold">Hello {user?.fullName || "User"}!</h2>
        <div onClick={onRequestClose} className="cursor-pointer">
          <CloseIcon />
        </div>
      </div>
      <div className="px-4 pb-6">
        <div className="my-2 lg:my-6">
          <Image
            src="/ultra-pay/welcome.png"
            alt="UltraPay Icon"
            width={130}
            height={130}
            className="h-24 w-24 max-sm:h-20 max-sm:w-20"
          />

          <h3 className="my-2 text-xl font-semibold text-gray-900 2xl:text-2xl">Welcome to UltraPay</h3>
          <p className="text-[#4A5565] max-sm:text-sm">
            Join UltraPay today! To ensure a smooth experience and meet federal guidelines, we’ll need to gather and
            confirm some essential information when you set up your account.
          </p>
        </div>
        <p className="lg:text-lg">Information we need are:</p>

        <div className="ld:my-4 my-2 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 pt-1">
              <UserDetailsOutline size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Personal details</h4>
              <p className="text-sm text-gray-600">
                Basic information like your name, phone number, address, date of birth.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 pt-1">
              <UserVerificationOutline size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Business verification</h4>
              <p className="text-sm text-gray-600">
                Provide your business registration essentials: incorporation documents, proof of address, and UBO
                details.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 pt-1">
              <BankVerificationOutline size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Bank account details</h4>
              <p className="text-sm text-gray-600">Link your business bank account for seamless withdrawals!</p>
            </div>
          </div>
        </div>

        <ButtonModule variant="primary" className="w-full" size="lg" onClick={onGetStarted} disabled={loading}>
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="mr-2 size-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Getting Started...
            </div>
          ) : (
            "Get Started"
          )}
        </ButtonModule>
      </div>
    </Modal>
  )
}

export default WelcomeModal
