"use client"

import Link from "next/link"
import React, { useEffect, useState } from "react"
import { Links } from "./Links"
import Image from "next/image"
import clsx from "clsx"
import { usePopover } from "components/Navbar/use-popover"
import { Building2, CheckCircle, Key, Settings, Shield, User } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const {
    anchorRef: systemSettingsRef,
    open: isSystemSettingsOpen,
    handleToggle: toggleSystemSettings,
    handleClose: closeSystemSettings,
  } = usePopover()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (systemSettingsRef.current && !systemSettingsRef.current.contains(target)) {
        closeSystemSettings()
      }
    }

    if (isSystemSettingsOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [systemSettingsRef, closeSystemSettings, isSystemSettingsOpen])

  return (
    <div
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(false)}
      className={clsx(
        "sidebar relative z-[60] flex h-screen flex-col overflow-hidden border-r border-[#E4E4E4] max-sm:hidden",
        {
          "w-20": isCollapsed,
          "w-64": !isCollapsed,
        }
      )}
    >
      <div className="flex-1 border-0 border-red-700 lg:mt-2">
        <div className="flex items-center gap-2 border-b border-[#E4E4E4] px-7 py-2 transition-opacity lg:block">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/ultra-pay/logo.png" alt="Dashboard" width={167} height={160} />
          </Link>
        </div>

        <div className="mb-2 flex-1 overflow-y-auto lg:space-y-1">
          <Links isCollapsed={isCollapsed} />
        </div>
      </div>

      <div className="my-4 mt-auto flex h-auto items-center justify-between border-t px-6">
        <div ref={systemSettingsRef} className="relative flex w-full items-center justify-between pt-5">
          <button
            type="button"
            onClick={toggleSystemSettings}
            className="flex w-full items-center justify-between gap-2 rounded-md p-2 text-left hover:bg-gray-100"
          >
            <div className="flex items-center gap-2">
              <Settings className="size-4" />
              <p className="bottom-bar hidden text-xs lg:block 2xl:text-base">System Settings</p>
            </div>
          </button>

          <AnimatePresence>
            {isSystemSettingsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute bottom-full left-[-1rem] z-50 mb-1 w-[240px] overflow-hidden rounded-md bg-white text-xs shadow-2xl ring-1 ring-black ring-opacity-5 lg:text-sm"
              >
                <div className="flex flex-col py-1">
                  <Link
                    href="/profile"
                    className={clsx(
                      "flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 transition-colors hover:bg-gray-100",
                      {
                        "bg-gray-100 font-semibold text-blue-600": pathname.startsWith("/profile"),
                      }
                    )}
                    onClick={closeSystemSettings}
                  >
                    <User className="size-4" />
                    <span>Profile</span>
                  </Link>

                  <Link
                    href="/kyb-verification"
                    className={clsx(
                      "flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 transition-colors hover:bg-gray-100",
                      {
                        "bg-gray-100 font-semibold text-blue-600": pathname.startsWith("/kyb-verification"),
                      }
                    )}
                    onClick={closeSystemSettings}
                  >
                    <CheckCircle className="size-4" />
                    <span>KYB Verification</span>
                  </Link>

                  <Link
                    href="/bank-details"
                    className={clsx(
                      "flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 transition-colors hover:bg-gray-100",
                      {
                        "bg-gray-100 font-semibold text-blue-600": pathname.startsWith("/bank-details"),
                      }
                    )}
                    onClick={closeSystemSettings}
                  >
                    <Building2 className="size-4" />
                    <span>Bank Details</span>
                  </Link>

                  <Link
                    href="/security"
                    className={clsx(
                      "flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 transition-colors hover:bg-gray-100",
                      {
                        "bg-gray-100 font-semibold text-blue-600": pathname.startsWith("/security"),
                      }
                    )}
                    onClick={closeSystemSettings}
                  >
                    <Shield className="size-4" />
                    <span>Security</span>
                  </Link>

                  <Link
                    href="/api-keys-webhooks"
                    className={clsx(
                      "flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 transition-colors hover:bg-gray-100",
                      {
                        "bg-gray-100 font-semibold text-blue-600": pathname.startsWith("/api-keys-webhooks"),
                      }
                    )}
                    onClick={closeSystemSettings}
                  >
                    <Key className="size-4" />
                    <span>API Keys & Webhooks</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default SideBar
