// src/lib/redux/settlementBankSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { api } from "./authSlice"
import { API_ENDPOINTS, buildApiUrl } from "lib/config/api"

// Interfaces for Settlement Bank BVN
export interface AddBvnRequest {
  bvn: string
}

export interface AddBankRequest {
  bankCode: string
  bankName: string
  accountNumber: string
  accountName: string
}

export interface BvnData {
  bvn: string
  bvnVerifiedAt: string
  bankCode: string | null
  bankName: string | null
  accountNumber: string | null
  accountName: string | null
  accountVerifiedAt: string | null
}

export interface AddBvnResponse {
  isSuccess: boolean
  message: string
  data: BvnData
}

export interface AddBankResponse {
  isSuccess: boolean
  message: string
  data: BvnData
}

export interface GetSettlementBankResponse {
  isSuccess: boolean
  message: string
  data: BvnData
}

// Settlement Bank State
interface SettlementBankState {
  // Add BVN state
  isAddingBvn: boolean
  addBvnError: string | null
  addBvnSuccess: boolean
  bvnData: BvnData | null

  // Add Bank state
  isAddingBank: boolean
  addBankError: string | null
  addBankSuccess: boolean
  bankData: BvnData | null

  // Get Settlement Bank state
  isFetchingSettlementBank: boolean
  fetchSettlementBankError: string | null
  settlementBankData: BvnData | null

  // General state
  loading: boolean
  error: string | null
}

// Initial state
const initialState: SettlementBankState = {
  isAddingBvn: false,
  addBvnError: null,
  addBvnSuccess: false,
  bvnData: null,
  isAddingBank: false,
  addBankError: null,
  addBankSuccess: false,
  bankData: null,
  isFetchingSettlementBank: false,
  fetchSettlementBankError: null,
  settlementBankData: null,
  loading: false,
  error: null,
}

// Async thunk for adding BVN
export const addSettlementBankBvn = createAsyncThunk(
  "settlementBank/addBvn",
  async (bvnData: AddBvnRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<AddBvnResponse>(buildApiUrl(API_ENDPOINTS.SETTLEMENT_BANK.ADD), bvnData)

      if (!response.data.isSuccess) {
        return rejectWithValue(response.data.message || "Failed to add BVN")
      }

      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || "Failed to add BVN")
      }
      return rejectWithValue(error.message || "Network error during BVN addition")
    }
  }
)

// Async thunk for adding bank account
export const addSettlementBankAccount = createAsyncThunk(
  "settlementBank/addBank",
  async (bankData: AddBankRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<AddBankResponse>(buildApiUrl(API_ENDPOINTS.SETTLEMENT_BANK.ADD_BANK), bankData)

      if (!response.data.isSuccess) {
        return rejectWithValue(response.data.message || "Failed to add bank account")
      }

      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || "Failed to add bank account")
      }
      return rejectWithValue(error.message || "Network error during bank account addition")
    }
  }
)

// Async thunk for fetching settlement bank information
export const getSettlementBank = createAsyncThunk(
  "settlementBank/getSettlementBank",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<GetSettlementBankResponse>(
        buildApiUrl(API_ENDPOINTS.SETTLEMENT_BANK.GET_SETTLEMENT_BANK)
      )

      if (!response.data.isSuccess) {
        return rejectWithValue(response.data.message || "Failed to fetch settlement bank information")
      }

      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || "Failed to fetch settlement bank information")
      }
      return rejectWithValue(error.message || "Network error while fetching settlement bank information")
    }
  }
)

// Settlement Bank slice
const settlementBankSlice = createSlice({
  name: "settlementBank",
  initialState,
  reducers: {
    // Clear add BVN status
    clearAddBvnStatus: (state) => {
      state.addBvnError = null
      state.addBvnSuccess = false
      state.bvnData = null
    },

    // Clear add Bank status
    clearAddBankStatus: (state) => {
      state.addBankError = null
      state.addBankSuccess = false
      state.bankData = null
    },

    // Clear get Settlement Bank status
    clearFetchSettlementBankStatus: (state) => {
      state.fetchSettlementBankError = null
      state.settlementBankData = null
    },

    // Clear all errors
    clearErrors: (state) => {
      state.error = null
      state.addBvnError = null
      state.addBankError = null
      state.fetchSettlementBankError = null
    },

    // Reset state
    resetSettlementBankState: (state) => {
      state.isAddingBvn = false
      state.addBvnError = null
      state.addBvnSuccess = false
      state.bvnData = null
      state.isAddingBank = false
      state.addBankError = null
      state.addBankSuccess = false
      state.bankData = null
      state.isFetchingSettlementBank = false
      state.fetchSettlementBankError = null
      state.settlementBankData = null
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Add BVN cases
      .addCase(addSettlementBankBvn.pending, (state) => {
        state.isAddingBvn = true
        state.addBvnError = null
        state.addBvnSuccess = false
        state.bvnData = null
      })
      .addCase(addSettlementBankBvn.fulfilled, (state, action: PayloadAction<AddBvnResponse>) => {
        state.isAddingBvn = false
        state.addBvnSuccess = true
        state.addBvnError = null
        state.bvnData = action.payload.data
      })
      .addCase(addSettlementBankBvn.rejected, (state, action) => {
        state.isAddingBvn = false
        state.addBvnError = (action.payload as string) || "Failed to add BVN"
        state.addBvnSuccess = false
        state.bvnData = null
      })
      // Add Bank cases
      .addCase(addSettlementBankAccount.pending, (state) => {
        state.isAddingBank = true
        state.addBankError = null
        state.addBankSuccess = false
        state.bankData = null
      })
      .addCase(addSettlementBankAccount.fulfilled, (state, action: PayloadAction<AddBankResponse>) => {
        state.isAddingBank = false
        state.addBankSuccess = true
        state.addBankError = null
        state.bankData = action.payload.data
      })
      .addCase(addSettlementBankAccount.rejected, (state, action) => {
        state.isAddingBank = false
        state.addBankError = (action.payload as string) || "Failed to add bank account"
        state.addBankSuccess = false
        state.bankData = null
      })
      // Get Settlement Bank cases
      .addCase(getSettlementBank.pending, (state) => {
        state.isFetchingSettlementBank = true
        state.fetchSettlementBankError = null
        state.settlementBankData = null
      })
      .addCase(getSettlementBank.fulfilled, (state, action: PayloadAction<GetSettlementBankResponse>) => {
        state.isFetchingSettlementBank = false
        state.fetchSettlementBankError = null
        state.settlementBankData = action.payload.data
      })
      .addCase(getSettlementBank.rejected, (state, action) => {
        state.isFetchingSettlementBank = false
        state.fetchSettlementBankError = (action.payload as string) || "Failed to fetch settlement bank information"
        state.settlementBankData = null
      })
  },
})

export const {
  clearAddBvnStatus,
  clearAddBankStatus,
  clearFetchSettlementBankStatus,
  clearErrors,
  resetSettlementBankState,
} = settlementBankSlice.actions

export default settlementBankSlice.reducer
