# HINDUSTAN COMPUTER – E-Commerce & Shopkeeper Admin Portal

A modern, fast, professional full-stack computer store website built specifically for **Hindustan Computer**. 

Designed for **single shopkeeper management**—giving you full control over your products, prices, stock, customer orders, and contact details without complicated enterprise bureaucracy.

---

## 🚀 Quick Start (One-Click)

You can launch the website at any time by double-clicking:
- **`run-dev.bat`** (Starts the local development server)
- Or **`start-production.bat`** (Starts the ultra-fast production server)

The website will be live at:
- **Customer Storefront:** [http://localhost:3000](http://localhost:3000)
- **Shopkeeper Admin Panel:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🔑 Shopkeeper Admin Credentials

- **Admin Login URL:** `http://localhost:3000/admin/login`
- **Email:** `admin@hindustancomputer.com`
- **Password:** `Admin@12345`

*(You can update this password or add staff anytime from the admin settings).*

---

## 🌟 Key Features for You (The Shopkeeper)

### 1. Simple Shopkeeper Admin Dashboard (`/admin`)
- **Store Overview:** Real-time revenue, total orders, pending dispatches, and out-of-stock warnings.
- **Product Manager (`/admin/products`):** View all products in your shop, change prices, update stock counts directly in the table, and add/delete products.
- **Simple Add Product Form (`/admin/products/new`):** Add a product in seconds by filling its Name, Category, Price, MRP, Stock, and Photo.
- **Customer Order Management (`/admin/orders`):**
  - See all orders placed by customers.
  - One-click change status: *Order Placed → Payment Confirmed → Packed → Shipped → Delivered*.
  - Assign Courier (Blue Dart, Delhivery, DTDC, etc.) and AWB Tracking Number.
  - **One-Click WhatsApp Customer Button:** Instantly message the customer on WhatsApp with their order and tracking details!
  - **Print GST Tax Invoice:** Print a clean bill with GST breakdown for each order.
- **Coupons & Offers (`/admin/coupons`):** Create promo discount codes (e.g., `WELCOMEHC`, `DIWALI20`) with percentage or flat rupee discounts.
- **Shop Settings (`/admin/settings`):** Update your store phone number, WhatsApp number, physical shop address, delivery fee, and top announcement ticker.

---

### 2. High-Converting Customer Storefront
- **Indian Computer Store Aesthetic:** Clean, fast, dark navy and electric blue theme with Light/Dark mode.
- **25 Categories:** Laptops, Gaming PCs, Monitors, CPUs, GPUs, SSD & RAM, Keyboards, Printers, Networking, etc.
- **Direct WhatsApp Order:** Every product card and product details page includes an **"Order on WhatsApp"** button that pre-fills the message directly to your shop number.
- **PIN Code Delivery Checker:** Customers can enter their 6-digit Indian PIN code to see estimated delivery dates.
- **Smooth Shopping Cart & Checkout:** Supports **Cash on Delivery (COD)**, **UPI / GPay / PhonePe**, and **Razorpay Cards / Net Banking**.
- **Live Order Tracking (`/track-order`):** Customers can track their order progress through a 7-step visual timeline.

---

## 🛠️ Technology Stack
- **Frontend & Backend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Database & Storage:** Dual support for **MongoDB / Mongoose** and **Local High-Performance JSON Persistence Engine** (`data/hindustan_db.json`)
- **Icons & UI:** Lucide React icons with responsive mobile drawer navigation
- **Security:** Password hashing using bcrypt, JWT session tokens, and server-side payment verification.
