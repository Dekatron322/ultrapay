// src/lib/redux/merchantKycSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { api } from "./authSlice"
import { API_ENDPOINTS, buildApiUrl } from "lib/config/api"

// Interfaces for Merchant KYC
export interface PersonalInfoRequest {
  firstName: string
  lastName: string
  phoneNumber: string
  dateOfBirth: string
  gender: number
}

export interface PersonalInfoResponse {
  isSuccess: boolean
  message: string
  data?: any
}

export interface VerifyPhoneRequest {
  otp: string
}

export interface VerifyPhoneResponse {
  isSuccess: boolean
  message: string
  data?: any
}

export interface ResendPhoneOtpRequest {
  phoneNumber: string
}

export interface ResendPhoneOtpResponse {
  isSuccess: boolean
  message: string
  data?: any
}

export interface IdentityVerificationRequest {
  identityType: number
  identityNumber: string
  identityDocumentFront: string
  termsAccepted: boolean
}

export interface IdentityVerificationResponse {
  isSuccess: boolean
  message: string
  data?: any
}

export interface KycStatusResponse {
  isSuccess: boolean
  message: string
  data: {
    status: {
      label: string
      value: number
    }
    message: string | null
    uploadedDate: string | null
    isPhoneConfirmed: boolean
  }
}

// Merchant KYC State
interface MerchantKycState {
  // Personal Info state
  isSubmittingPersonalInfo: boolean
  personalInfoError: string | null
  personalInfoSuccess: boolean
  personalInfoData: any | null

  // Phone Verification state
  isVerifyingPhone: boolean
  phoneVerificationError: string | null
  phoneVerificationSuccess: boolean
  phoneVerificationData: any | null

  // Resend Phone OTP state
  isResendingPhoneOtp: boolean
  resendPhoneOtpError: string | null
  resendPhoneOtpSuccess: boolean
  resendPhoneOtpData: any | null

  // Identity Verification state
  isSubmittingIdentityVerification: boolean
  identityVerificationError: string | null
  identityVerificationSuccess: boolean
  identityVerificationData: any | null

  // KYC Status state
  isFetchingKycStatus: boolean
  kycStatusError: string | null
  kycStatus: KycStatusResponse["data"] | null

  // General state
  loading: boolean
  error: string | null
}

// Initial state
const initialState: MerchantKycState = {
  isSubmittingPersonalInfo: false,
  personalInfoError: null,
  personalInfoSuccess: false,
  personalInfoData: null,
  isVerifyingPhone: false,
  phoneVerificationError: null,
  phoneVerificationSuccess: false,
  phoneVerificationData: null,
  isResendingPhoneOtp: false,
  resendPhoneOtpError: null,
  resendPhoneOtpSuccess: false,
  resendPhoneOtpData: null,
  isSubmittingIdentityVerification: false,
  identityVerificationError: null,
  identityVerificationSuccess: false,
  identityVerificationData: null,
  isFetchingKycStatus: false,
  kycStatusError: null,
  kycStatus: null,
  loading: false,
  error: null,
}

// Async thunks
export const submitPersonalInfo = createAsyncThunk(
  "merchantKyc/submitPersonalInfo",
  async (personalInfoData: PersonalInfoRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<PersonalInfoResponse>(
        buildApiUrl(API_ENDPOINTS.MERCHANT_KYC.PERSONAL_INFO),
        personalInfoData
      )

      if (!response.data.isSuccess) {
        return rejectWithValue(response.data.message || "Failed to submit personal information")
      }

      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || "Failed to submit personal information")
      }
      return rejectWithValue(error.message || "Network error during personal information submission")
    }
  }
)

export const verifyPhone = createAsyncThunk(
  "merchantKyc/verifyPhone",
  async (otpData: VerifyPhoneRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<VerifyPhoneResponse>(
        buildApiUrl(API_ENDPOINTS.MERCHANT_KYC.VERIFY_PHONE),
        otpData
      )

      if (!response.data.isSuccess) {
        return rejectWithValue(response.data.message || "Failed to verify phone number")
      }

      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || "Failed to verify phone number")
      }
      return rejectWithValue(error.message || "Network error during phone verification")
    }
  }
)

export const resendPhoneOtp = createAsyncThunk(
  "merchantKyc/resendPhoneOtp",
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      const response = await api.post<ResendPhoneOtpResponse>(
        buildApiUrl(API_ENDPOINTS.MERCHANT_KYC.RESEND_PHONE_OTP),
        { phoneNumber }
      )

      if (!response.data.isSuccess) {
        return rejectWithValue(response.data.message || "Failed to resend phone OTP")
      }

      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || "Failed to resend phone OTP")
      }
      return rejectWithValue(error.message || "Network error during phone OTP resend")
    }
  }
)

export const verifyIdentity = createAsyncThunk(
  "merchantKyc/verifyIdentity",
  async (identityData: IdentityVerificationRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<IdentityVerificationResponse>(
        buildApiUrl(API_ENDPOINTS.MERCHANT_KYC.IDENTITY_VERIFICATION),
        identityData
      )

      if (!response.data.isSuccess) {
        return rejectWithValue(response.data.message || "Failed to verify identity")
      }

      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || "Failed to verify identity")
      }
      return rejectWithValue(error.message || "Network error during identity verification")
    }
  }
)

export const fetchKycStatus = createAsyncThunk("merchantKyc/fetchKycStatus", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<KycStatusResponse>(buildApiUrl(API_ENDPOINTS.MERCHANT_KYC.KYC_STATUS))

    if (!response.data.isSuccess) {
      return rejectWithValue(response.data.message || "Failed to fetch KYC status")
    }

    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      return rejectWithValue(error.response.data.message || "Failed to fetch KYC status")
    }
    return rejectWithValue(error.message || "Network error while fetching KYC status")
  }
})

// Merchant KYC slice
const merchantKycSlice = createSlice({
  name: "merchantKyc",
  initialState,
  reducers: {
    // Clear personal info status
    clearPersonalInfoStatus: (state) => {
      state.personalInfoError = null
      state.personalInfoSuccess = false
      state.personalInfoData = null
    },

    // Clear phone verification status
    clearPhoneVerificationStatus: (state) => {
      state.phoneVerificationError = null
      state.phoneVerificationSuccess = false
      state.phoneVerificationData = null
    },

    // Clear resend phone OTP status
    clearResendPhoneOtpStatus: (state) => {
      state.resendPhoneOtpError = null
      state.resendPhoneOtpSuccess = false
      state.resendPhoneOtpData = null
    },

    // Clear identity verification status
    clearIdentityVerificationStatus: (state) => {
      state.identityVerificationError = null
      state.identityVerificationSuccess = false
      state.identityVerificationData = null
    },

    // Clear all errors
    clearErrors: (state) => {
      state.error = null
      state.personalInfoError = null
      state.phoneVerificationError = null
      state.resendPhoneOtpError = null
      state.identityVerificationError = null
      state.kycStatusError = null
    },

    // Reset state
    resetMerchantKycState: (state) => {
      state.isSubmittingPersonalInfo = false
      state.personalInfoError = null
      state.personalInfoSuccess = false
      state.personalInfoData = null
      state.isVerifyingPhone = false
      state.phoneVerificationError = null
      state.phoneVerificationSuccess = false
      state.phoneVerificationData = null
      state.isResendingPhoneOtp = false
      state.resendPhoneOtpError = null
      state.resendPhoneOtpSuccess = false
      state.resendPhoneOtpData = null
      state.isSubmittingIdentityVerification = false
      state.identityVerificationError = null
      state.identityVerificationSuccess = false
      state.identityVerificationData = null
      state.isFetchingKycStatus = false
      state.kycStatusError = null
      state.kycStatus = null
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit personal info cases
      .addCase(submitPersonalInfo.pending, (state) => {
        state.isSubmittingPersonalInfo = true
        state.personalInfoError = null
        state.personalInfoSuccess = false
        state.personalInfoData = null
      })
      .addCase(submitPersonalInfo.fulfilled, (state, action: PayloadAction<PersonalInfoResponse>) => {
        state.isSubmittingPersonalInfo = false
        state.personalInfoSuccess = true
        state.personalInfoError = null
        state.personalInfoData = action.payload.data || null
      })
      .addCase(submitPersonalInfo.rejected, (state, action) => {
        state.isSubmittingPersonalInfo = false
        state.personalInfoError = (action.payload as string) || "Failed to submit personal information"
        state.personalInfoSuccess = false
        state.personalInfoData = null
      })
      // Verify phone cases
      .addCase(verifyPhone.pending, (state) => {
        state.isVerifyingPhone = true
        state.phoneVerificationError = null
        state.phoneVerificationSuccess = false
        state.phoneVerificationData = null
      })
      .addCase(verifyPhone.fulfilled, (state, action: PayloadAction<VerifyPhoneResponse>) => {
        state.isVerifyingPhone = false
        state.phoneVerificationSuccess = true
        state.phoneVerificationError = null
        state.phoneVerificationData = action.payload.data || null
      })
      .addCase(verifyPhone.rejected, (state, action) => {
        state.isVerifyingPhone = false
        state.phoneVerificationError = (action.payload as string) || "Failed to verify phone number"
        state.phoneVerificationSuccess = false
        state.phoneVerificationData = null
      })
      // Resend phone OTP cases
      .addCase(resendPhoneOtp.pending, (state) => {
        state.isResendingPhoneOtp = true
        state.resendPhoneOtpError = null
        state.resendPhoneOtpSuccess = false
        state.resendPhoneOtpData = null
      })
      .addCase(resendPhoneOtp.fulfilled, (state, action: PayloadAction<ResendPhoneOtpResponse>) => {
        state.isResendingPhoneOtp = false
        state.resendPhoneOtpSuccess = true
        state.resendPhoneOtpError = null
        state.resendPhoneOtpData = action.payload.data || null
      })
      .addCase(resendPhoneOtp.rejected, (state, action) => {
        state.isResendingPhoneOtp = false
        state.resendPhoneOtpError = (action.payload as string) || "Failed to resend phone OTP"
        state.resendPhoneOtpSuccess = false
        state.resendPhoneOtpData = null
      })
      // Identity Verification cases
      .addCase(verifyIdentity.pending, (state) => {
        state.isSubmittingIdentityVerification = true
        state.identityVerificationError = null
        state.identityVerificationSuccess = false
        state.identityVerificationData = null
      })
      .addCase(verifyIdentity.fulfilled, (state, action: PayloadAction<IdentityVerificationResponse>) => {
        state.isSubmittingIdentityVerification = false
        state.identityVerificationSuccess = true
        state.identityVerificationError = null
        state.identityVerificationData = action.payload.data || null
      })
      .addCase(verifyIdentity.rejected, (state, action) => {
        state.isSubmittingIdentityVerification = false
        state.identityVerificationError = (action.payload as string) || "Failed to verify identity"
        state.identityVerificationSuccess = false
        state.identityVerificationData = null
      })
      // KYC Status cases
      .addCase(fetchKycStatus.pending, (state) => {
        state.isFetchingKycStatus = true
        state.kycStatusError = null
        state.kycStatus = null
      })
      .addCase(fetchKycStatus.fulfilled, (state, action: PayloadAction<KycStatusResponse>) => {
        state.isFetchingKycStatus = false
        state.kycStatus = action.payload.data
        state.kycStatusError = null
      })
      .addCase(fetchKycStatus.rejected, (state, action) => {
        state.isFetchingKycStatus = false
        state.kycStatusError = (action.payload as string) || "Failed to fetch KYC status"
        state.kycStatus = null
      })
  },
})

export const {
  clearPersonalInfoStatus,
  clearPhoneVerificationStatus,
  clearResendPhoneOtpStatus,
  clearIdentityVerificationStatus,
  clearErrors,
  resetMerchantKycState,
} = merchantKycSlice.actions

export default merchantKycSlice.reducer
