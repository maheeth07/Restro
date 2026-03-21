# RESTRO SaaS - Multi-Restaurant Management Platform

RESTRO SaaS is a production-level web application that allows multi-restaurant management, QR-based ordering, table management, staff management, and analytics.

## Tech Stack
* **Frontend:** React + Vite, Tailwind CSS v4, Context API, Lucide React, Recharts
* **Backend:** Node.js, Express, MongoDB
* **Security/Auth:** JSON Web Tokens (JWT), bcrypt
* **Other Tools:** qrcode (for QR generation)

## Features
* **Multi-Restaurant & Branch Support:** Owner can manage multiple entities under one account.
* **Menu Management:** Control menus securely per branch.
* **Table Management & QR Code:** Unique tables per branch with dynamic QR Code generation for guest ordering.
* **Customer Menu UI (No Login):** Mobile-first design for ordering directly from tables.
* **Live Kitchen Orders:** Real-time dashboard for managing order states (Pending -> Preparing -> Served -> Completed).
* **Analytics Board:** Understand revenue and peak hours intuitively.

## Installation & Setup

### 1. Backend Setup
1. CD into backend.
```bash
cd backend
npm install
```
2. Verify missing variables in `.env` (like MongoDB URI). Provide a local MongoDB or an external URL. By default, it looks for `mongodb://127.0.0.1:27017/restrosaas`
3. Start the Server:
```bash
node server.js
```
*Backend runs on port 5000*

### 2. Frontend Setup
1. CD into frontend.
```bash
cd frontend
npm install
```
2. Start the App:
```bash
npm run dev
```

### 3. Usage
- Go to `http://localhost:5173/login`
- Click "Register here" to create the initial Owner Account.
- Login using your credentials.
- In the Dashboard Dashboard, add a Restaurant, then add a Branch.
- Add some Tables and Menu Items to the branch.
- Generate a QR code from the Tables interface, open the link in a new tab (simulating a mobile customer), and place an order!
- See the order update live in the "Live Orders" tab.

## Note
Cloudinary image uploading isn't fully integrated on the client due to placeholder API keys. Menu Image uses regular image URL imports for simplicity.
