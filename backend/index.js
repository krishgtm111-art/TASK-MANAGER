import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import paymentRoutes from "./routes/payment.routes.js"
import authRoutes from "./routes/auth.routes.js"

dotenv.config()


mongoose.connect(process.env.MONGODB_URI).then(() =>
     { console.log("Database is connected");
}).catch((err) => { 
    console.log( err)
    })


const app = express()

// Middleware to handle cors
app.use(cors({
    origin: process.env.FRONT_END_URL || "http://localhost:5173",
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type","Authorization"],
})
)

// Middleware to handle JSON object in req body
app.use(express.json())

// Auth routes (signup, login, me)
app.use("/api/auth", authRoutes)

// eSewa (test/sandbox) payment routes
app.use("/api/payments", paymentRoutes)

// Any unmatched /api/* route returns JSON instead of Express's default
// HTML 404 page — otherwise frontend `res.json()` calls blow up with
// "Unexpected token '<'" when a route doesn't exist or isn't mounted yet.
app.use("/api", (req, res) => {
    res.status(404).json({ success: false, message: `No API route: ${req.method} ${req.originalUrl}` })
})

app.listen(3000,() => {
    console.log("Server is running on port 3000!")
})
