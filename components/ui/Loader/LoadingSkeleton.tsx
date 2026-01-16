"use client"
import React from "react"
import { motion } from "framer-motion"
import DashboardNav from "components/Navbar/DashboardNav"

const LoadingSkeleton = () => (
  <section className="size-full">
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 pb-20">
      <div className="flex w-full flex-col">
        <DashboardNav />
        <div className="container mx-auto flex flex-col">
          {/* Sticky Header Skeleton */}
          <div className="sticky top-16 z-40 border-b border-gray-200 bg-white">
            <div className="mx-auto w-full px-16 py-4">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Back button */}
                  <div className="size-9 overflow-hidden rounded-md border border-gray-200 bg-[#f9f9f9]">
                    <motion.div
                      className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                  <div>
                    <div className="mb-2 h-6 w-40 overflow-hidden rounded bg-gray-200">
                      <motion.div
                        className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                      />
                    </div>
                    <div className="h-4 w-60 overflow-hidden rounded bg-gray-200">
                      <motion.div
                        className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-9 w-28 overflow-hidden rounded-md bg-gray-200">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                    />
                  </div>
                  <div className="h-9 w-32 overflow-hidden rounded-md bg-gray-200">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Body Layout Skeleton */}
          <div className="flex w-full px-16 py-8">
            <div className="flex w-full gap-6">
              {/* Right Sidebar Skeleton */}
              <div className="flex w-[30%] flex-col space-y-6">
                {/* Property Card Skeleton */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="text-center">
                    <div className="relative mb-4 h-40 w-full overflow-hidden rounded-xl bg-gray-200">
                      <motion.div
                        className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <div className="absolute left-3 top-3 h-9 w-9 overflow-hidden rounded-lg bg-white/80">
                        <motion.div
                          className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                        />
                      </div>
                      <div className="absolute right-3 top-3 h-9 w-9 overflow-hidden rounded-full bg-gray-200">
                        <motion.div
                          className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                        />
                      </div>
                    </div>

                    <div className="mx-auto mb-2 h-6 w-40 overflow-hidden rounded bg-gray-200">
                      <motion.div
                        className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                      />
                    </div>
                    <div className="mx-auto mb-4 h-4 w-28 overflow-hidden rounded bg-gray-200">
                      <motion.div
                        className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                      />
                    </div>

                    <div className="mb-6 flex flex-wrap justify-center gap-2">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="h-7 w-24 overflow-hidden rounded-full bg-gray-200">
                          <motion.div
                            className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 + i * 0.1 }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 rounded-lg bg-[#F9FAFB] p-4">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="h-4 w-full overflow-hidden rounded bg-gray-200">
                          <motion.div
                            className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 + i * 0.1 }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions Skeleton */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 h-5 w-32 overflow-hidden rounded bg-gray-200">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                  <div className="space-y-3">
                    {[0, 1].map((i) => (
                      <div key={i} className="h-9 w-full overflow-hidden rounded-md bg-gray-200">
                        <motion.div
                          className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 + i * 0.1 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Property Overview Skeleton */}
                <div className="rounded-lg border bg-white p-6">
                  <div className="mb-4 h-5 w-40 overflow-hidden rounded bg-gray-200">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="mx-auto mb-2 h-8 w-32 overflow-hidden rounded bg-gray-200">
                        <motion.div
                          className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                        />
                      </div>
                      <div className="mx-auto h-4 w-24 overflow-hidden rounded bg-gray-200">
                        <motion.div
                          className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="rounded-lg bg-[#F3F4F6] p-3">
                          <div className="mx-auto mb-1 h-5 w-10 overflow-hidden rounded bg-gray-200">
                            <motion.div
                              className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                              animate={{ x: ["-100%", "100%"] }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.2 + i * 0.1,
                              }}
                            />
                          </div>
                          <div className="mx-auto h-3 w-20 overflow-hidden rounded bg-gray-200">
                            <motion.div
                              className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                              animate={{ x: ["-100%", "100%"] }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.25 + i * 0.1,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Skeleton */}
              <div className="flex w-[70%] flex-col space-y-6">
                {/* Tabs bar skeleton */}
                <div className="mb-4">
                  <div className="w-fit rounded-md bg-white p-2">
                    <div className="flex space-x-2">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="h-9 w-32 overflow-hidden rounded-md bg-gray-200">
                          <motion.div
                            className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.1 + i * 0.1,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tab content card skeleton */}
                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="mb-4 h-6 w-40 overflow-hidden rounded bg-gray-200">
                      <motion.div
                        className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {[0, 1, 2, 3].map((col) => (
                        <div key={col} className="space-y-3">
                          {[0, 1, 2].map((row) => (
                            <div key={row} className="space-y-2">
                              <div className="h-4 w-32 overflow-hidden rounded bg-gray-200">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                                  animate={{ x: ["-100%", "100%"] }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.1 + col * 0.1 + row * 0.05,
                                  }}
                                />
                              </div>
                              <div className="h-6 w-48 overflow-hidden rounded bg-gray-200">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                                  animate={{ x: ["-100%", "100%"] }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.15 + col * 0.1 + row * 0.05,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

export default LoadingSkeleton
