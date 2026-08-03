import crypto from "crypto"

/**
 * eSewa ePay v2 — TEST / SANDBOX configuration.
 *
 * These are eSewa's publicly published developer test credentials
 * (https://developer.esewa.com.np) — they only work against the
 * rc-epay / rc.esewa.com.np sandbox and move NO real money.
 *
 * For production, replace these with your real merchant credentials
 * via environment variables and switch the URLs to the live endpoints
 * (https://epay.esewa.com.np/... and https://esewa.com.np/...).
 */
export const ESEWA_CONFIG = {
    PRODUCT_CODE: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST",
    SECRET_KEY: process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q",
    FORM_URL: process.env.ESEWA_FORM_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
    STATUS_CHECK_URL: process.env.ESEWA_STATUS_URL || "https://rc.esewa.com.np/api/epay/transaction/status/",
}

/**
 * Generates the HMAC-SHA256 (base64) signature eSewa requires.
 * message format: "field1=value1,field2=value2,..." in the exact
 * order given by signedFieldNames.
 */
export const generateSignature = (fields, signedFieldNames, secretKey = ESEWA_CONFIG.SECRET_KEY) => {
    const message = signedFieldNames
        .split(",")
        .map((field) => `${field}=${fields[field]}`)
        .join(",")

    return crypto.createHmac("sha256", secretKey).update(message).digest("base64")
}

/**
 * Verifies a signature returned by eSewa (used on the success callback).
 */
export const verifySignature = (fields, signedFieldNames, signature, secretKey = ESEWA_CONFIG.SECRET_KEY) => {
    const expected = generateSignature(fields, signedFieldNames, secretKey)
    return expected === signature
}

/**
 * Generates a transaction_uuid eSewa will accept
 * (alphanumeric and hyphens only).
 */
export const generateTransactionUuid = () => {
    return `${Date.now()}-${crypto.randomUUID()}`
}
