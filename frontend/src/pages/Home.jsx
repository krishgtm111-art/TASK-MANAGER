import React from "react"
import { Link } from "react-router-dom"

const Home = () => {
    return (
        <div className="min-h-[calc(100vh-56px)] bg-slate-50 dark:bg-slate-950 transition-colors px-4 py-16">
            <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    Task Manager
                </h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                    Use the switch in the top-right corner to try dark mode, or jump straight
                    into the eSewa sandbox payment demo below.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <Link
                        to="/payment"
                        className="rounded-xl border border-slate-200 dark:border-slate-800
                            bg-white dark:bg-slate-900 p-6 text-left shadow-sm hover:shadow-md
                            dark:shadow-none transition-shadow"
                    >
                        <h2 className="font-semibold text-slate-800 dark:text-slate-100">eSewa Payment (Test)</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Try the sandbox checkout flow end to end.
                        </p>
                    </Link>

                    <Link
                        to="/login"
                        className="rounded-xl border border-slate-200 dark:border-slate-800
                            bg-white dark:bg-slate-900 p-6 text-left shadow-sm hover:shadow-md
                            dark:shadow-none transition-shadow"
                    >
                        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Login</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Go to the sign-in page.
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home
