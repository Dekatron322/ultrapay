import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { API_CONFIG, API_ENDPOINTS, buildApiUrl } from "lib/config/api"

// Interfaces
interface Role {
  roleId: number
  name: string
  slug: string
  category: string
}

interface Privilege {
  key: string
  name: string
  category: string
  actions: string[]
}

interface User {
  id: number
  fullName: string
  email: string
  phoneNumber: string
  accountId: string
  isActive: boolean
  mustChangePassword: boolean
  isEmailVerified: boolean
  isPhoneVerified: boolean
  profilePicture: string | null
  roles: Role[]
  privileges: Privilege[]
}

// For backward compatibility, create a user object from merchant data
const createMerchantUser = (merchant: LoginMerchant): User => ({
  id: merchant.id,
  fullName: merchant.businessName,
  email: merchant.email,
  phoneNumber: "", // Not provided in merchant response
  accountId: merchant.id.toString(),
  isActive: merchant.status.value === 1,
  mustChangePassword: false, // Not provided in merchant response
  isEmailVerified: merchant.isEmailConfirmed,
  isPhoneVerified: false, // Not provided in merchant response
  profilePicture: merchant.logo,
  roles: [], // Not provided in merchant response
  privileges: [], // Not provided in merchant response
})

interface Tokens {
  accessToken: string
  refreshToken: string
  expiresAt: string
}

interface LoginResponse {
  isSuccess: boolean
  message: string
  data: {
    accessToken: string
    expiresAt: string
    refreshToken: string
    user: User
    mustChangePassword: boolean
  }
}

interface RefreshTokenResponse {
  isSuccess: boolean
  message: string
  data: {
    accessToken: string
    expiresAt: string
    refreshToken: string
    user: User
    mustChangePassword: boolean
  }
}

interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

interface ChangePasswordResponse {
  isSuccess: boolean
  message: string
}

interface LoginCredentials {
  email: string
  password: string
  appId: string
}

interface LoginTokens {
  accessToken: string
  refreshToken: string
  accessExpiry: string
  refreshExpiry: string
}

interface LoginMerchant {
  id: number
  businessName: string
  accountType: {
    label: string
    value: number
  }
  profession: string | null
  email: string
  logo: string | null
  tag: string | null
  defaultCurrency: string
  alwaysApplyVat: boolean
  vatPercentage: number
  country: {
    id: number
    name: string
    callingCode: string
    abbreviation: string
    currency: any
  }
  status: {
    label: string
    value: number
  }
  isEmailConfirmed: boolean
}

interface LoginResponse {
  tokens: LoginTokens
  merchant: LoginMerchant
  message: string
}

interface BusinessRegistrationRequest {
  countryId: number
  businessName: string
  email: string
}

interface ProfessionalRegistrationRequest {
  countryId: number
  displayName: string
  profession: string
  email: string
}

interface BusinessRegistrationResponse {
  isSuccess: boolean
  message: string
  data?: {
    isVerified?: boolean
  }
}

interface ProfessionalRegistrationResponse {
  isSuccess: boolean
  message: string
  data?: {
    isVerified?: boolean
  }
}

interface VerifyEmailRequest {
  email: string
  otp: string
}

interface VerifyEmailResponse {
  isSuccess: boolean
  message: string
  data?: {
    isVerified: boolean
  }
}

interface ResendOtpRequest {
  email: string
}

interface ResendOtpResponse {
  isSuccess: boolean
  message: string
}

interface SetPasswordRequest {
  email: string
  password: string
  confirmPassword: string
}

interface SetPasswordResponse {
  isSuccess: boolean
  message: string
  data?: {
    token?: string
    user?: User
  }
}

interface AuthState {
  user: User | null
  tokens: Tokens | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  isRefreshing: boolean
  mustChangePassword: boolean
  isChangingPassword: boolean
  changePasswordError: string | null
  changePasswordSuccess: boolean
  isRegisteringBusiness: boolean
  businessRegistrationError: string | null
  businessRegistrationSuccess: boolean
  isRegisteringProfessional: boolean
  professionalRegistrationError: string | null
  professionalRegistrationSuccess: boolean
  isVerifyingEmail: boolean
  emailVerificationError: string | null
  emailVerificationSuccess: boolean
  isResendingOtp: boolean
  resendOtpError: string | null
  resendOtpSuccess: boolean
  isSettingPassword: boolean
  setPasswordError: string | null
  setPasswordSuccess: boolean
}

// Configure axios instance
export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Helper functions for localStorage
const loadAuthState = (): Partial<AuthState> | undefined => {
  if (typeof window === "undefined") {
    return undefined
  }
  try {
    const serializedState = localStorage.getItem("authState")
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState) as Partial<AuthState>
  } catch (err) {
    console.warn("Failed to load auth state from localStorage", err)
    return undefined
  }
}

const saveAuthState = (state: AuthState) => {
  if (typeof window === "undefined") {
    return
  }
  try {
    const serializedState = JSON.stringify({
      user: state.user,
      tokens: state.tokens,
      isAuthenticated: state.isAuthenticated,
      mustChangePassword: state.mustChangePassword,
    })
    localStorage.setItem("authState", serializedState)
  } catch (err) {
    console.warn("Failed to save auth state to localStorage", err)
  }
}

const clearAuthState = () => {
  if (typeof window === "undefined") {
    return
  }
  try {
    localStorage.removeItem("authState")
  } catch (err) {
    console.warn("Failed to clear auth state from localStorage", err)
  }
}

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const [, payloadPart = ""] = token.split(".")
    const payload = JSON.parse(atob(payloadPart)) as { exp?: number }
    if (typeof payload.exp !== "number") return true
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

// Refresh token function
export const refreshAccessToken = createAsyncThunk("auth/refreshToken", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as { auth: AuthState }
    const refreshToken = state.auth.tokens?.refreshToken

    if (!refreshToken) {
      return rejectWithValue("No refresh token available")
    }

    const response = await api.post<RefreshTokenResponse>(buildApiUrl(API_ENDPOINTS.AUTH.REFRESH_TOKEN), {
      refreshToken,
    })

    if (!response.data.isSuccess) {
      return rejectWithValue(response.data.message || "Token refresh failed")
    }

    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      return rejectWithValue(error.response.data.message || "Token refresh failed")
    }
    return rejectWithValue(error.message || "Network error during token refresh")
  }
})

// Change password function
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData: ChangePasswordRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<ChangePasswordResponse>(
        buildApiUrl(API_ENDPOINTS.AUTH.CHANGE_PASSWORD),
        passwordData
      )

      if (!response.data.isSuccess) {
        return rejectWithValue(response.data.message || "Password change failed")
      }

      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || "Password change failed")
      }
      return rejectWithValue(error.message || "Network error during password change")
    }
  }
)

// Add request interceptor to inject token
api.interceptors.request.use(
  (config) => {
    const authState = loadAuthState()

    if (authState?.tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${authState.tokens.accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const authState = loadAuthState()

      if (authState?.tokens?.refreshToken) {
        try {
          // Attempt to refresh the token
          const response = await api.post<RefreshTokenResponse>(buildApiUrl(API_ENDPOINTS.AUTH.REFRESH_TOKEN), {
            refreshToken: authState.tokens.refreshToken,
          })

          if (response.data.isSuccess) {
            // Update the stored tokens
            const updatedTokens = {
              accessToken: response.data.data.accessToken,
              refreshToken: response.data.data.refreshToken,
              expiresAt: response.data.data.expiresAt,
            }

            // Save the updated tokens
            const updatedState = {
              ...authState,
              tokens: updatedTokens,
              mustChangePassword: response.data.data.mustChangePassword,
            } as AuthState
            saveAuthState(updatedState)

            // Update the authorization header and retry the original request
            originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`
            return api(originalRequest)
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login or handle accordingly
          console.error("Token refresh failed:", refreshError)
          // Clear auth state on refresh failure
          clearAuthState()
          window.location.href = "/"
        }
      } else {
        // No refresh token available, redirect to login
        clearAuthState()
        window.location.href = "/"
      }
    }

    return Promise.reject(error)
  }
)

// Business registration function
export const registerBusiness = createAsyncThunk(
  "auth/registerBusiness",
  async (businessData: BusinessRegistrationRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<BusinessRegistrationResponse>(
        buildApiUrl(API_ENDPOINTS.AUTH.REGISTER_AS_BUSINESS),
        businessData
      )

      if (!response.data.isSuccess) {
        return rejectWithValue(response.data.message || "Business registration failed")
      }

      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || "Business registration failed")
      }
      return rejectWithValue(error.message || "Network error during business registration")
    }
  }
)

// Email verification function
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (verificationData: VerifyEmailRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<VerifyEmailResponse>(
        buildApiUrl(API_ENDPOINTS.AUTH.VERIFY_ACCOUNT),
        verificationData
      )

      if (!response.data.isSuccess) {
        return rejectWithValue(response.data.message || "Email verification failed")
      }

      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || "Email verification failed")
      }
      return rejectWithValue(error.message || "Network error during email verification")
    }
  }
)

// Resend OTP function
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (emailData: ResendOtpRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<ResendOtpResponse>(buildApiUrl(API_ENDPOINTS.AUTH.RESEND_OTP), emailData)

      if (!response.data.isSuccess) {
        return rejectWithValue(response.data.message || "Failed to resend OTP")
      }

      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || "Failed to resend OTP")
      }
      return rejectWithValue(error.message || "Network error while resending OTP")
    }
  }
)

// Register professional function
export const registerProfessional = createAsyncThunk(
  "auth/registerProfessional",
  async (professionalData: ProfessionalRegistrationRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<ProfessionalRegistrationResponse>(
        buildApiUrl(API_ENDPOINTS.AUTH.REGISTER_AS_PROFESSIONAL),
        professionalData
      )

      if (!response.data.isSuccess) {
        return rejectWithValue(response.data.message || "Failed to register professional")
      }

      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || "Failed to register professional")
      }
      return rejectWithValue(error.message || "Network error while registering professional")
    }
  }
)

// Set password function
export const setPassword = createAsyncThunk(
  "auth/setPassword",
  async (passwordData: SetPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<SetPasswordResponse>(buildApiUrl(API_ENDPOINTS.AUTH.SET_PASSWORD), passwordData)

      if (!response.data.isSuccess) {
        return rejectWithValue(response.data.message || "Failed to set password")
      }

      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || "Failed to set password")
      }
      return rejectWithValue(error.message || "Network error while setting password")
    }
  }
)

// Load initial state from localStorage if available
const persistedState = loadAuthState()
const initialState: AuthState = {
  user: persistedState?.user || null,
  tokens: persistedState?.tokens || null,
  loading: false,
  error: null,
  isAuthenticated: persistedState?.isAuthenticated || false,
  isRefreshing: false,
  mustChangePassword: persistedState?.mustChangePassword || false,
  isChangingPassword: false,
  changePasswordError: null,
  changePasswordSuccess: false,
  isRegisteringBusiness: false,
  businessRegistrationError: null,
  businessRegistrationSuccess: false,
  isRegisteringProfessional: false,
  professionalRegistrationError: null,
  professionalRegistrationSuccess: false,
  isVerifyingEmail: false,
  emailVerificationError: null,
  emailVerificationSuccess: false,
  isResendingOtp: false,
  resendOtpError: null,
  resendOtpSuccess: false,
  isSettingPassword: false,
  setPasswordError: null,
  setPasswordSuccess: false,
}

export const loginUser = createAsyncThunk("auth/login", async (credentials: LoginCredentials, { rejectWithValue }) => {
  try {
    const response = await api.post<LoginResponse>(buildApiUrl(API_ENDPOINTS.AUTH.LOGIN), credentials)

    // For login, we consider it successful if we get tokens and merchant data
    if (!response.data.tokens || !response.data.merchant) {
      return rejectWithValue(response.data.message || "Login failed")
    }

    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      return rejectWithValue(error.response.data.message || "Login failed")
    }
    return rejectWithValue(error.message || "Network error during login")
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.tokens = null
      state.isAuthenticated = false
      state.error = null
      state.loading = false
      state.isRefreshing = false
      state.mustChangePassword = false
      state.isChangingPassword = false
      state.changePasswordError = null
      state.changePasswordSuccess = false
      clearAuthState()
    },
    clearError: (state) => {
      state.error = null
      state.changePasswordError = null
    },
    clearChangePasswordStatus: (state) => {
      state.changePasswordError = null
      state.changePasswordSuccess = false
    },
    clearBusinessRegistrationStatus: (state) => {
      state.businessRegistrationError = null
      state.businessRegistrationSuccess = false
    },
    clearProfessionalRegistrationStatus: (state) => {
      state.professionalRegistrationError = null
      state.professionalRegistrationSuccess = false
    },
    clearEmailVerificationStatus: (state) => {
      state.emailVerificationError = null
      state.emailVerificationSuccess = false
    },
    clearResendOtpStatus: (state) => {
      state.resendOtpError = null
      state.resendOtpSuccess = false
    },
    clearSetPasswordStatus: (state) => {
      state.setPasswordError = null
      state.setPasswordSuccess = false
    },
    initializeAuth: (state) => {
      const persistedState = loadAuthState()
      if (persistedState) {
        state.user = persistedState.user || null
        state.tokens = persistedState.tokens || null
        state.isAuthenticated = persistedState.isAuthenticated || false
        state.mustChangePassword = persistedState.mustChangePassword || false
      }
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        saveAuthState(state)
      }
    },
    resetMustChangePassword: (state) => {
      state.mustChangePassword = false
      saveAuthState(state)
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false
        state.isAuthenticated = true

        // Convert merchant data to user format for compatibility
        const user = createMerchantUser(action.payload.merchant)
        state.user = user

        // Set tokens from response
        state.tokens = {
          accessToken: action.payload.tokens.accessToken,
          refreshToken: action.payload.tokens.refreshToken,
          expiresAt: action.payload.tokens.accessExpiry,
        }

        state.mustChangePassword = false
        state.error = null
        saveAuthState(state)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || "Login failed"
        state.isAuthenticated = false
        state.user = null
        state.tokens = null
        state.mustChangePassword = false
      })
      // Refresh token cases
      .addCase(refreshAccessToken.pending, (state) => {
        state.isRefreshing = true
        state.error = null
      })
      .addCase(refreshAccessToken.fulfilled, (state, action: PayloadAction<RefreshTokenResponse>) => {
        state.isRefreshing = false
        if (state.tokens) {
          state.tokens.accessToken = action.payload.data.accessToken
          state.tokens.refreshToken = action.payload.data.refreshToken
          state.tokens.expiresAt = action.payload.data.expiresAt
          state.mustChangePassword = action.payload.data.mustChangePassword
          state.error = null
          saveAuthState(state)
        }
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.isRefreshing = false
        state.error = (action.payload as string) || "Token refresh failed"
        // Logout the user if refresh fails
        state.user = null
        state.tokens = null
        state.isAuthenticated = false
        state.mustChangePassword = false
        clearAuthState()
      })
      // Change password cases
      .addCase(changePassword.pending, (state) => {
        state.isChangingPassword = true
        state.changePasswordError = null
        state.changePasswordSuccess = false
      })
      .addCase(changePassword.fulfilled, (state, action: PayloadAction<ChangePasswordResponse>) => {
        state.isChangingPassword = false
        state.changePasswordSuccess = true
        state.changePasswordError = null

        // If the user was required to change password, update the state
        if (state.mustChangePassword) {
          state.mustChangePassword = false
          saveAuthState(state)
        }
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isChangingPassword = false
        state.changePasswordError = (action.payload as string) || "Password change failed"
        state.changePasswordSuccess = false
      })
      // Business registration cases
      .addCase(registerBusiness.pending, (state) => {
        state.isRegisteringBusiness = true
        state.businessRegistrationError = null
        state.businessRegistrationSuccess = false
      })
      .addCase(registerBusiness.fulfilled, (state, action: PayloadAction<BusinessRegistrationResponse>) => {
        state.isRegisteringBusiness = false
        state.businessRegistrationSuccess = true
        state.businessRegistrationError = null
      })
      .addCase(registerBusiness.rejected, (state, action) => {
        state.isRegisteringBusiness = false
        state.businessRegistrationError = (action.payload as string) || "Failed to register business"
        state.businessRegistrationSuccess = false
      })
      // Professional registration cases
      .addCase(registerProfessional.pending, (state) => {
        state.isRegisteringProfessional = true
        state.professionalRegistrationError = null
        state.professionalRegistrationSuccess = false
      })
      .addCase(registerProfessional.fulfilled, (state, action: PayloadAction<ProfessionalRegistrationResponse>) => {
        state.isRegisteringProfessional = false
        state.professionalRegistrationSuccess = true
        state.professionalRegistrationError = null
      })
      .addCase(registerProfessional.rejected, (state, action) => {
        state.isRegisteringProfessional = false
        state.professionalRegistrationError = (action.payload as string) || "Failed to register professional"
        state.professionalRegistrationSuccess = false
      })
      // Email verification cases
      .addCase(verifyEmail.pending, (state) => {
        state.isVerifyingEmail = true
        state.emailVerificationError = null
        state.emailVerificationSuccess = false
      })
      .addCase(verifyEmail.fulfilled, (state, action: PayloadAction<VerifyEmailResponse>) => {
        state.isVerifyingEmail = false
        state.emailVerificationSuccess = true
        state.emailVerificationError = null

        // Update user's email verification status if user exists
        if (state.user && action.payload.data?.isVerified) {
          state.user.isEmailVerified = true
          saveAuthState(state)
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isVerifyingEmail = false
        state.emailVerificationError = (action.payload as string) || "Email verification failed"
        state.emailVerificationSuccess = false
      })
      // Resend OTP cases
      .addCase(resendOtp.pending, (state) => {
        state.isResendingOtp = true
        state.resendOtpError = null
        state.resendOtpSuccess = false
      })
      .addCase(resendOtp.fulfilled, (state, action: PayloadAction<ResendOtpResponse>) => {
        state.isResendingOtp = false
        state.resendOtpSuccess = true
        state.resendOtpError = null
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.isResendingOtp = false
        state.resendOtpError = (action.payload as string) || "Failed to resend OTP"
        state.resendOtpSuccess = false
      })
      // Set password cases
      .addCase(setPassword.pending, (state) => {
        state.isSettingPassword = true
        state.setPasswordError = null
        state.setPasswordSuccess = false
      })
      .addCase(setPassword.fulfilled, (state, action: PayloadAction<SetPasswordResponse>) => {
        state.isSettingPassword = false
        state.setPasswordSuccess = true
        state.setPasswordError = null

        // If the response includes user data and tokens, update the auth state
        if (action.payload.data?.user && action.payload.data?.token) {
          state.user = action.payload.data.user
          state.tokens = {
            accessToken: action.payload.data.token,
            refreshToken: action.payload.data.token, // You might need to adjust this based on actual API response
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
          }
          state.isAuthenticated = true
          saveAuthState(state)
        }
      })
      .addCase(setPassword.rejected, (state, action) => {
        state.isSettingPassword = false
        state.setPasswordError = (action.payload as string) || "Failed to set password"
        state.setPasswordSuccess = false
      })
  },
})

export const {
  logout,
  clearError,
  clearChangePasswordStatus,
  clearBusinessRegistrationStatus,
  clearProfessionalRegistrationStatus,
  clearEmailVerificationStatus,
  clearResendOtpStatus,
  clearSetPasswordStatus,
  initializeAuth,
  updateUserProfile,
  resetMustChangePassword,
} = authSlice.actions
export default authSlice.reducer
