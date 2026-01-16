// app/providers.tsx
"use client"

import { store } from "lib/redux/store"
import { Provider } from "react-redux"
import { NotificationProvider } from "components/ui/Notification/Notification"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <NotificationProvider />
      {children}
    </Provider>
  )
}
