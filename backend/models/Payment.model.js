import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema(
    {
        transactionUuid: {
            type: String,
            required: true,
            unique: true,
        },
        productName: {
            type: String,
            default: "Task Manager Payment",
        },
        amount: {
            type: Number,
            required: true,
        },
        taxAmount: {
            type: Number,
            default: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["PENDING", "COMPLETE", "FAILED", "CANCELED"],
            default: "PENDING",
        },
        refId: {
            type: String,
            default: null,
        },
        gatewayResponse: {
            type: Object,
            default: null,
        },
    },
    { timestamps: true }
)

const Payment = mongoose.model("Payment", paymentSchema)

export default Payment
