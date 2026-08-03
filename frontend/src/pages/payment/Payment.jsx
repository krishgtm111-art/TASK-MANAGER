import React, { useState } from "react"
import { API_BASE_URL } from "../../utils/api"

/**
 * Demo checkout page. Calls the backend to create a signed eSewa
 * transaction, then auto-submits a hidden form to eSewa's TEST/SANDBOX
 * payment gateway (rc-epay.esewa.com.np) — no real money moves here.
 */
const Payment = () => {
    const [amount, setAmount] = useState("100")
    const [productName, setProductName] = useState("Task Manager Pro Plan")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handlePay = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch(`${API_BASE_URL}/api/payments/initiate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, productName }),
            })
            const data = await res.json()

            if (!data.success) {
                setError(data.message || "Could not start payment")
                setLoading(false)
                return
            }

            // Build and submit a real HTML form — eSewa expects a
            // standard POST form submission, not a fetch/XHR body.
            const form = document.createElement("form")
            form.method = "POST"
            form.action = data.gatewayUrl

            Object.entries(data.fields).forEach(([name, value]) => {
                const input = document.createElement("input")
                input.type = "hidden"
                input.name = name
                input.value = value
                form.appendChild(input)
            })

            document.body.appendChild(form)
            form.submit()
        } catch (err) {
            setError("Network error — is the backend running on port 3000?")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12
            bg-slate-50 dark:bg-slate-950 transition-colors">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800
                bg-white dark:bg-slate-900 p-8 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-6">
                    <img
                        src="https://esewa.com.np/common/images/esewa-logo.png"
                        alt="eSewa"
                        className="h-8 w-8 rounded-md bg-white object-contain"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <div>
                        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            Pay with eSewa
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Sandbox / test mode — no real money is charged
                        </p>
                    </div>
                </div>

                <form onSubmit={handlePay} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                            Product / plan
                        </label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700
                                bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-100
                                focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                            Amount (NPR)
                        </label>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700
                                bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-100
                                focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-[#60bb46] hover:bg-[#54a63d] disabled:opacity-60
                            text-white font-medium py-2.5 transition-colors"
                    >
                        {loading ? "Redirecting to eSewa..." : "Pay with eSewa (Test)"}
                    </button>
                </form>

                <div className="mt-6 rounded-lg bg-slate-100 dark:bg-slate-800/60 p-3 text-xs text-slate-500 dark:text-slate-400">
                    <p className="font-medium text-slate-600 dark:text-slate-300 mb-1">Test credentials</p>
                    <p>eSewa ID: 9806800001 – 9806800005 · Password: Nepal@123</p>
                    <p>MPIN: 1122 · OTP token: 123456</p>
                </div>
            </div>
        </div>
    )
}

export default Payment
