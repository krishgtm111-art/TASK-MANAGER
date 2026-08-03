import React, { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext(undefined)

const getInitialTheme = () => {
    if (typeof window === "undefined") return "light"

    const stored = window.localStorage.getItem("theme")
    if (stored === "light" || stored === "dark") return stored

    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches
    return prefersDark ? "dark" : "light"
}

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(getInitialTheme)

    useEffect(() => {
        const root = document.documentElement

        // Briefly enable the transition class so every element animates
        // its colors, then remove it so it doesn't affect unrelated
        // hover/focus transitions elsewhere in the app.
        root.classList.add("theme-transition")
        root.classList.toggle("dark", theme === "dark")
        window.localStorage.setItem("theme", theme)

        const timeout = setTimeout(() => root.classList.remove("theme-transition"), 500)
        return () => clearTimeout(timeout)
    }, [theme])

    const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"))

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === "dark" }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) throw new Error("useTheme must be used within a ThemeProvider")
    return context
}
