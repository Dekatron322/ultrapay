"use client"
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Download, Filter, Search } from "lucide-react"
import { ButtonModule } from "components/ui/Button/Button"
import { SearchModule } from "components/ui/Search/search-module"
import { FormSelectModule } from "components/ui/Input/FormSelectModule"

interface Payment {
  id: string
  date: string
  amount: number
  status: "PAID" | "PENDING" | "OVERDUE"
  method: string
  reference: string
  dueDate: string
}

interface PaymentHistoryTabProps {
  payments: Payment[]
  loading: boolean
  error: string | null
  pagination: any
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  formatCurrency: (amount: number) => string
  formatDateTime: (dateString: string) => string
}

const PaymentHistoryTab: React.FC<PaymentHistoryTabProps> = ({ payments, formatCurrency, formatDateTime }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.method.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "OVERDUE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case "bank transfer":
        return "bg-blue-100 text-blue-800"
      case "online payment":
        return "bg-purple-100 text-purple-800"
      case "cash":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Calculate statistics
  const totalPaid = payments.filter((p) => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0)
  const totalPending = payments.filter((p) => p.status === "PENDING").reduce((sum, p) => sum + p.amount, 0)
  const totalOverdue = payments.filter((p) => p.status === "OVERDUE").reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-gray-200 bg-white p-6"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
            <p className="text-sm text-gray-600">Total Paid</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border border-gray-200 bg-white p-6"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</p>
            <p className="text-sm text-gray-600">Pending Payments</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg border border-gray-200 bg-white p-6"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalOverdue)}</p>
            <p className="text-sm text-gray-600">Overdue Payments</p>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-gray-200 bg-white p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-4">
            <SearchModule
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by reference or method..."
              // optional: tweak background to fit this card
              className="w-full"
              bgClassName="bg-white"
            />
            <FormSelectModule
              label=""
              name="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(String(e.target.value))}
              options={[
                { value: "ALL", label: "All Status" },
                { value: "PAID", label: "Paid" },
                { value: "PENDING", label: "Pending" },
                { value: "OVERDUE", label: "Overdue" },
              ]}
              className="min-w-[160px]"
            />
          </div>

          <ButtonModule variant="secondary" className="flex items-center gap-2">
            <Download className="size-4" />
            Export
          </ButtonModule>
        </div>
      </motion.div>

      {/* Payment History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-gray-200 bg-white p-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Payment History</h3>

        {filteredPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Reference</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Method</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Due Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{formatDateTime(payment.date)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{payment.reference}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium ${getMethodColor(
                          payment.method
                        )}`}
                      >
                        {payment.method}
                      </span>
                    </td>
                    <td className=" px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDateTime(payment.dueDate)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <ButtonModule variant="outline" size="sm">
                          View
                        </ButtonModule>
                        <ButtonModule variant="secondary" size="sm">
                          Receipt
                        </ButtonModule>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="mb-2 text-gray-400">No payments found</div>
            <p className="text-sm text-gray-600">
              {searchTerm || statusFilter !== "ALL"
                ? "Try adjusting your search criteria"
                : "No payment history available for this tenant"}
            </p>
          </div>
        )}
      </motion.div>

      {/* Payment Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-lg border border-gray-200 bg-white p-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Payment Summary</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-[#F9FAFB] px-4 py-2">
              <span className="text-sm text-gray-600">Total Payments Made</span>
              <span className="font-medium text-gray-900">{payments.filter((p) => p.status === "PAID").length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[#F9FAFB] px-4 py-2">
              <span className="text-sm text-gray-600">On-time Payments</span>
              <span className="font-medium text-green-600">{payments.filter((p) => p.status === "PAID").length}</span>
            </div>
            <div className="flex justify-between rounded-lg bg-[#F9FAFB] px-4 py-2">
              <span className="text-sm text-gray-600">Late Payments</span>
              <span className="font-medium text-red-600">{payments.filter((p) => p.status === "OVERDUE").length}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-[#F9FAFB] px-4 py-2">
              <span className="text-sm text-gray-600">Average Payment Time</span>
              <span className="font-medium text-gray-900">2 days early</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[#F9FAFB] px-4 py-2">
              <span className="text-sm text-gray-600">Preferred Payment Method</span>
              <span className="font-medium text-gray-900">Bank Transfer</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[#F9FAFB] px-4 py-2">
              <span className="text-sm text-gray-600">Payment Success Rate</span>
              <span className="font-medium text-green-600">95%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PaymentHistoryTab
