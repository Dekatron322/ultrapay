"use client"

import React, { useState } from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { ButtonModule } from "../Button/Button"
import { FormInputModule } from "../Input/Input"

interface DeletePaymentModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onConfirm: () => Promise<void>
  loading: boolean
  paymentLabel: string
  paymentType: string
  paymentCreated: string
  paymentStatus: string
  successMessage?: string
  errorMessage?: string
}

const DeletePaymentModal: React.FC<DeletePaymentModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
  loading,
  paymentLabel,
  paymentType,
  paymentCreated,
  paymentStatus,
  successMessage,
  errorMessage,
}) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  const handleConfirm = async () => {
    await onConfirm()
  }

  const handleConfirmationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeleteConfirmation(e.target.value)
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="mx-auto w-[400px] max-w-[90vw] overflow-hidden rounded-md bg-white shadow-lg outline-none sm:mt-20"
      overlayClassName="fixed z-[998] inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-hidden flex items-center justify-center p-4"
    >
      <div className="flex w-full items-center justify-between bg-[#F3F4F6] p-4">
        <h2 className="text-lg font-bold">Delete Payment</h2>
        <div onClick={onRequestClose} className="cursor-pointer">
          <CloseIcon />
        </div>
      </div>
      <div className="px-4 pb-6">
        <p className="my-4 text-gray-600 max-sm:text-sm">
          This permanently removes the endpoint and its share link/QR from your dashboard. Your transaction history and
          audit trail remain unchanged (read-only).
        </p>

        {/* Payment Information */}
        <div className="mb-6 rounded-md bg-gray-50 p-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Label</span>
              <span className="text-sm font-medium text-gray-900">{paymentLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Type</span>
              <span className="text-sm font-medium text-gray-900">{paymentType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Created</span>
              <span className="text-sm font-medium text-gray-900">{paymentCreated}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Status</span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  paymentStatus === "Active"
                    ? "bg-green-100 text-green-800"
                    : paymentStatus === "Completed"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {paymentStatus}
              </span>
            </div>
          </div>
        </div>

        <p className="mb-4 text-red-600 max-sm:text-sm">
          Warning: This action cannot be undone. Are you sure you want to delete <strong>{paymentLabel}</strong>?
        </p>

        <FormInputModule
          label="Type DELETE to confirm"
          type="text"
          placeholder="DELETE"
          value={deleteConfirmation}
          onChange={handleConfirmationChange}
          className="mb-4"
        />

        <div className="flex gap-3">
          <ButtonModule
            variant="secondary"
            className="flex w-full"
            size="md"
            onClick={onRequestClose}
            disabled={loading}
          >
            Cancel
          </ButtonModule>

          <ButtonModule
            variant="danger"
            className="flex w-full"
            size="md"
            onClick={handleConfirm}
            disabled={loading || deleteConfirmation !== "DELETE"}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="mr-2 size-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              </div>
            ) : (
              "Delete"
            )}
          </ButtonModule>
        </div>

        {successMessage && (
          <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-800">{successMessage}</div>
        )}

        {errorMessage && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">{errorMessage}</div>}
      </div>
    </Modal>
  )
}

export default DeletePaymentModal
