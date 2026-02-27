"use client"
import { useEffect, useState } from "react"
import Modal from "react-modal"
import { useDispatch, useSelector } from "react-redux"
import { AlertCircle, Check, Loader2 } from "lucide-react"
import { ButtonModule } from "components/ui/Button/Button"
import { addTag, checkTag, clearAddTagStatus, clearCheckTagStatus } from "lib/redux/authSlice"
import { AppDispatch, RootState } from "lib/redux/store"

interface AddTagModalProps {
  isOpen: boolean
  onClose: () => void
  currentTag: string | null
}

export default function AddTagModal({ isOpen, onClose, currentTag }: AddTagModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { isAddingTag, addTagError, addTagSuccess, isCheckingTag, checkTagError, tagExists } = useSelector(
    (state: RootState) => state.auth
  )

  const [tag, setTag] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [validationMessage, setValidationMessage] = useState("")

  useEffect(() => {
    if (isOpen) {
      setTag("")
      setValidationMessage("")
      dispatch(clearAddTagStatus())
      dispatch(clearCheckTagStatus())
    }
  }, [isOpen, dispatch])

  useEffect(() => {
    if (addTagSuccess) {
      setTimeout(() => {
        onClose()
      }, 1500)
    }
  }, [addTagSuccess, onClose])

  const validateTag = async (value: string) => {
    if (!value.trim()) {
      setValidationMessage("")
      return
    }

    setIsValidating(true)
    setValidationMessage("")

    try {
      await dispatch(checkTag({ tag: value.trim() })).unwrap()
    } catch (error) {
      // Error is handled by the reducer
    } finally {
      setIsValidating(false)
    }
  }

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTag(value)

    // Clear validation when user is typing
    setValidationMessage("")
    dispatch(clearCheckTagStatus())

    // Debounce validation
    const timeoutId = setTimeout(() => {
      if (value.trim()) {
        validateTag(value)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tag.trim()) {
      setValidationMessage("Tag is required")
      return
    }

    if (tagExists) {
      setValidationMessage("This tag already exists")
      return
    }

    try {
      await dispatch(addTag({ tag: tag.trim() })).unwrap()
    } catch (error) {
      // Error is handled by the reducer
    }
  }

  const getValidationStatus = () => {
    if (isValidating) return "validating"
    if (tagExists === true) return "exists"
    if (tagExists === false && tag.trim()) return "available"
    return "idle"
  }

  const validationStatus = getValidationStatus()

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="z-[999] mx-4 max-w-sm overflow-hidden rounded-xl bg-white shadow-lg outline-none lg:mt-20 lg:w-[512px] lg:max-w-md"
      overlayClassName="fixed z-[999] inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-hidden flex items-center justify-center"
    >
      <div className="flex w-full items-center justify-between bg-[#F3F4F6] p-4">
        <h2 className="text-lg font-bold">{currentTag ? "Edit Tag" : "Add Tag"}</h2>
        <button
          onClick={onClose}
          className="cursor-pointer rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <div className="px-4 pb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tag Input */}
          <div className="my-4">
            <label htmlFor="tag" className="mb-2 block text-sm font-medium text-gray-700">
              Tag
            </label>
            <div className="relative">
              <input
                type="text"
                id="tag"
                value={tag}
                onChange={handleTagChange}
                placeholder="Enter your tag"
                className={`w-full rounded-lg border px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 ${
                  validationStatus === "exists"
                    ? "border-red-300 focus:ring-red-500"
                    : validationStatus === "available"
                    ? "border-green-300 focus:ring-green-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                disabled={isAddingTag}
              />

              {/* Validation Icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isValidating && <Loader2 className="size-4 animate-spin text-gray-400" />}
                {validationStatus === "exists" && <AlertCircle className="size-4 text-red-500" />}
                {validationStatus === "available" && <Check className="size-4 text-green-500" />}
              </div>
            </div>

            {/* Validation Messages */}
            {validationMessage && (
              <p className={`mt-2 text-sm ${validationStatus === "exists" ? "text-red-600" : "text-gray-600"}`}>
                {validationMessage}
              </p>
            )}
            {tagExists === false && tag.trim() && !validationMessage && (
              <p className="mt-2 text-sm text-green-600">This tag is available</p>
            )}
            {checkTagError && <p className="mt-2 text-sm text-red-600">{checkTagError}</p>}
          </div>

          {/* Error Messages */}
          {addTagError && (
            <div className="rounded-lg bg-red-50 p-3">
              <p className="text-sm text-red-600">{addTagError}</p>
            </div>
          )}

          {/* Success Message */}
          {addTagSuccess && (
            <div className="rounded-lg bg-green-50 p-3">
              <p className="text-sm text-green-600">Tag added successfully!</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <ButtonModule variant="secondary" className="flex-1" size="lg" onClick={onClose} disabled={isAddingTag}>
              Cancel
            </ButtonModule>
            <ButtonModule
              variant="primary"
              className="flex-1"
              size="lg"
              type="submit"
              disabled={isAddingTag || isValidating || tagExists === true || !tag.trim()}
            >
              {isAddingTag ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="mr-2 size-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Adding...
                </div>
              ) : (
                "Add Tag"
              )}
            </ButtonModule>
          </div>
        </form>
      </div>
    </Modal>
  )
}
