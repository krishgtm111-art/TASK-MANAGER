import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.model.js"
import { verifyToken } from "../middleware/auth.middleware.js"

const router = express.Router()

const signToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })

const toPublicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
})

/**
 * POST /api/auth/signup
 * body: { name, email, password }
 */
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email and password are required" })
        }

        const existing = await User.findOne({ email: email.toLowerCase() })
        if (existing) {
            return res.status(409).json({ success: false, message: "An account with that email already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashedPassword })

        const token = signToken(user)
        return res.status(201).json({ success: true, token, user: toPublicUser(user) })
    } catch (err) {
        console.error("Signup error:", err)
        return res.status(500).json({ success: false, message: "Signup failed" })
    }
})

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" })
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select("+password")
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" })
        }

        const token = signToken(user)
        return res.status(200).json({ success: true, token, user: toPublicUser(user) })
    } catch (err) {
        console.error("Login error:", err)
        return res.status(500).json({ success: false, message: "Login failed" })
    }
})

/**
 * GET /api/auth/me
 * header: Authorization: Bearer <token>
 */
router.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        return res.status(200).json({ success: true, user: toPublicUser(user) })
    } catch (err) {
        console.error("Me error:", err)
        return res.status(500).json({ success: false, message: "Failed to fetch user" })
    }
})

export default router
