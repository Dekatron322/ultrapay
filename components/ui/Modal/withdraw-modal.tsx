// components/ui/Modal/withdraw-modal.tsx
"use client"

import React, { useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { ButtonModule } from "../Button/Button"

interface WithdrawModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onWithdraw: (amount: number) => void
  loading?: boolean
  currentBalance?: number
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onRequestClose,
  onWithdraw,
  loading = false,
  currentBalance = 12500,
}) => {
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")

  const percentages = [25, 50, 75, 100]

  const calculateAmount = (percentage: number) => {
    return (currentBalance * percentage) / 100
  }

  const handlePercentageSelect = (percentage: number) => {
    setSelectedPercentage(percentage)
    setCustomAmount("") // Clear custom amount when percentage is selected
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setSelectedPercentage(null) // Clear percentage when custom amount is entered
  }

  const handleInputFocus = () => {
    setSelectedPercentage(null) // Clear percentage when user focuses on input
  }

  const getWithdrawalAmount = () => {
    if (selectedPercentage !== null) {
      return calculateAmount(selectedPercentage)
    }
    return parseFloat(customAmount) || 0
  }

  const handleSubmit = () => {
    const amount = getWithdrawalAmount()
    if (amount > 0 && amount <= currentBalance) {
      onWithdraw(amount)
    }
  }

  const withdrawalAmount = getWithdrawalAmount()
  const isValidAmount = withdrawalAmount > 0 && withdrawalAmount <= currentBalance

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="z-[999] mt-20 w-[512px] max-w-md overflow-hidden rounded-xl bg-white shadow-lg outline-none"
      overlayClassName="fixed z-[999] inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-hidden flex items-center justify-center"
    >
      <div className="flex w-full items-center justify-between bg-[#F3F4F6] p-4">
        <h2 className="text-lg font-bold">Withdraw Funds</h2>
        <div onClick={onRequestClose} className="cursor-pointer">
          <CloseIcon />
        </div>
      </div>

      <div className="px-4 pb-6">
        <div className="my-6">
          <div className="mb-4 text-center">
            <div className="mb-2 text-3xl font-bold text-gray-900">₦{currentBalance.toLocaleString()}</div>
            <p className="text-sm text-gray-500">Available Balance</p>
          </div>

          <h3 className="mb-2 text-center text-xl font-semibold text-gray-900">Withdraw Funds</h3>
          <p className="text-center text-sm text-[#4A5565]">
            Select a percentage or enter a custom amount to withdraw.
          </p>
        </div>

        {/* Percentage Selection */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-gray-700">Quick Select</label>
          <div className="grid grid-cols-4 gap-2">
            {percentages.map((percentage) => (
              <button
                key={percentage}
                onClick={() => handlePercentageSelect(percentage)}
                className={`rounded-lg border px-2 py-3 text-sm font-medium transition-colors ${
                  selectedPercentage === percentage
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {percentage}%
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount Input */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Custom Amount {selectedPercentage && `(₦${calculateAmount(selectedPercentage).toLocaleString()})`}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 transform text-sm font-medium text-gray-500">
              ₦
            </span>
            <input
              type="number"
              value={selectedPercentage ? calculateAmount(selectedPercentage) : customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              onFocus={handleInputFocus}
              placeholder="0.00"
              className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {customAmount && parseFloat(customAmount) > currentBalance && (
            <p className="mt-1 text-xs text-red-600">Amount exceeds available balance</p>
          )}
        </div>

        {/* Withdrawal Summary */}
        {withdrawalAmount > 0 && (
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-600">Withdrawal Amount:</span>
              <span className="text-sm font-medium">₦{withdrawalAmount.toLocaleString()}</span>
            </div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-600">Remaining Balance:</span>
              <span className="text-sm font-medium">₦{(currentBalance - withdrawalAmount).toLocaleString()}</span>
            </div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-600">Bank:</span>
              <span className="text-sm font-medium">First Bank of Nigeria</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Account:</span>
              <span className="text-sm font-medium">****1234</span>
            </div>
          </div>
        )}

        {/* Withdraw Button */}
        <ButtonModule
          variant="primary"
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={loading || !isValidAmount}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="mr-2 size-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                <path
                  className="opacity-75"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M12 2a10 10 0 0 1 10 10"
                ></path>
              </svg>
              Processing...
            </div>
          ) : (
            `Withdraw ₦${withdrawalAmount.toLocaleString()}`
          )}
        </ButtonModule>

        {/* Warning Message */}
        <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
          <p className="text-xs text-yellow-800">
            <strong>Important:</strong> Withdrawals will be processed to your registered bank account. Please confirm
            the amount before proceeding.
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default WithdrawModal
