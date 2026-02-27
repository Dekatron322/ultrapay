"use client"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  AlertCircle,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle,
  Copy,
  CreditCard,
  Edit2,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Key,
  Mail,
  Map,
  Phone,
  Save,
  Shield,
  User,
  Webhook,
  X,
} from "lucide-react"
import { getSettlementBank } from "lib/redux/settlementBankSlice"
import { fetchMerchantKyc } from "lib/redux/merchantKycSlice"
import { AppDispatch, RootState } from "lib/redux/store"
import AddTagModal from "./AddTagModal"

interface ProfileContentProps {
  activeTab: string
}

export default function ProfileContent({ activeTab }: ProfileContentProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { isFetchingSettlementBank, settlementBankData, fetchSettlementBankError } = useSelector(
    (state: RootState) => state.settlementBank
  )
  const { isFetchingMerchantKyc, merchantKycData, merchantKycError } = useSelector(
    (state: RootState) => state.merchantKyc
  )

  const [isEditing, setIsEditing] = useState(false)
  const [showLiveKey, setShowLiveKey] = useState(false)
  const [showTestKey, setShowTestKey] = useState(false)
  const [copiedLiveKey, setCopiedLiveKey] = useState(false)
  const [copiedTestKey, setCopiedTestKey] = useState(false)
  const [copiedTag, setCopiedTag] = useState(false)
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)

  const handleCopy = async (text: string, keyType: "live" | "test" | "tag") => {
    await navigator.clipboard.writeText(text)
    if (keyType === "live") {
      setCopiedLiveKey(true)
      setTimeout(() => setCopiedLiveKey(false), 2000)
    } else if (keyType === "test") {
      setCopiedTestKey(true)
      setTimeout(() => setCopiedTestKey(false), 2000)
    } else {
      setCopiedTag(true)
      setTimeout(() => setCopiedTag(false), 2000)
    }
  }
  const [originalData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    dob: "1990-01-01",
    phone: "+234 800 000 0000",
    company: "UltraPay Technologies",
    role: "Administrator",
    department: "Finance",
    location: "Lagos, Nigeria",
    timezone: "UTC+1 (WAT)",
    language: "English",
    bio: "Experienced finance professional with expertise in payment systems and financial technology.",
  })
  const [editData, setEditData] = useState(originalData)

  const handleEditChange = (field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // Save logic here - would update originalData with editData
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(originalData)
    setIsEditing(false)
  }

  const handleTagClick = () => {
    setIsTagModalOpen(true)
  }

  // Fetch settlement bank data when bank tab is active and merchant KYC data when personal tab is active
  useEffect(() => {
    if (activeTab === "bank") {
      dispatch(getSettlementBank())
    } else if (activeTab === "personal") {
      dispatch(fetchMerchantKyc())
    }
  }, [activeTab, dispatch])

  return (
    <>
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Profile Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account information and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm md:mb-8 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Avatar */}
            <div className="relative">
              {merchantKycData?.merchant.logo ? (
                <div className="h-20 w-20 overflow-hidden rounded-full md:h-24 md:w-24">
                  <img src={merchantKycData.merchant.logo} alt="Business Logo" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white md:h-24 md:w-24">
                  <span className="text-2xl font-bold md:text-3xl">
                    {merchantKycData
                      ? `${merchantKycData.firstName.charAt(0)}${merchantKycData.lastName.charAt(0)}`
                      : `${originalData.firstName.charAt(0)}${originalData.lastName.charAt(0)}`}
                  </span>
                </div>
              )}
              <button className="absolute bottom-0 right-0 rounded-full border border-gray-200 bg-white p-2 shadow-lg hover:bg-gray-50">
                <Camera className="size-4 text-gray-600" />
              </button>
            </div>

            {/* User Info */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
                {merchantKycData ? `${merchantKycData.firstName} ${merchantKycData.lastName}` : "Loading..."}
              </h2>
              <div className="flex items-center gap-3">
                <p className="text-gray-600">{merchantKycData?.merchant.businessName || "Business Account"}</p>
                {user?.tag && (
                  <div
                    className="mt-1 inline-flex cursor-pointer items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-200"
                    onClick={() => handleCopy(`@${user.tag}`, "tag")}
                  >
                    <span className="font-medium">@{user.tag}</span>
                    {copiedTag ? <Check className="size-3" /> : <Copy className="size-3" />}
                  </div>
                )}
              </div>
              <div className="mt-2 flex flex-col gap-2 text-sm text-gray-500 md:flex-row md:gap-4">
                <span className="flex items-center gap-1">
                  <Mail className="size-4" />
                  {merchantKycData?.businessEmail || originalData.email}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="size-4" />
                  {merchantKycData?.businessName || originalData.company}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={user?.tag === null ? handleTagClick : isEditing ? handleCancel : () => setIsEditing(true)}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {isEditing ? (
              <>
                <X className="size-4" />
                <span className="hidden md:inline">Cancel</span>
                <span className="md:hidden">X</span>
              </>
            ) : (
              <>
                <Edit2 className="size-4" />
                <span className="hidden md:inline">{user?.tag === null ? "Add Tag" : "Edit"}</span>
                <span className="md:hidden">Edit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        <div className="rounded-lg bg-white p-4 shadow-sm md:p-6">
          {activeTab === "personal" && (
            <>
              {isFetchingMerchantKyc && (
                <div className="mb-4 rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-600">Loading merchant information...</p>
                </div>
              )}

              {merchantKycError && (
                <div className="mb-4 rounded-lg bg-red-50 p-4">
                  <p className="text-sm text-red-600">Error loading merchant information: {merchantKycError}</p>
                </div>
              )}

              <div className="space-y-6">
                {/* Business Information Section */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-4 grid grid-cols-1 items-center justify-between gap-6 border-b border-gray-200 pb-2 md:grid-cols-2">
                      <div className="flex gap-3">
                        <User className="mt-1 size-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Business name</p>
                          <p className="text-gray-900">{merchantKycData?.businessName || "Loading..."}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Mail className="mt-1 size-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Business Email</p>
                          <p className="text-gray-900">{merchantKycData?.businessEmail || "Loading..."}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 grid grid-cols-1 items-center justify-between gap-6 border-b border-gray-200 pb-2 md:grid-cols-2">
                      <div className="flex gap-3">
                        <Shield className="mt-1 size-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Business Category</p>
                          <p className="capitalize text-gray-900">
                            {merchantKycData?.businessType?.replace("_", " ") || "Loading..."}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Globe className="mt-1 size-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Business Type</p>
                          <p className="capitalize text-gray-900">
                            {merchantKycData?.businessCategory || "Loading..."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 items-center justify-between gap-6 md:grid-cols-2">
                      <div className="flex gap-3">
                        <Map className="mt-1 size-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Business City</p>
                          <p className="text-gray-900">{merchantKycData?.businessCity || "Loading..."}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Building2 className="mt-1 size-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Business full address</p>
                          <p className="text-gray-900">{merchantKycData?.businessAddress || "Loading..."}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Information Section */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-4 grid grid-cols-1 items-center justify-between gap-6 border-b border-gray-200 pb-2 md:grid-cols-2">
                      <div className="flex gap-3">
                        <User className="mt-1 size-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="text-gray-900">
                            {merchantKycData
                              ? `${merchantKycData.firstName} ${merchantKycData.lastName}`
                              : "Loading..."}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Calendar className="mt-1 size-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Date of Birth</p>
                          <p className="text-gray-900">
                            {merchantKycData
                              ? new Date(merchantKycData.dateOfBirth).toLocaleDateString()
                              : "Loading..."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 items-center justify-between gap-6 md:grid-cols-2">
                      <div className="flex gap-3">
                        <Phone className="mt-1 size-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="text-gray-900">{merchantKycData?.phoneNumber || "Loading..."}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Globe className="mt-1 size-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="capitalize text-gray-900">{merchantKycData?.gender?.label || "Loading..."}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <Key className="size-5  text-gray-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Password</h4>
                      <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                    </div>
                  </div>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Change Password</button>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="size-5  text-gray-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                  </div>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Enable 2FA</button>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <Phone className="size-5  text-gray-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Phone Verification</h4>
                      <p className="text-sm text-gray-500">Verified: +234 800 000 0000</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-green-600">Verified</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "kyb" && (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
              </div>

              {/* KYB Verification Details */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">KYB Verification Details</h3>
              </div>

              {/* Verification Status */}
              <div
                className={`rounded-lg border p-6 ${
                  merchantKycData?.status?.value === 3
                    ? "border-green-200 bg-green-50"
                    : merchantKycData?.status?.value === 2
                    ? "border-yellow-200 bg-yellow-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="mb-4 flex items-center gap-3">
                  {merchantKycData?.status?.value === 3 ? (
                    <CheckCircle className="size-6 text-green-600" />
                  ) : merchantKycData?.status?.value === 2 ? (
                    <AlertCircle className="size-6 text-yellow-600" />
                  ) : (
                    <X className="size-6 text-red-600" />
                  )}
                  <div>
                    <h4
                      className={`text-lg font-semibold ${
                        merchantKycData?.status?.value === 3
                          ? "text-green-800"
                          : merchantKycData?.status?.value === 2
                          ? "text-yellow-800"
                          : "text-red-800"
                      }`}
                    >
                      KYB Verification
                    </h4>
                    <p
                      className={
                        merchantKycData?.status?.value === 3
                          ? "text-green-700"
                          : merchantKycData?.status?.value === 2
                          ? "text-yellow-700"
                          : "text-red-700"
                      }
                    >
                      {merchantKycData?.status?.label || "Not Started"}
                    </p>
                  </div>
                </div>
                <div
                  className={`rounded-lg p-4 ${
                    merchantKycData?.status?.value === 3
                      ? "bg-green-100"
                      : merchantKycData?.status?.value === 2
                      ? "bg-yellow-100"
                      : "bg-red-100"
                  }`}
                >
                  <p
                    className={`mb-2 font-medium ${
                      merchantKycData?.status?.value === 3
                        ? "text-green-800"
                        : merchantKycData?.status?.value === 2
                        ? "text-yellow-800"
                        : "text-red-800"
                    }`}
                  >
                    {merchantKycData?.status?.value === 3
                      ? "Verification complete"
                      : merchantKycData?.status?.value === 2
                      ? "Verification in progress"
                      : "Verification required"}
                  </p>
                  <p
                    className={`text-sm ${
                      merchantKycData?.status?.value === 3
                        ? "text-green-700"
                        : merchantKycData?.status?.value === 2
                        ? "text-yellow-700"
                        : "text-red-700"
                    }`}
                  >
                    {merchantKycData?.status?.value === 3
                      ? "Your business has been successfully verified. You can now accept payments and withdraw funds."
                      : merchantKycData?.status?.value === 2
                      ? "Your business verification is currently being reviewed. We will notify you once complete."
                      : "Complete your business verification to start accepting payments and withdrawing funds."}
                  </p>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Business Information</h4>

                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-sm text-gray-500">Business Name</p>
                      <p className="font-medium text-gray-900">{merchantKycData?.businessName || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-gray-500">Business Email</p>
                      <p className="font-medium text-gray-900">{merchantKycData?.businessEmail || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-gray-500">Business Category</p>
                      <p className="font-medium text-gray-900">{merchantKycData?.businessCategory || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-gray-500">Business Type</p>
                      <p className="font-medium text-gray-900">{merchantKycData?.businessType || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-gray-500">Business Address</p>
                      <p className="font-medium text-gray-900">{merchantKycData?.businessAddress || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-gray-500">Business City</p>
                      <p className="font-medium text-gray-900">{merchantKycData?.businessCity || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              {merchantKycData && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>

                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-900">
                          {merchantKycData.firstName} {merchantKycData.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{merchantKycData.businessEmail}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium text-gray-900">{merchantKycData.phoneNumber || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-gray-500">Date of Birth</p>
                        <p className="font-medium text-gray-900">
                          {merchantKycData.dateOfBirth
                            ? new Date(merchantKycData.dateOfBirth).toLocaleDateString()
                            : "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-gray-500">Gender</p>
                        <p className="font-medium text-gray-900">{merchantKycData?.gender?.label || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-gray-500">Identity Type</p>
                        <p className="font-medium text-gray-900">
                          {merchantKycData?.identityType?.label || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Section */}
              {merchantKycData && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Documents</h4>

                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="space-y-4">
                      {merchantKycData.proofOfAddress && (
                        <div className="flex items-center justify-between border-b border-gray-100 py-3">
                          <div className="flex items-center gap-3">
                            <FileText className="size-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">Proof of Address</p>
                              <p className="text-sm text-gray-500">Business verification document</p>
                            </div>
                          </div>
                          <button
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            onClick={() => window.open(merchantKycData.proofOfAddress, "_blank")}
                          >
                            View document
                          </button>
                        </div>
                      )}

                      {merchantKycData.certificateOfIncorporation && (
                        <div className="flex items-center justify-between border-b border-gray-100 py-3">
                          <div className="flex items-center gap-3">
                            <FileText className="size-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">Certificate of Incorporation</p>
                              <p className="text-sm text-gray-500">Business registration document</p>
                            </div>
                          </div>
                          <button
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            onClick={() => window.open(merchantKycData.certificateOfIncorporation, "_blank")}
                          >
                            View document
                          </button>
                        </div>
                      )}

                      {merchantKycData.memorandumOfAssociation && (
                        <div className="flex items-center justify-between border-b border-gray-100 py-3">
                          <div className="flex items-center gap-3">
                            <FileText className="size-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">Memorandum of Association</p>
                              <p className="text-sm text-gray-500">Business formation document</p>
                            </div>
                          </div>
                          <button
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            onClick={() => window.open(merchantKycData.memorandumOfAssociation, "_blank")}
                          >
                            View document
                          </button>
                        </div>
                      )}

                      {merchantKycData.statusReport && (
                        <div className="flex items-center justify-between border-b border-gray-100 py-3">
                          <div className="flex items-center gap-3">
                            <FileText className="size-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">TIN/VAT Certificate</p>
                              <p className="text-sm text-gray-500">Tax identification document</p>
                            </div>
                          </div>
                          <button
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            onClick={() => window.open(merchantKycData.statusReport, "_blank")}
                          >
                            View document
                          </button>
                        </div>
                      )}

                      {merchantKycData.identityDocumentFront && (
                        <div className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-3">
                            <FileText className="size-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">Identity Document</p>
                              <p className="text-sm text-gray-500">
                                {merchantKycData?.identityType?.label || "Identity"} verification
                              </p>
                            </div>
                          </div>
                          <button
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            onClick={() => window.open(merchantKycData.identityDocumentFront, "_blank")}
                          >
                            View document
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "bank" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Bank Details</h3>

              <div className="space-y-4">
                {isFetchingSettlementBank ? (
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                        <p className="mt-2 text-sm text-gray-500">Loading bank details...</p>
                      </div>
                    </div>
                  </div>
                ) : fetchSettlementBankError ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="flex items-center gap-3">
                      <X className="size-5 text-red-600" />
                      <div>
                        <h4 className="font-medium text-red-900">Error loading bank details</h4>
                        <p className="text-sm text-red-700">{fetchSettlementBankError}</p>
                      </div>
                    </div>
                  </div>
                ) : settlementBankData?.bankName && settlementBankData?.accountNumber ? (
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="size-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Primary Bank Account</h4>
                          <p className="text-sm text-gray-500">Default account for withdrawals</p>
                        </div>
                      </div>
                      <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Edit</button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Bank Name:</span>
                        <span className="text-gray-900">{settlementBankData.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Account Number:</span>
                        <span className="text-gray-900">{settlementBankData.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Account Name:</span>
                        <span className="text-gray-900">{settlementBankData.accountName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">BVN:</span>
                        <span className="text-gray-900">{settlementBankData.bvn}</span>
                      </div>
                      {settlementBankData.accountVerifiedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Account Verified:</span>
                          <span className="text-gray-900">
                            {new Date(settlementBankData.accountVerifiedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="py-8 text-center">
                      <CreditCard className="mx-auto size-12 text-gray-400" />
                      <h4 className="mt-4 font-medium text-gray-900">No Bank Account Added</h4>
                      <p className="mt-2 text-sm text-gray-500">
                        Add your settlement bank account to start receiving payments
                      </p>
                      <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        Add Bank Account
                      </button>
                    </div>
                  </div>
                )}

                <button className="w-full rounded-lg border border-gray-300 bg-white p-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  + Add Another Bank Account
                </button>
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">API Keys & Webhooks</h3>

              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <Key className="size-5  text-gray-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">API Keys</h4>
                        <p className="text-sm text-gray-500">Manage your API access keys</p>
                      </div>
                    </div>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Generate New Key</button>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <span className="text-sm font-medium text-gray-900">Live API Key</span>
                        <span className="w-fit rounded bg-green-50 px-2 py-1 text-xs text-green-600">Active</span>
                      </div>
                      <div className="flex flex-col gap-2 md:flex-row md:items-center">
                        <code
                          className={`text-xs ${
                            showLiveKey ? "text-gray-600" : "text-gray-400 blur-sm"
                          } flex-1 break-all`}
                        >
                          pk_live_1234567890abcdef...
                        </code>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setShowLiveKey(!showLiveKey)}
                            className="rounded p-1 hover:bg-gray-200"
                            title={showLiveKey ? "Hide key" : "Show key"}
                          >
                            {showLiveKey ? (
                              <EyeOff className="size-4 text-gray-600" />
                            ) : (
                              <Eye className="size-4 text-gray-600" />
                            )}
                          </button>
                          <button
                            onClick={() => handleCopy("pk_live_1234567890abcdef...", "live")}
                            className="rounded p-1 hover:bg-gray-200"
                            title={copiedLiveKey ? "Copied!" : "Copy key"}
                          >
                            {copiedLiveKey ? (
                              <Check className="size-4 text-green-600" />
                            ) : (
                              <Copy className="size-4 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <span className="text-sm font-medium text-gray-900">Test API Key</span>
                        <span className="w-fit rounded bg-blue-50 px-2 py-1 text-xs text-blue-600">Test</span>
                      </div>
                      <div className="flex flex-col gap-2 md:flex-row md:items-center">
                        <code
                          className={`text-xs ${
                            showTestKey ? "text-gray-600" : "text-gray-400 blur-sm"
                          } flex-1 break-all`}
                        >
                          pk_test_abcdef1234567890...
                        </code>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setShowTestKey(!showTestKey)}
                            className="rounded p-1 hover:bg-gray-200"
                            title={showTestKey ? "Hide key" : "Show key"}
                          >
                            {showTestKey ? (
                              <EyeOff className="size-4 text-gray-600" />
                            ) : (
                              <Eye className="size-4 text-gray-600" />
                            )}
                          </button>
                          <button
                            onClick={() => handleCopy("pk_test_abcdef1234567890...", "test")}
                            className="rounded p-1 hover:bg-gray-200"
                            title={copiedTestKey ? "Copied!" : "Copy key"}
                          >
                            {copiedTestKey ? (
                              <Check className="size-4 text-green-600" />
                            ) : (
                              <Copy className="size-4 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <Webhook className="size-5  text-gray-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Webhooks</h4>
                        <p className="text-sm text-gray-500">Configure webhook endpoints</p>
                      </div>
                    </div>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Add Webhook</button>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <span className="text-sm font-medium text-gray-900">Payment Events</span>
                        <span className="w-fit rounded bg-green-50 px-2 py-1 text-xs text-green-600">Active</span>
                      </div>
                      <code className="break-all text-xs text-gray-600">https://your-domain.com/webhooks/payments</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save/Cancel Buttons */}
          {isEditing && (
            <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-6">
              <button
                onClick={handleCancel}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Save className="size-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Tag Modal */}
      <AddTagModal isOpen={isTagModalOpen} onClose={() => setIsTagModalOpen(false)} currentTag={user?.tag ?? null} />
    </>
  )
}
