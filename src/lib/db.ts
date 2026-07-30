import { createClient } from "@libsql/client";
import { products as initialProducts, type Product } from "./data";

export const db = createClient({
  url: "file:bazaar.db",
});

// Initialize database schema and seed if necessary
export async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE,
      title TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      originalPrice REAL,
      discount REAL,
      image TEXT,
      gallery TEXT, -- JSON string
      rating REAL,
      reviews INTEGER,
      sold INTEGER,
      stock INTEGER NOT NULL,
      brand TEXT,
      seller TEXT,
      category TEXT,
      subcategory TEXT,
      tags TEXT, -- JSON string
      specs TEXT, -- JSON string
      badge TEXT
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer TEXT NOT NULL,
      email TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL,
      date TEXT NOT NULL,
      itemsCount INTEGER NOT NULL,
      items TEXT NOT NULL -- JSON string
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      city TEXT NOT NULL,
      orders INTEGER NOT NULL DEFAULT 0,
      spent REAL NOT NULL DEFAULT 0
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS coupons (
      code TEXT PRIMARY KEY,
      desc TEXT NOT NULL,
      discount TEXT NOT NULL,
      uses INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      sender TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      date TEXT NOT NULL,
      replied INTEGER NOT NULL DEFAULT 0,
      replyText TEXT
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS advertisements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      image_url TEXT NOT NULL,
      link_url TEXT NOT NULL DEFAULT '#',
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS carousel_slides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT NOT NULL,
      caption TEXT,
      sub_caption TEXT,
      target_url TEXT NOT NULL DEFAULT '#',
      position INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image_url TEXT NOT NULL DEFAULT '',
      position INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Seeding products
  const result = await db.execute("SELECT COUNT(*) as count FROM products");
  const count = result.rows[0].count as number;

  if (count === 0) {
    console.log("Seeding database with initial products...");
    const stmt = "INSERT INTO products (id, slug, title, description, price, originalPrice, discount, image, gallery, rating, reviews, sold, stock, brand, seller, category, subcategory, tags, specs, badge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    // Process sequentially or in batch
    for (const p of initialProducts) {
      await db.execute({
        sql: stmt,
        args: [
          p.id,
          p.slug,
          p.title,
          p.description,
          p.price,
          p.originalPrice,
          p.discount,
          p.image,
          JSON.stringify(p.gallery),
          p.rating,
          p.reviews,
          p.sold,
          p.stock,
          p.brand,
          p.seller,
          p.category,
          p.subcategory,
          JSON.stringify(p.tags),
          JSON.stringify(p.specs),
          p.badge || null,
        ]
      });
    }
    console.log("Database seeded successfully.");
  }

  // Seeding orders
  const ordersResult = await db.execute("SELECT COUNT(*) as count FROM orders");
  if ((ordersResult.rows[0].count as number) === 0) {
    console.log("Seeding database with initial orders...");
    const initialOrders = [
      { id: "BZ483920", customer: "Sadia Rahman", email: "sadia@example.com", total: 12490, status: "Delivered", date: "Jul 22, 2026", itemsCount: 3, items: JSON.stringify([{ title: "SonicWave X7 ANC Headphones", qty: 1, price: 8990 }, { title: "Trailblazer Running Shoes", qty: 1, price: 3490 }]) },
      { id: "BZ483919", customer: "Mahin Ahmed", email: "mahin@example.com", total: 3890, status: "Shipped", date: "Jul 21, 2026", itemsCount: 1, items: JSON.stringify([{ title: "Silk Blend Saree — Emerald", qty: 1, price: 3890 }]) },
      { id: "BZ483918", customer: "Rifat Hossain", email: "rifat@example.com", total: 8990, status: "Packed", date: "Jul 20, 2026", itemsCount: 1, items: JSON.stringify([{ title: "PowerFlex Adjustable Dumbbell", qty: 1, price: 8990 }]) },
      { id: "BZ483917", customer: "Tania Khan", email: "tania@example.com", total: 2290, status: "Pending", date: "Jul 19, 2026", itemsCount: 1, items: JSON.stringify([{ title: "ChefPro 5L Non-Stick Wok", qty: 1, price: 2290 }]) },
      { id: "BZ483916", customer: "Arif Islam", email: "arif@example.com", total: 5490, status: "Delivered", date: "Jul 18, 2026", itemsCount: 2, items: JSON.stringify([{ title: "SG Player Edition Cricket Bat", qty: 1, price: 5490 }]) },
    ];
    for (const o of initialOrders) {
      await db.execute({
        sql: "INSERT INTO orders (id, customer, email, total, status, date, itemsCount, items) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        args: [o.id, o.customer, o.email, o.total, o.status, o.date, o.itemsCount, o.items]
      });
    }
  }

  // Seeding customers
  const customersResult = await db.execute("SELECT COUNT(*) as count FROM customers");
  if ((customersResult.rows[0].count as number) === 0) {
    console.log("Seeding database with initial customers...");
    const initialCustomers = [
      { id: "CUST-001", name: "Nusrat Jahan", email: "nusrat@example.com", phone: "+8801711223344", city: "Dhaka", orders: 12, spent: 48200 },
      { id: "CUST-002", name: "Mahin Ahmed", email: "mahin@example.com", phone: "+8801822334455", city: "Chattogram", orders: 8, spent: 32900 },
      { id: "CUST-003", name: "Rifat Hossain", email: "rifat@example.com", phone: "+8801933445566", city: "Sylhet", orders: 4, spent: 12400 },
      { id: "CUST-004", name: "Tania Khan", email: "tania@example.com", phone: "+8801544556677", city: "Khulna", orders: 6, spent: 24800 },
      { id: "CUST-005", name: "Arif Islam", email: "arif@example.com", phone: "+8801655667788", city: "Rajshahi", orders: 5, spent: 19500 },
    ];
    for (const c of initialCustomers) {
      await db.execute({
        sql: "INSERT INTO customers (id, name, email, phone, city, orders, spent) VALUES (?, ?, ?, ?, ?, ?, ?)",
        args: [c.id, c.name, c.email, c.phone, c.city, c.orders, c.spent]
      });
    }
  }

  // Seeding coupons
  const couponsResult = await db.execute("SELECT COUNT(*) as count FROM coupons");
  if ((couponsResult.rows[0].count as number) === 0) {
    console.log("Seeding database with initial coupons...");
    const initialCoupons = [
      { code: "BAZAAR2K", desc: "৳2,000 off on orders over ৳5,000", discount: "৳2,000 OFF", uses: 340, active: 1 },
      { code: "WELCOME10", desc: "10% off your first order", discount: "10% OFF", uses: 2100, active: 1 },
      { code: "FREESHIP", desc: "Free standard delivery across Bangladesh", discount: "FREE SHIPPING", uses: 890, active: 1 },
    ];
    for (const c of initialCoupons) {
      await db.execute({
        sql: "INSERT INTO coupons (code, desc, discount, uses, active) VALUES (?, ?, ?, ?, ?)",
        args: [c.code, c.desc, c.discount, c.uses, c.active]
      });
    }
  }

  // Seeding messages
  const messagesResult = await db.execute("SELECT COUNT(*) as count FROM messages");
  if ((messagesResult.rows[0].count as number) === 0) {
    console.log("Seeding database with initial messages...");
    const initialMessages = [
      { id: "MSG-101", sender: "Kazi Farhan", email: "farhan@example.com", subject: "Express Delivery Inquiry", message: "Is same-day delivery available in Dhanmondi, Dhaka for electronics?", date: "2 hours ago", replied: 0, replyText: null },
      { id: "MSG-102", sender: "Sumaiya Akter", email: "sumaiya@example.com", subject: "Warranty details for Aurora Pro", message: "Does the 1-year warranty cover accidental damage?", date: "5 hours ago", replied: 0, replyText: null },
      { id: "MSG-103", sender: "Tanvir Hasan", email: "tanvir@example.com", subject: "bKash Cashback Query", message: "I paid via bKash but haven't received the cashback SMS yet.", date: "1 day ago", replied: 1, replyText: "Cashback takes up to 24 hours to process from bKash gateway." },
    ];
    for (const m of initialMessages) {
      await db.execute({
        sql: "INSERT INTO messages (id, sender, email, subject, message, date, replied, replyText) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        args: [m.id, m.sender, m.email, m.subject, m.message, m.date, m.replied, m.replyText]
      });
    }
  }

  const brandsResult = await db.execute("SELECT COUNT(*) as count FROM brands");
  if ((brandsResult.rows[0].count as number) === 0) {
    console.log("Seeding database with initial brands...");
    const initialBrands = [
      { name: "Aurora", image_url: "https://picsum.photos/seed/brand-Aurora/240/120" },
      { name: "Nimbus", image_url: "https://picsum.photos/seed/brand-Nimbus/240/120" },
      { name: "SonicWave", image_url: "https://picsum.photos/seed/brand-SonicWave/240/120" },
      { name: "PulseFit", image_url: "https://picsum.photos/seed/brand-PulseFit/240/120" },
      { name: "Aarong", image_url: "https://picsum.photos/seed/brand-Aarong/240/120" },
      { name: "Radhuni", image_url: "https://picsum.photos/seed/brand-Radhuni/240/120" },
      { name: "Pran", image_url: "https://picsum.photos/seed/brand-Pran/240/120" },
      { name: "Nestlé", image_url: "https://picsum.photos/seed/brand-Nestlé/240/120" },
      { name: "Bosch", image_url: "https://picsum.photos/seed/brand-Bosch/240/120" },
      { name: "Stanley", image_url: "https://picsum.photos/seed/brand-Stanley/240/120" },
    ];

    for (const [index, brand] of initialBrands.entries()) {
      await db.execute({
        sql: "INSERT INTO brands (name, image_url, position, active) VALUES (?, ?, ?, ?)",
        args: [brand.name, brand.image_url, index, 1]
      });
    }
  }
}

// Utility to parse product row back to Product type
export function parseProductRow(row: any): Product {
  return {
    ...row,
    gallery: JSON.parse(row.gallery || "[]"),
    tags: JSON.parse(row.tags || "[]"),
    specs: JSON.parse(row.specs || "{}"),
  };
}
