// src/lib/redux/businessInfoSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { api } from "./authSlice"
import { API_ENDPOINTS, buildApiUrl } from "lib/config/api"

// Interfaces for Business Information
export interface BusinessInfoRequest {
  businessName: string
  businessEmail: string
  businessType: string
  businessCategory: string
}

export interface BusinessAddressRequest {
  countryId: number
  address: string
  city: string
  proofOfAddress: string
}

export interface BusinessFormationRequest {
  certificateOfIncorporation?: string
  memorandumOfAssociation?: string
  statusReport?: string
}

export interface BusinessLogoRequest {
  logo: string
}

export interface RepresentativeInfoRequest {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  position: string
}

export interface BusinessInfoData {
  businessName: string
  businessEmail: string
  businessType: string
  businessCategory: string
}

export interface BusinessAddressData {
  countryId: number
  address: string
  city: string
  proofOfAddress: string
}

export interface BusinessFormationData {
  certificateOfIncorporation?: string
  memorandumOfAssociation?: string
  statusReport?: string
}

export interface BusinessInfoResponse {
  isSuccess: boolean
  message: string
  data: BusinessInfoData
}

export interface BusinessAddressResponse {
  isSuccess: boolean
  message: string
  data: BusinessAddressData
}

export interface BusinessFormationResponse {
  isSuccess: boolean
  message: string
  data: BusinessFormationData
}

export interface BusinessLogoResponse {
  isSuccess: boolean
  message: string
  data: BusinessLogoData
}

export interface RepresentativeInfoResponse {
  isSuccess: boolean
  message: string
  data: RepresentativeInfoData
}

export interface BusinessLogoData {
  logo: string
}

export interface RepresentativeInfoData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  position: string
}

// Business Information State
interface BusinessInfoState {
  // Add Business Info state
  isAddingBusinessInfo: boolean
  addBusinessInfoError: string | null
  addBusinessInfoSuccess: boolean
  businessInfoData: BusinessInfoData | null
  businessInfoMessage: string | null

  // Add Business Address state
  isAddingBusinessAddress: boolean
  addBusinessAddressError: string | null
  addBusinessAddressSuccess: boolean
  businessAddressData: BusinessAddressData | null
  businessAddressMessage: string | null

  // Add Business Formation state
  isAddingBusinessFormation: boolean
  addBusinessFormationError: string | null
  addBusinessFormationSuccess: boolean
  businessFormationData: BusinessFormationData | null
  businessFormationMessage: string | null

  // Upload Business Logo state
  isUploadingBusinessLogo: boolean
  uploadBusinessLogoError: string | null
  uploadBusinessLogoSuccess: boolean
  businessLogoData: BusinessLogoData | null
  businessLogoMessage: string | null

  // Add Representative Info state
  isAddingRepresentativeInfo: boolean
  addRepresentativeInfoError: string | null
  addRepresentativeInfoSuccess: boolean
  representativeInfoData: RepresentativeInfoData | null
  representativeInfoMessage: string | null

  // Get Business Info state
  isFetchingBusinessInfo: boolean
  fetchBusinessInfoError: string | null
  businessInfo: BusinessInfoData | null

  // General state
  loading: boolean
  error: string | null
}

// Initial state
const initialState: BusinessInfoState = {
  isAddingBusinessInfo: false,
  addBusinessInfoError: null,
  addBusinessInfoSuccess: false,
  businessInfoData: null,
  businessInfoMessage: null,
  isAddingBusinessAddress: false,
  addBusinessAddressError: null,
  addBusinessAddressSuccess: false,
  businessAddressData: null,
  businessAddressMessage: null,
  isAddingBusinessFormation: false,
  addBusinessFormationError: null,
  addBusinessFormationSuccess: false,
  businessFormationData: null,
  businessFormationMessage: null,
  isUploadingBusinessLogo: false,
  uploadBusinessLogoError: null,
  uploadBusinessLogoSuccess: false,
  businessLogoData: null,
  businessLogoMessage: null,
  isAddingRepresentativeInfo: false,
  addRepresentativeInfoError: null,
  addRepresentativeInfoSuccess: false,
  representativeInfoData: null,
  representativeInfoMessage: null,
  isFetchingBusinessInfo: false,
  fetchBusinessInfoError: null,
  businessInfo: null,
  loading: false,
  error: null,
}

// Async thunk for adding business information
export const addBusinessInfo = createAsyncThunk(
  "businessInfo/addBusinessInfo",
  async (businessData: BusinessInfoRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<BusinessInfoResponse>(
        buildApiUrl(API_ENDPOINTS.BUSINESS_INFORMATION.BUSINESS_INFO),
        businessData
      )

      if (!response.data.isSuccess) {
        return rejectWithValue(response.data.message || "Failed to add business information")
      }

      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || "Failed to add business information")
      }
      return rejectWithValue(error.message || "Network error during business information addition")
    }
  }
)

// Async thunk for fetching business information
export const getBusinessInfo = createAsyncThunk("businessInfo/getBusinessInfo", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<BusinessInfoResponse>(buildApiUrl(API_ENDPOINTS.BUSINESS_INFORMATION.BUSINESS_INFO))

    if (!response.data.isSuccess) {
      return rejectWithValue(response.data.message || "Failed to fetch business information")
    }

    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      return rejectWithValue(error.response.data.message || "Failed to fetch business information")
    }
    return rejectWithValue(error.message || "Network error while fetching business information")
  }
})

// Async thunk for adding business address
export const addBusinessAddress = createAsyncThunk(
  "businessInfo/addBusinessAddress",
  async (addressData: BusinessAddressRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<BusinessAddressResponse>(
        buildApiUrl(API_ENDPOINTS.BUSINESS_INFORMATION.BUSINESS_ADDRESS),
        addressData
      )

      if (!response.data.isSuccess) {
        return rejectWithValue(response.data.message || "Failed to add business address")
      }

      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || "Failed to add business address")
      }
      return rejectWithValue(error.message || "Network error during business address addition")
    }
  }
)

// Async thunk for adding business formation
export const addBusinessFormation = createAsyncThunk(
  "businessInfo/addBusinessFormation",
  async (formationData: BusinessFormationRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<BusinessFormationResponse>(
        buildApiUrl(API_ENDPOINTS.BUSINESS_INFORMATION.BUSINESS_FORMATION),
        formationData
      )

      if (!response.data.isSuccess) {
        return rejectWithValue(response.data.message || "Failed to add business formation")
      }

      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || "Failed to add business formation")
      }
      return rejectWithValue(error.message || "Network error during business formation addition")
    }
  }
)

// Async thunk for uploading business logo
export const uploadBusinessLogo = createAsyncThunk(
  "businessInfo/uploadBusinessLogo",
  async (logoData: BusinessLogoRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<BusinessLogoResponse>(
        buildApiUrl(API_ENDPOINTS.BUSINESS_INFORMATION.BUSINESS_LOG),
        logoData
      )

      if (!response.data.isSuccess) {
        return rejectWithValue(response.data.message || "Failed to upload business logo")
      }

      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || "Failed to upload business logo")
      }
      return rejectWithValue(error.message || "Network error during business logo upload")
    }
  }
)

// Async thunk for adding representative info
export const addRepresentativeInfo = createAsyncThunk(
  "businessInfo/addRepresentativeInfo",
  async (representativeData: RepresentativeInfoRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<RepresentativeInfoResponse>(
        buildApiUrl(API_ENDPOINTS.BUSINESS_INFORMATION.REPRESENTATIVE_INFO),
        representativeData
      )

      if (!response.data.isSuccess) {
        return rejectWithValue(response.data.message || "Failed to add representative information")
      }

      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || "Failed to add representative information")
      }
      return rejectWithValue(error.message || "Network error during representative information addition")
    }
  }
)

// Business Information slice
const businessInfoSlice = createSlice({
  name: "businessInfo",
  initialState,
  reducers: {
    // Clear add business info status
    clearAddBusinessInfoStatus: (state) => {
      state.addBusinessInfoError = null
      state.addBusinessInfoSuccess = false
      state.businessInfoData = null
      state.businessInfoMessage = null
    },

    // Clear add business address status
    clearAddBusinessAddressStatus: (state) => {
      state.addBusinessAddressError = null
      state.addBusinessAddressSuccess = false
      state.businessAddressData = null
      state.businessAddressMessage = null
    },

    // Clear add business formation status
    clearAddBusinessFormationStatus: (state) => {
      state.addBusinessFormationError = null
      state.addBusinessFormationSuccess = false
      state.businessFormationData = null
      state.businessFormationMessage = null
    },

    // Clear upload business logo status
    clearUploadBusinessLogoStatus: (state) => {
      state.uploadBusinessLogoError = null
      state.uploadBusinessLogoSuccess = false
      state.businessLogoData = null
      state.businessLogoMessage = null
    },

    // Clear add representative info status
    clearAddRepresentativeInfoStatus: (state) => {
      state.addRepresentativeInfoError = null
      state.addRepresentativeInfoSuccess = false
      state.representativeInfoData = null
      state.representativeInfoMessage = null
    },

    // Clear fetch business info status
    clearFetchBusinessInfoStatus: (state) => {
      state.fetchBusinessInfoError = null
      state.businessInfo = null
    },

    // Clear all errors
    clearErrors: (state) => {
      state.error = null
      state.addBusinessInfoError = null
      state.addBusinessAddressError = null
      state.addBusinessFormationError = null
      state.uploadBusinessLogoError = null
      state.addRepresentativeInfoError = null
      state.fetchBusinessInfoError = null
    },

    // Reset state
    resetBusinessInfoState: (state) => {
      state.isAddingBusinessInfo = false
      state.addBusinessInfoError = null
      state.addBusinessInfoSuccess = false
      state.businessInfoData = null
      state.businessInfoMessage = null
      state.isAddingBusinessAddress = false
      state.addBusinessAddressError = null
      state.addBusinessAddressSuccess = false
      state.businessAddressData = null
      state.businessAddressMessage = null
      state.isAddingBusinessFormation = false
      state.addBusinessFormationError = null
      state.addBusinessFormationSuccess = false
      state.businessFormationData = null
      state.businessFormationMessage = null
      state.isUploadingBusinessLogo = false
      state.uploadBusinessLogoError = null
      state.uploadBusinessLogoSuccess = false
      state.businessLogoData = null
      state.businessLogoMessage = null
      state.isAddingRepresentativeInfo = false
      state.addRepresentativeInfoError = null
      state.addRepresentativeInfoSuccess = false
      state.representativeInfoData = null
      state.representativeInfoMessage = null
      state.isFetchingBusinessInfo = false
      state.fetchBusinessInfoError = null
      state.businessInfo = null
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Business Info cases
      .addCase(addBusinessInfo.pending, (state) => {
        state.isAddingBusinessInfo = true
        state.addBusinessInfoError = null
        state.addBusinessInfoSuccess = false
        state.businessInfoData = null
      })
      .addCase(addBusinessInfo.fulfilled, (state, action: PayloadAction<BusinessInfoResponse>) => {
        state.isAddingBusinessInfo = false
        state.addBusinessInfoSuccess = true
        state.addBusinessInfoError = null
        state.businessInfoData = action.payload.data
        state.businessInfoMessage = action.payload.message
      })
      .addCase(addBusinessInfo.rejected, (state, action) => {
        state.isAddingBusinessInfo = false
        state.addBusinessInfoError = (action.payload as string) || "Failed to add business information"
        state.addBusinessInfoSuccess = false
        state.businessInfoData = null
      })
      // Get Business Info cases
      .addCase(getBusinessInfo.pending, (state) => {
        state.isFetchingBusinessInfo = true
        state.fetchBusinessInfoError = null
        state.businessInfo = null
      })
      .addCase(getBusinessInfo.fulfilled, (state, action: PayloadAction<BusinessInfoResponse>) => {
        state.isFetchingBusinessInfo = false
        state.fetchBusinessInfoError = null
        state.businessInfo = action.payload.data
      })
      .addCase(getBusinessInfo.rejected, (state, action) => {
        state.isFetchingBusinessInfo = false
        state.fetchBusinessInfoError = (action.payload as string) || "Failed to fetch business information"
        state.businessInfo = null
      })
      // Add Business Address cases
      .addCase(addBusinessAddress.pending, (state) => {
        state.isAddingBusinessAddress = true
        state.addBusinessAddressError = null
        state.addBusinessAddressSuccess = false
        state.businessAddressData = null
      })
      .addCase(addBusinessAddress.fulfilled, (state, action: PayloadAction<BusinessAddressResponse>) => {
        state.isAddingBusinessAddress = false
        state.addBusinessAddressSuccess = true
        state.addBusinessAddressError = null
        state.businessAddressData = action.payload.data
        state.businessAddressMessage = action.payload.message
      })
      .addCase(addBusinessAddress.rejected, (state, action) => {
        state.isAddingBusinessAddress = false
        state.addBusinessAddressError = (action.payload as string) || "Failed to add business address"
        state.addBusinessAddressSuccess = false
        state.businessAddressData = null
      })
      // Add Business Formation cases
      .addCase(addBusinessFormation.pending, (state) => {
        state.isAddingBusinessFormation = true
        state.addBusinessFormationError = null
        state.addBusinessFormationSuccess = false
        state.businessFormationData = null
      })
      .addCase(addBusinessFormation.fulfilled, (state, action: PayloadAction<BusinessFormationResponse>) => {
        state.isAddingBusinessFormation = false
        state.addBusinessFormationSuccess = true
        state.addBusinessFormationError = null
        state.businessFormationData = action.payload.data
        state.businessFormationMessage = action.payload.message
      })
      .addCase(addBusinessFormation.rejected, (state, action) => {
        state.isAddingBusinessFormation = false
        state.addBusinessFormationError = (action.payload as string) || "Failed to add business formation"
        state.addBusinessFormationSuccess = false
        state.businessFormationData = null
      })
      // Upload Business Logo cases
      .addCase(uploadBusinessLogo.pending, (state) => {
        state.isUploadingBusinessLogo = true
        state.uploadBusinessLogoError = null
        state.uploadBusinessLogoSuccess = false
        state.businessLogoData = null
      })
      .addCase(uploadBusinessLogo.fulfilled, (state, action: PayloadAction<BusinessLogoResponse>) => {
        state.isUploadingBusinessLogo = false
        state.uploadBusinessLogoSuccess = true
        state.uploadBusinessLogoError = null
        state.businessLogoData = action.payload.data
        state.businessLogoMessage = action.payload.message
      })
      .addCase(uploadBusinessLogo.rejected, (state, action) => {
        state.isUploadingBusinessLogo = false
        state.uploadBusinessLogoError = (action.payload as string) || "Failed to upload business logo"
        state.uploadBusinessLogoSuccess = false
        state.businessLogoData = null
      })
      // Add Representative Info cases
      .addCase(addRepresentativeInfo.pending, (state) => {
        state.isAddingRepresentativeInfo = true
        state.addRepresentativeInfoError = null
        state.addRepresentativeInfoSuccess = false
        state.representativeInfoData = null
      })
      .addCase(addRepresentativeInfo.fulfilled, (state, action: PayloadAction<RepresentativeInfoResponse>) => {
        state.isAddingRepresentativeInfo = false
        state.addRepresentativeInfoSuccess = true
        state.addRepresentativeInfoError = null
        state.representativeInfoData = action.payload.data
        state.representativeInfoMessage = action.payload.message
      })
      .addCase(addRepresentativeInfo.rejected, (state, action) => {
        state.isAddingRepresentativeInfo = false
        state.addRepresentativeInfoError = (action.payload as string) || "Failed to add representative information"
        state.addRepresentativeInfoSuccess = false
        state.representativeInfoData = null
      })
  },
})

export const {
  clearAddBusinessInfoStatus,
  clearAddBusinessAddressStatus,
  clearAddBusinessFormationStatus,
  clearUploadBusinessLogoStatus,
  clearAddRepresentativeInfoStatus,
  clearFetchBusinessInfoStatus,
  clearErrors,
  resetBusinessInfoState,
} = businessInfoSlice.actions

export default businessInfoSlice.reducer
