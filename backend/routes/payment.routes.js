import express from "express"
import Payment from "../models/Payment.model.js"
import { ESEWA_CONFIG, generateSignature, verifySignature, generateTransactionUuid } from "../utils/esewa.util.js"

const router = express.Router()

const SIGNED_FIELD_NAMES = "total_amount,transaction_uuid,product_code"

/**
 * POST /api/payments/initiate
 * body: { amount, productName }
 *
 * Creates a pending payment record and returns everything the
 * frontend needs to auto-submit a POST form to the eSewa test
 * payment gateway (rc-epay.esewa.com.np).
 */
router.post("/initiate", async (req, res) => {
    try {
        const { amount, productName } = req.body

        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({ success: false, message: "A valid amount is required" })
        }

        const taxAmount = 0
        const productServiceCharge = 0
        const productDeliveryCharge = 0
        const totalAmount = Number(amount) + taxAmount + productServiceCharge + productDeliveryCharge
        const transactionUuid = generateTransactionUuid()

        const signature = generateSignature(
            {
                total_amount: totalAmount,
                transaction_uuid: transactionUuid,
                product_code: ESEWA_CONFIG.PRODUCT_CODE,
            },
            SIGNED_FIELD_NAMES
        )

        // Best-effort persistence — the payment flow itself still works
        // even if MongoDB isn't reachable in this environment.
        try {
            await Payment.create({
                transactionUuid,
                productName: productName || "Task Manager Payment",
                amount: Number(amount),
                taxAmount,
                totalAmount,
                status: "PENDING",
            })
        } catch (dbErr) {
            console.warn("Could not persist pending payment:", dbErr.message)
        }

        const frontendUrl = process.env.FRONT_END_URL || "http://localhost:5173"

        return res.status(200).json({
            success: true,
            gatewayUrl: ESEWA_CONFIG.FORM_URL,
            fields: {
                amount,
                tax_amount: taxAmount,
                total_amount: totalAmount,
                transaction_uuid: transactionUuid,
                product_code: ESEWA_CONFIG.PRODUCT_CODE,
                product_service_charge: productServiceCharge,
                product_delivery_charge: productDeliveryCharge,
                success_url: `${frontendUrl}/payment/success`,
                failure_url: `${frontendUrl}/payment/failure`,
                signed_field_names: SIGNED_FIELD_NAMES,
                signature,
            },
        })
    } catch (err) {
        console.error("eSewa initiate error:", err)
        return res.status(500).json({ success: false, message: "Failed to initiate payment" })
    }
})

/**
 * GET /api/payments/verify?data=<base64 string from eSewa redirect>
 *
 * Decodes eSewa's response, verifies the HMAC signature, cross-checks
 * the transaction status directly with eSewa, and updates our record.
 */
router.get("/verify", async (req, res) => {
    try {
        const { data } = req.query

        if (!data) {
            return res.status(400).json({ success: false, message: "Missing data param" })
        }

        const decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"))
        const { transaction_code, status, total_amount, transaction_uuid, product_code, signed_field_names, signature } = decoded

        const signatureIsValid = verifySignature(
            { transaction_code, status, total_amount, transaction_uuid, product_code, signed_field_names },
            signed_field_names,
            signature
        )

        if (!signatureIsValid) {
            return res.status(400).json({ success: false, message: "Signature verification failed", decoded })
        }

        // Cross-check with eSewa's transaction status API for extra certainty.
        let gatewayStatus = null
        try {
            const statusUrl = `${ESEWA_CONFIG.STATUS_CHECK_URL}?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`
            const statusRes = await fetch(statusUrl)
            gatewayStatus = await statusRes.json()
        } catch (fetchErr) {
            console.warn("Could not reach eSewa status API:", fetchErr.message)
        }

        const finalStatus = gatewayStatus?.status || status

        try {
            await Payment.findOneAndUpdate(
                { transactionUuid: transaction_uuid },
                {
                    status: finalStatus === "COMPLETE" ? "COMPLETE" : "FAILED",
                    refId: transaction_code,
                    gatewayResponse: decoded,
                }
            )
        } catch (dbErr) {
            console.warn("Could not update payment record:", dbErr.message)
        }

        return res.status(200).json({
            success: finalStatus === "COMPLETE",
            status: finalStatus,
            transactionUuid: transaction_uuid,
            refId: transaction_code,
            totalAmount: total_amount,
        })
    } catch (err) {
        console.error("eSewa verify error:", err)
        return res.status(500).json({ success: false, message: "Failed to verify payment" })
    }
})

/**
 * GET /api/payments/:transactionUuid — quick lookup, handy for debugging.
 */
router.get("/:transactionUuid", async (req, res) => {
    try {
        const payment = await Payment.findOne({ transactionUuid: req.params.transactionUuid })
        if (!payment) return res.status(404).json({ success: false, message: "Not found" })
        return res.status(200).json({ success: true, payment })
    } catch (err) {
        return res.status(500).json({ success: false, message: "Lookup failed" })
    }
})

export default router
