"use client"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { DashboardIcon, MessageIcon, ServiceIcon, TokenIcon } from "./Icons"

type LinkChild = { name: string; href: string; privilegeKey?: string; requiredActions?: string[] }
type LinkItem = {
  name: string
  href?: string
  icon: (props: { isActive: boolean }) => JSX.Element
  children?: LinkChild[]
  privilegeKey?: string
  requiredActions?: string[]
  requiredRole?: string
}

const allLinks: LinkItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: DashboardIcon,
  },
  // {
  //   name: "Agencies",
  //   href: "/agencies",
  //   icon: ServiceIcon,
  //   privilegeKey: "agencies",
  //   requiredActions: ["R"],
  //   children: [
  //     { name: "All Agencies", href: "/agencies/all-agencies", privilegeKey: "agencies", requiredActions: ["R"] },
  //     { name: "My Agencies", href: "/agencies/my-agencies", privilegeKey: "agencies", requiredActions: ["W"] },
  //   ],
  // },
  // {
  //   name: "Properties",
  //   href: "/properties",
  //   icon: BuildingIcon,
  // },
  {
    name: "Payments",
    href: "/payments",
    icon: TokenIcon,
    // privilegeKey: "billing-postpaid",
    // requiredActions: ["R"],
  },

  {
    name: "Transactions",
    href: "/transactions",
    icon: ServiceIcon,
    // privilegeKey: "tenants",
    // requiredActions: ["R"],
  },
  {
    name: "Wallet",
    href: "/wallet",
    icon: MessageIcon,
    // privilegeKey: "payments",
    // requiredActions: ["R"],
  },
  // {
  //   name: "Technicians",
  //   href: "/technicians",
  //   icon: AgentIcon,
  //   privilegeKey: "agents",
  //   requiredActions: ["R"],
  // },
]

interface LinksProps {
  isCollapsed: boolean
}

export function Links({ isCollapsed }: LinksProps) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const handleExpand = (linkName: string, next: boolean) => {
    setExpanded((prev) => ({ ...prev, [linkName]: next }))
  }

  return (
    <div className="flex max-h-[calc(100svh-150px)] flex-col space-y-1 overflow-y-auto p-2">
      {allLinks.map((link) => {
        const LinkIcon = link.icon
        const hasChildren = Array.isArray(link.children) && link.children.length > 0
        const filteredChildren = hasChildren ? link.children! : []
        const shouldShowParent = hasChildren ? filteredChildren.length > 0 : true

        if (!shouldShowParent) return null

        const childActive = hasChildren ? filteredChildren.some((c) => pathname.startsWith(c.href)) : false
        const isActive = link.href ? pathname.startsWith(link.href) : false
        const isLinkActive = hasChildren ? childActive || isActive : isActive
        const isExpanded = hasChildren ? expanded[link.name] ?? childActive : false

        return (
          <div key={link.name} className="group">
            <div
              className={clsx(
                "relative flex items-center rounded-xl transition-all duration-300 ease-out",
                "hover:bg-[#EEF6FF] hover:text-[#1447E6]",
                {
                  "bg-[#EEF6FF] text-[#1447E6]": isLinkActive,
                }
              )}
            >
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => handleExpand(link.name, !isExpanded)}
                  className="flex w-full items-center justify-between gap-3 px-2 py-2"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={clsx(
                        "flex size-8 items-center justify-center rounded-lg transition-all duration-300",
                        {
                          " text-[#EEF6FF] shadow-lg": isLinkActive,
                          "bg-[#F3F4F6] text-[#1447E6] group-hover:bg-[#1447E6] group-hover:text-[#EEF6FF]":
                            !isLinkActive,
                        }
                      )}
                    >
                      <LinkIcon isActive={isLinkActive} />
                    </div>
                    <p
                      className={clsx("relative text-sm font-medium transition-all duration-300", {
                        "w-0 scale-0 opacity-0": isCollapsed,
                        "scale-100 opacity-100": !isCollapsed,
                      })}
                    >
                      {link.name}
                    </p>
                  </div>
                  {!isCollapsed && filteredChildren.length > 0 && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={clsx("size-4 transform transition-colors  duration-300", {
                        "text-white": isLinkActive,
                        "text-[#EEF6FF] group-hover:text-white": !isLinkActive,
                        "rotate-180": isExpanded,
                      })}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  )}
                </button>
              ) : (
                <Link href={link.href || "#"} className="flex w-full items-center gap-3 px-3 py-4">
                  <LinkIcon isActive={isLinkActive} />

                  <p
                    className={clsx("relative text-sm font-medium transition-all duration-300", {
                      "w-0 scale-0 opacity-0": isCollapsed,
                      "scale-100 opacity-100": !isCollapsed,
                    })}
                  >
                    {link.name}
                  </p>
                </Link>
              )}
            </div>

            {hasChildren && !isCollapsed && filteredChildren.length > 0 && (
              <div
                className={clsx(" overflow-hidden transition-all duration-500 ease-in-out", {
                  "max-h-0 opacity-0": !isExpanded,
                  "max-h-72 opacity-100": isExpanded,
                })}
              >
                <div className="ml-8 border-l-2 border-gray-200 py-2 pl-4">
                  {filteredChildren.map((child) => {
                    const isChildActive = pathname.startsWith(child.href)
                    return (
                      <Link key={child.name} href={child.href}>
                        <div
                          className={clsx(
                            "group/child mb-2 rounded-lg px-3 py-2 transition-all duration-300 last:mb-0",
                            "hover:bg-[#EEF6FF] hover:text-white",
                            {
                              "bg-gray-100 text-[#EEF6FF]": isChildActive,
                            }
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={clsx("h-1.5 w-1.5 rounded-full transition-all duration-300", {
                                "scale-125 bg-[#EEF6FF]": isChildActive,
                                "bg-gray-300 group-hover/child:bg-white": !isChildActive,
                              })}
                            />
                            <p
                              className={clsx("text-sm transition-all duration-300", {
                                "font-semibold": isChildActive,
                              })}
                            >
                              {child.name}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
