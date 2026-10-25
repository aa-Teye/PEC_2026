# PEC 2026 — THIS SAME JESUS (Acts 1:11)

**Prophetic Encounter Convention 2026**  
**Host:** Rev. Dr. Ebenezer Okronipa  
**Church:** Overcomers Nation Church (Opp. Ayrton Drug, Tesano, Accra)  
**Dates:** 23rd – 29th October  
**Entry:** 100% Free  

---

## 🚀 Features

- **Monorepo / Single Folder Architecture**: React 19 + Vite frontend coupled with Vercel Serverless Functions (`/api/*`).
- **Neon PostgreSQL Backend**: Direct serverless connection using `@neondatabase/serverless` for instant registrations, check-in logging, and real-time analytics.
- **Automated SMS Delivery**: Built-in integration with **mNotify** sending instant ticket code confirmations to Ghanaian phone numbers upon registration.
- **Digital Delegate Pass & QR Code**: Immediate pass generation on registration with ticket code (`PEC-XXXXXX`), QR code verification, and 1-click PDF badge download.
- **Attendance Check-In Terminal**: Search by phone or ticket code, live duplicate-check prevention per conference day, and timestamps.
- **Admin Management Portal**:
  - Protected by PIN (`admin2026`).
  - Real-time Neon DB connection status indicator.
  - Search and filter by status, first-timers, or transport assistance.
  - 1-click **Excel / CSV Export** and **PDF Roster**.
  - Resend SMS ticket button.

---

## 🛠️ Environment Variables

Add these to your **Vercel Project Settings > Environment Variables** (or local `.env`):

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Neon PostgreSQL connection string (pooler recommended) |
| `MNOTIFY_API_KEY` | mNotify API key for SMS delivery (`aHZxQXN6YnBvUHFHRU9XaUdvZnQ`) |
| `SMS_SENDER_ID` | Sender ID for SMS messages (default: `OVERCOMERS`, max 11 chars) |
| `ADMIN_PASSWORD` | PIN to unlock admin portal (default: `admin2026`) |

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Production build test
npm run build
```

---

## ☁️ Deployment to Vercel

1. Import this repository (`https://github.com/awonders003/PEC_2026.git`) into Vercel.
2. Framework preset: **Vite**.
3. Add the environment variables (`DATABASE_URL`, `MNOTIFY_API_KEY`).
4. Deploy!
