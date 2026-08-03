import React, { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { API_BASE_URL } from "../../utils/api"

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState("verifying") // verifying | complete | failed
    const [details, setDetails] = useState(null)

    useEffect(() => {
        const data = searchParams.get("data")

        if (!data) {
            setStatus("failed")
            return
        }

        fetch(`${API_BASE_URL}/api/payments/verify?data=${encodeURIComponent(data)}`)
            .then((res) => res.json())
            .then((result) => {
                setDetails(result)
                setStatus(result.success ? "complete" : "failed")
            })
            .catch(() => setStatus("failed"))
    }, [searchParams])

    return (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12
            bg-slate-50 dark:bg-slate-950 transition-colors">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800
                bg-white dark:bg-slate-900 p-8 text-center shadow-sm dark:shadow-none">
                {status === "verifying" && (
                    <>
                        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4
                            border-slate-200 dark:border-slate-700 border-t-primary" />
                        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            Verifying your payment...
                        </h1>
                    </>
                )}

                {status === "complete" && (
                    <>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full
                            bg-emerald-100 dark:bg-emerald-500/10 theme-toggle-icon">
                            <svg viewBox="0 0 24 24" className="h-8 w-8 text-emerald-500" fill="none">
                                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Payment successful</h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Transaction verified with eSewa's sandbox.
                        </p>

                        {details && (
                            <div className="mt-4 space-y-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 p-3 text-left text-xs
                                text-slate-600 dark:text-slate-300">
                                <p><span className="font-medium">Ref ID:</span> {details.refId}</p>
                                <p><span className="font-medium">Amount:</span> NPR {details.totalAmount}</p>
                                <p><span className="font-medium">Status:</span> {details.status}</p>
                            </div>
                        )}
                    </>
                )}

                {status === "failed" && (
                    <>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full
                            bg-red-100 dark:bg-red-500/10 theme-toggle-icon">
                            <svg viewBox="0 0 24 24" className="h-8 w-8 text-red-500" fill="none">
                                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Verification failed</h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            We couldn't verify this payment. Please try again.
                        </p>
                    </>
                )}

                <Link
                    to="/payment"
                    className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white
                        hover:opacity-90 transition-opacity"
                >
                    Back to payment page
                </Link>
            </div>
        </div>
    )
}

export default PaymentSuccess
