import { NotificationProvider } from "components/ui/Notification/Notification"
import { Metadata } from "next"
import "styles/tailwind.css"

export const metadata: Metadata = {
  title: "Ultra Pay",
  description: "Accept Crypto Like Cash. Without the Complexity",
  icons: {
    icon: [
      { url: "/icon.svg" },
      { url: "/icon.svg", sizes: "16x16", type: "image/png" },
      { url: "/icon.svg", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/icon.svg" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#5bbad5" }],
  },
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    url: "https://ultrapay.com/",
    images: [
      {
        width: 1200,
        height: 630,
        url: "#",
      },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <NotificationProvider position="top-center" />
    </html>
  )
}
