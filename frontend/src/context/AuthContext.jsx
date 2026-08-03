import React, { createContext, useContext, useEffect, useState } from "react"
import { API_BASE_URL } from "../utils/api"

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(() => localStorage.getItem("token"))
    const [loading, setLoading] = useState(true)

    // On first load, restore the session from a stored token by
    // asking the backend who it belongs to.
    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        if (!storedToken) {
            setLoading(false)
            return
        }

        fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${storedToken}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setUser(data.user)
                    setToken(storedToken)
                } else {
                    localStorage.removeItem("token")
                }
            })
            .catch(() => localStorage.removeItem("token"))
            .finally(() => setLoading(false))
    }, [])

    const applySession = (data) => {
        localStorage.setItem("token", data.token)
        setToken(data.token)
        setUser(data.user)
    }

    const login = async (email, password) => {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.message || "Login failed")
        applySession(data)
        return data.user
    }

    const signup = async (name, email, password) => {
        const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.message || "Signup failed")
        applySession(data)
        return data.user
    }

    const logout = () => {
        localStorage.removeItem("token")
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within an AuthProvider")
    return context
}
