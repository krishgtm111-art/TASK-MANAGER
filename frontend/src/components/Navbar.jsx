import React from "react"
import { Link, useNavigate } from "react-router-dom"
import ThemeToggle from "./ThemeToggle"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800
            bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-y-2 px-4 py-3">
                <Link to="/" className="text-lg font-semibold text-slate-800 dark:text-slate-100 shrink-0">
                    Task<span className="text-primary">Manager</span>
                </Link>

                <nav className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <Link
                        to="/payment"
                        className="whitespace-nowrap text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                    >
                        <span className="hidden sm:inline">eSewa Payment Demo</span>
                        <span className="sm:hidden">eSewa Demo</span>
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link
                                to={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
                                className="whitespace-nowrap text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                            >
                                {user.name}
                                <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
                                    {user.role}
                                </span>
                            </Link>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="whitespace-nowrap text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors cursor-pointer"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="whitespace-nowrap text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="whitespace-nowrap text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                            >
                                Sign up
                            </Link>
                        </>
                    )}

                    <ThemeToggle className="shrink-0" />
                </nav>
            </div>
        </header>
    )
}

export default Navbar
