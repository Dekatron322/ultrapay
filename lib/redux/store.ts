// src/lib/redux/store.ts
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import employeeReducer from "./employeeSlice"
import roleReducer from "./roleSlice"
import areaOfficeReducer from "./areaOfficeSlice"
import departmentReducer from "./departmentSlice"
import systemsReducer from "./systemsSlice"
import merchantKycReducer from "./merchantKycSlice"
import settlementBankReducer from "./settlementBankSlice"
import businessInfoReducer from "./businessInfoSlice"
import { adminApi } from "./adminSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    roles: roleReducer,
    areaOffices: areaOfficeReducer,
    departments: departmentReducer,
    systems: systemsReducer,
    merchantKyc: merchantKycReducer,
    settlementBank: settlementBankReducer,
    businessInfo: businessInfoReducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(adminApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
