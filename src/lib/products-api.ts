// products-api.ts
// createServerFn() handlers run ONLY on the server — libsql never ships to the browser.
// TanStack Start's code-splitter strips handler bodies from the client bundle automatically.

import { createServerFn } from "@tanstack/react-start";
import { db, initDb, parseProductRow } from "./db";
import type { Product } from "./data";

// Ensure DB is initialized when the module loads on the server
let ready: Promise<void> | null = null;
function ensureDb() {
  if (!ready) ready = initDb();
  return ready;
}

export const getProductsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    await ensureDb();
    const res = await db.execute("SELECT * FROM products ORDER BY rowid DESC");
    return res.rows.map(parseProductRow) as Product[];
  });

export const addProductFn = createServerFn({ method: "POST" })
  .validator((data: Product) => data)
  .handler(async ({ data }) => {
    await ensureDb();
    await db.execute({
      sql: "INSERT OR REPLACE INTO products (id, slug, title, description, price, originalPrice, discount, image, gallery, rating, reviews, sold, stock, brand, seller, category, subcategory, tags, specs, badge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: [
        data.id, data.slug, data.title, data.description, data.price, data.originalPrice,
        data.discount, data.image, JSON.stringify(data.gallery), data.rating,
        data.reviews, data.sold, data.stock, data.brand, data.seller,
        data.category, data.subcategory, JSON.stringify(data.tags), JSON.stringify(data.specs),
        data.badge || null
      ]
    });
    return data;
  });

export const updateProductFn = createServerFn({ method: "POST" })
  .validator((data: Product) => data)
  .handler(async ({ data }) => {
    await ensureDb();
    await db.execute({
      sql: `UPDATE products SET
        title = ?, description = ?, price = ?, originalPrice = ?, discount = ?,
        stock = ?, brand = ?, seller = ?, category = ?, subcategory = ?, badge = ?
        WHERE id = ?`,
      args: [
        data.title, data.description, data.price, data.originalPrice, data.discount,
        data.stock, data.brand, data.seller, data.category, data.subcategory,
        data.badge || null, data.id
      ]
    });
    return data;
  });

export const deleteProductFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    await ensureDb();
    await db.execute({ sql: "DELETE FROM products WHERE id = ?", args: [id] });
    return { id };
  });

// --- Orders Server Functions ---

export const getOrdersFn = createServerFn({ method: "GET" })
  .handler(async () => {
    await ensureDb();
    const res = await db.execute("SELECT * FROM orders ORDER BY rowid DESC");
    return res.rows.map(row => ({
      ...row,
      items: JSON.parse((row.items as string) || "[]")
    })) as any[];
  });

export const addOrderFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    await ensureDb();
    await db.execute({
      sql: "INSERT INTO orders (id, customer, email, total, status, date, itemsCount, items) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      args: [
        data.id,
        data.customer,
        data.email,
        data.total,
        data.status,
        data.date,
        data.itemsCount,
        JSON.stringify(data.items)
      ]
    });
    return data;
  });

export const updateOrderStatusFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; status: string }) => data)
  .handler(async ({ data }) => {
    await ensureDb();
    await db.execute({
      sql: "UPDATE orders SET status = ? WHERE id = ?",
      args: [data.status, data.id]
    });
    return data;
  });

// --- Customers Server Functions ---

export const getCustomersFn = createServerFn({ method: "GET" })
  .handler(async () => {
    await ensureDb();
    const res = await db.execute("SELECT * FROM customers ORDER BY rowid DESC");
    return res.rows as any[];
  });

export const addCustomerFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    await ensureDb();
    await db.execute({
      sql: "INSERT INTO customers (id, name, email, phone, city, orders, spent) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [data.id, data.name, data.email, data.phone, data.city, data.orders || 0, data.spent || 0]
    });
    return data;
  });

// --- Coupons Server Functions ---

export const getCouponsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    await ensureDb();
    const res = await db.execute("SELECT * FROM coupons ORDER BY rowid DESC");
    return res.rows.map(row => ({
      ...row,
      active: Boolean(row.active)
    })) as any[];
  });

export const addCouponFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    await ensureDb();
    await db.execute({
      sql: "INSERT OR REPLACE INTO coupons (code, desc, discount, uses, active) VALUES (?, ?, ?, ?, ?)",
      args: [data.code, data.desc, data.discount, data.uses || 0, data.active ? 1 : 0]
    });
    return data;
  });

export const deleteCouponFn = createServerFn({ method: "POST" })
  .validator((code: string) => code)
  .handler(async ({ data: code }) => {
    await ensureDb();
    await db.execute({
      sql: "DELETE FROM coupons WHERE code = ?",
      args: [code]
    });
    return { code };
  });

// --- Messages Server Functions ---

export const getMessagesFn = createServerFn({ method: "GET" })
  .handler(async () => {
    await ensureDb();
    const res = await db.execute("SELECT * FROM messages ORDER BY rowid DESC");
    return res.rows.map(row => ({
      ...row,
      replied: Boolean(row.replied)
    })) as any[];
  });

export const replyToMessageFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; replyText: string }) => data)
  .handler(async ({ data }) => {
    await ensureDb();
    await db.execute({
      sql: "UPDATE messages SET replied = 1, replyText = ? WHERE id = ?",
      args: [data.replyText, data.id]
    });
    return data;
  });

export const getProductFn = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    await ensureDb();
    const res = await db.execute({
      sql: "SELECT * FROM products WHERE id = ? OR slug = ?",
      args: [id, id]
    });
    if (res.rows.length === 0) return null;
    return parseProductRow(res.rows[0]);
  });

