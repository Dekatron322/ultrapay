import "styles/tailwind.css"
import ThemeProviders from "components/ProvidersComponents/ThemeProviders"
import ProtectedRoute from "lib/protectedRoutes"
import { NotificationProvider } from "components/ui/Notification/Notification"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProviders>
          <NotificationProvider position="top-center" />
          {children}
        </ThemeProviders>
      </body>
    </html>
  )
}
