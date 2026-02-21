import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { API_CONFIG, API_ENDPOINTS, buildApiUrl } from "lib/config/api"

// Interfaces
interface Currency {
  id: number
  name: string
  symbol: string
  ticker: string
  avatar: string
}

interface Country {
  id: number
  name: string
  callingCode: string
  abbreviation: string
  currency: Currency
}

interface CountriesResponse {
  data: Country[]
  isSuccess: boolean
  message: string
}

interface SystemsState {
  countries: Country[]
  loading: boolean
  error: string | null
  isSuccess: boolean
}

// Configure axios instance (reuse from auth slice or create new one)
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Async thunk to fetch countries
export const fetchCountries = createAsyncThunk("systems/fetchCountries", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<CountriesResponse>(buildApiUrl(API_ENDPOINTS.SYSTEMS.GET))

    if (!response.data.isSuccess) {
      return rejectWithValue(response.data.message || "Failed to fetch countries")
    }

    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      return rejectWithValue(error.response.data.message || "Failed to fetch countries")
    }
    return rejectWithValue(error.message || "Network error while fetching countries")
  }
})

const initialState: SystemsState = {
  countries: [],
  loading: false,
  error: null,
  isSuccess: false,
}

const systemsSlice = createSlice({
  name: "systems",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccess: (state) => {
      state.isSuccess = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch countries cases
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true
        state.error = null
        state.isSuccess = false
      })
      .addCase(fetchCountries.fulfilled, (state, action: PayloadAction<CountriesResponse>) => {
        state.loading = false
        state.countries = action.payload.data
        state.isSuccess = true
        state.error = null
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || "Failed to fetch countries"
        state.isSuccess = false
        state.countries = []
      })
  },
})

export const { clearError, clearSuccess } = systemsSlice.actions
export default systemsSlice.reducer
