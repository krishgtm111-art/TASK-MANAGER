import React from "react"
import { useTheme } from "../context/ThemeContext"

const SunIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-amber-500">
        <circle cx="12" cy="12" r="4.5" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
        </g>
    </svg>
)

const MoonIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-indigo-200">
        <path
            d="M20.5 14.7A8.5 8.5 0 1 1 9.3 3.5a7 7 0 0 0 11.2 11.2Z"
            fill="currentColor"
        />
    </svg>
)

/**
 * Animated light/dark mode switch. Toggling slides the knob across the
 * track, cross-fades the sun/moon icon, and (via ThemeContext) triggers
 * a smooth color transition across the entire app.
 */
const ThemeToggle = ({ className = "" }) => {
    const { isDark, toggleTheme } = useTheme()

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
            className={`relative inline-flex h-7 w-14 shrink-0 items-center rounded-full
                border border-slate-300 dark:border-slate-600
                bg-slate-200 dark:bg-slate-700
                transition-colors duration-300 ease-in-out
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
                cursor-pointer ${className}`}
        >
            <span
                className={`flex items-center justify-center h-5 w-5 rounded-full bg-white dark:bg-slate-900
                    shadow-md ring-1 ring-black/5
                    transition-transform duration-300 ease-in-out
                    ${isDark ? "translate-x-[30px]" : "translate-x-[3px]"}`}
            >
                <span key={isDark ? "moon" : "sun"} className="theme-toggle-icon flex items-center justify-center">
                    {isDark ? <MoonIcon /> : <SunIcon />}
                </span>
            </span>
        </button>
    )
}

export default ThemeToggle
