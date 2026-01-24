// app/providers.tsx
"use client"

import { store } from "lib/redux/store"
import { Provider } from "react-redux"
import { NotificationProvider } from "components/ui/Notification/Notification"
import Modal from "react-modal"

// Set the app element for accessibility for all modals
if (typeof window !== "undefined") {
  Modal.setAppElement(document.body)
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <NotificationProvider />
      {children}
    </Provider>
  )
}
