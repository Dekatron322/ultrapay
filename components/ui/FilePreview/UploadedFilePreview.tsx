"use client"

import React from "react"

interface UploadedFilePreviewProps {
  fileName: string
  filePreview?: string | null
  onDelete: () => void
}

export const UploadedFilePreview: React.FC<UploadedFilePreviewProps> = ({
  fileName,
  filePreview,
  onDelete,
}) => {
  const isImage = filePreview && filePreview.startsWith("data:")
  
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="flex items-center space-x-3">
        {isImage ? (
          <div className="relative h-12 w-12 overflow-hidden rounded">
            <img
              src={filePreview}
              alt="File preview"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-200">
            <svg
              className="h-6 w-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
            {fileName}
          </p>
          <p className="text-xs text-gray-500">
            {isImage ? "Image" : "Document"}
          </p>
        </div>
      </div>
      <button
        onClick={onDelete}
        className="ml-2 rounded p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        aria-label="Remove file"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  )
}
