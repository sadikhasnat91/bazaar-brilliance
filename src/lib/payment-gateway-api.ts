// payment-gateway-api.ts
// Server functions for real Payment Gateway integrations (SSLCommerz, bKash, Stripe).
// createServerFn handlers execute ONLY on the server — secret keys never reach client bundles.

import { createServerFn } from "@tanstack/react-start";
import { db } from "./db";

export interface SslCommerzInitInput {
  amount: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod?: string;
  baseUrl?: string;
}

export interface GatewaySettings {
  sslcommerzStoreId: string;
  sslcommerzStorePasswd: string;
  sslcommerzIsLive: boolean;
  bkashAppKey: string;
  bkashAppSecret: string;
  bkashUsername: string;
  bkashPassword: string;
  bkashIsLive: boolean;
  stripeSecretKey: string;
}

// Fetch payment gateway configuration from DB or process.env
async function getGatewayCredentials(): Promise<GatewaySettings> {
  let dbSettings: Partial<GatewaySettings> = {};
  try {
    const res = await db.execute("SELECT key, value FROM settings WHERE key LIKE 'gw_%'");
    for (const row of res.rows) {
      if (row.key === "gw_sslcommerz_store_id") dbSettings.sslcommerzStoreId = row.value as string;
      if (row.key === "gw_sslcommerz_store_passwd") dbSettings.sslcommerzStorePasswd = row.value as string;
      if (row.key === "gw_sslcommerz_is_live") dbSettings.sslcommerzIsLive = row.value === "true";
      if (row.key === "gw_bkash_app_key") dbSettings.bkashAppKey = row.value as string;
      if (row.key === "gw_bkash_app_secret") dbSettings.bkashAppSecret = row.value as string;
      if (row.key === "gw_bkash_username") dbSettings.bkashUsername = row.value as string;
      if (row.key === "gw_bkash_password") dbSettings.bkashPassword = row.value as string;
      if (row.key === "gw_stripe_secret_key") dbSettings.stripeSecretKey = row.value as string;
    }
  } catch {
    // Settings table might not exist yet or empty
  }

  return {
    sslcommerzStoreId: dbSettings.sslcommerzStoreId || process.env.SSLCOMMERZ_STORE_ID || "testbox",
    sslcommerzStorePasswd: dbSettings.sslcommerzStorePasswd || process.env.SSLCOMMERZ_STORE_PASSWORD || "qwerty",
    sslcommerzIsLive: dbSettings.sslcommerzIsLive ?? (process.env.SSLCOMMERZ_IS_LIVE === "true"),
    bkashAppKey: dbSettings.bkashAppKey || process.env.BKASH_APP_KEY || "",
    bkashAppSecret: dbSettings.bkashAppSecret || process.env.BKASH_APP_SECRET || "",
    bkashUsername: dbSettings.bkashUsername || process.env.BKASH_USERNAME || "",
    bkashPassword: dbSettings.bkashPassword || process.env.BKASH_PASSWORD || "",
    bkashIsLive: dbSettings.bkashIsLive ?? (process.env.BKASH_IS_LIVE === "true"),
    stripeSecretKey: dbSettings.stripeSecretKey || process.env.STRIPE_SECRET_KEY || "",
  };
}

// Server function: Get Current Public Gateway Config Status
export const getGatewayStatusFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const creds = await getGatewayCredentials();
    return {
      hasSslCommerz: Boolean(creds.sslcommerzStoreId && creds.sslcommerzStorePasswd),
      sslcommerzIsLive: creds.sslcommerzIsLive,
      sslcommerzStoreId: creds.sslcommerzStoreId,
      hasBkash: Boolean(creds.bkashAppKey && creds.bkashAppSecret),
      hasStripe: Boolean(creds.stripeSecretKey),
    };
  });

// Server function: Save Gateway Settings from Admin UI
export const saveGatewaySettingsFn = createServerFn({ method: "POST" })
  .validator((data: Partial<GatewaySettings>) => data)
  .handler(async ({ data }) => {
    try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        )
      `);

      const entries = [
        ["gw_sslcommerz_store_id", data.sslcommerzStoreId || ""],
        ["gw_sslcommerz_store_passwd", data.sslcommerzStorePasswd || ""],
        ["gw_sslcommerz_is_live", String(data.sslcommerzIsLive ?? false)],
        ["gw_bkash_app_key", data.bkashAppKey || ""],
        ["gw_bkash_app_secret", data.bkashAppSecret || ""],
        ["gw_bkash_username", data.bkashUsername || ""],
        ["gw_bkash_password", data.bkashPassword || ""],
        ["gw_stripe_secret_key", data.stripeSecretKey || ""],
      ];

      for (const [key, value] of entries) {
        await db.execute({
          sql: "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
          args: [key, value],
        });
      }
      return { success: true };
    } catch (err: any) {
      console.error("Error saving gateway settings:", err);
      return { success: false, error: err.message };
    }
  });

// Server function: Initiate SSLCommerz Real Gateway Session
export const initSslCommerzPaymentFn = createServerFn({ method: "POST" })
  .validator((input: SslCommerzInitInput) => input)
  .handler(async ({ data }) => {
    const creds = await getGatewayCredentials();
    const isLive = creds.sslcommerzIsLive;
    const apiUrl = isLive
      ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
      : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

    const host = data.baseUrl || "http://localhost:3000";

    const params = new URLSearchParams({
      store_id: creds.sslcommerzStoreId,
      store_passwd: creds.sslcommerzStorePasswd,
      total_amount: String(data.amount),
      currency: "BDT",
      tran_id: data.orderId,
      success_url: `${host}/checkout?payment_status=success&order_id=${data.orderId}&val_id={val_id}`,
      fail_url: `${host}/checkout?payment_status=fail&order_id=${data.orderId}`,
      cancel_url: `${host}/checkout?payment_status=cancel&order_id=${data.orderId}`,
      ipn_url: `${host}/checkout?payment_status=ipn&order_id=${data.orderId}`,
      cus_name: data.customerName || "Customer",
      cus_email: data.customerEmail || "customer@example.com",
      cus_add1: "House 12, Road 4, Dhanmondi",
      cus_city: "Dhaka",
      cus_postcode: "1209",
      cus_country: "Bangladesh",
      cus_phone: data.customerPhone || "01700000000",
      shipping_method: "NO",
      product_name: `Bazaar Order #${data.orderId}`,
      product_category: "Ecommerce",
      product_profile: "general",
    });

    if (data.paymentMethod === "bkash") {
      params.append("multi_card_name", "bkash");
    } else if (data.paymentMethod === "nagad") {
      params.append("multi_card_name", "nagad");
    } else if (data.paymentMethod === "rocket") {
      params.append("multi_card_name", "dbblnexus");
    } else if (data.paymentMethod === "card") {
      params.append("multi_card_name", "visacard,mastercard,amex");
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      const resJson = await response.json();

      if (resJson.status === "SUCCESS" && resJson.GatewayPageURL) {
        return {
          success: true,
          gateway: "sslcommerz",
          redirectUrl: resJson.GatewayPageURL,
          sessionKey: resJson.sessionkey,
          isLive,
        };
      } else {
        return {
          success: false,
          error: resJson.failedreason || "Failed to initialize SSLCommerz gateway session",
          resJson,
        };
      }
    } catch (err: any) {
      console.error("SSLCommerz API Error:", err);
      return {
        success: false,
        error: err.message || "Network error connecting to SSLCommerz API",
      };
    }
  });

// Server function: Verify SSLCommerz Transaction
export const verifySslCommerzPaymentFn = createServerFn({ method: "POST" })
  .validator((data: { val_id: string }) => data)
  .handler(async ({ data }) => {
    const creds = await getGatewayCredentials();
    const isLive = creds.sslcommerzIsLive;
    const apiUrl = isLive
      ? `https://securepay.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${data.val_id}&store_id=${creds.sslcommerzStoreId}&store_passwd=${creds.sslcommerzStorePasswd}&v=1&format=json`
      : `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${data.val_id}&store_id=${creds.sslcommerzStoreId}&store_passwd=${creds.sslcommerzStorePasswd}&v=1&format=json`;

    try {
      const response = await fetch(apiUrl);
      const result = await response.json();
      if (result.status === "VALID" || result.status === "VALIDATED") {
        return {
          isValid: true,
          orderId: result.tran_id,
          amount: parseFloat(result.amount),
          cardType: result.card_type,
          bankTranId: result.bank_tran_id,
          status: result.status,
        };
      } else {
        return { isValid: false, status: result.status, error: "Invalid payment token" };
      }
    } catch (err: any) {
      return { isValid: false, error: err.message };
    }
  });
