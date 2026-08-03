import React from "react"
import { Link } from "react-router-dom"

const PaymentFailure = () => {
    return (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12
            bg-slate-50 dark:bg-slate-950 transition-colors">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800
                bg-white dark:bg-slate-900 p-8 text-center shadow-sm dark:shadow-none">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full
                    bg-red-100 dark:bg-red-500/10 theme-toggle-icon">
                    <svg viewBox="0 0 24 24" className="h-8 w-8 text-red-500" fill="none">
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                </div>
                <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Payment cancelled</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    The payment was cancelled or could not be completed on eSewa.
                </p>

                <Link
                    to="/payment"
                    className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white
                        hover:opacity-90 transition-opacity"
                >
                    Try again
                </Link>
            </div>
        </div>
    )
}

export default PaymentFailure
