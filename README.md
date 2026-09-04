<div align="center">

  # 🛠️ Fixly — Local Service Booking Platform

  <p align="center">
    <strong>A modern, full-stack MERN marketplace platform connecting local homeowners with verified repair and maintenance professionals.</strong>
  </p>

  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.x-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

</div>

---

## 🌟 Overview

**Fixly** reimagines how everyday homeowners discover, schedule, and track local home maintenance and repair services. Designed with a **modern SaaS aesthetic** (`#F7F6F2` warm canvas, floating glass composition, tight typography, and subtle Framer Motion depth), Fixly bridges the gap between customers needing urgent repairs and skilled professionals seeking local job opportunities.

Whether it's an emergency pipe leak, electrical wiring replacement, or deep home cleaning, Fixly provides an end-to-end, two-sided marketplace with real-time lifecycle tracking, technician verification workflows, review moderation, and persistent notifications.

---

<img width="1901" height="955" alt="image" src="https://github.com/user-attachments/assets/3470a79d-ea95-48e9-89c8-46c0917d0800" />

<img width="1617" height="971" alt="image" src="https://github.com/user-attachments/assets/2f0478bd-93ec-4ebe-b7ba-44821ed22e17" />

<img width="1898" height="1078" alt="image" src="https://github.com/user-attachments/assets/ef409733-cc67-4e4a-ad7f-e365bad5dc3b" />

<img width="1900" height="1078" alt="image" src="https://github.com/user-attachments/assets/ade1cdd4-4386-4ebe-8e43-7ef6a18bd3ab" />

<img width="1918" height="1078" alt="image" src="https://github.com/user-attachments/assets/9dfe0add-f67f-41fc-902b-bd513166b6c2" />

<img width="1738" height="1078" alt="image" src="https://github.com/user-attachments/assets/103f958e-9cfc-417d-86e7-48c5eb08182b" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/7c1fdf4f-49ab-45cf-a9ed-d6022528bad6" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/64213acf-ecae-4ed8-8dd7-8030cb3ef726" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2cbdc57f-f3e3-4e28-be0c-e0ee3fdd16b1" />

<img width="1896" height="1078" alt="image" src="https://github.com/user-attachments/assets/e350854d-6965-4f72-84f3-02ecf55ba413" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/0c06c99f-1293-43a7-81ca-40c4b3920153" />

---

## ✨ Core Features

### 🎨 1. SaaS & Editorial UI/UX
- **Floating Pill Navigation**: Centered navbar with backdrop blur (`backdrop-blur-md`), role-based portal links, and smooth scroll transitions.
- **3-Card Interactive Hero Composition**: Parallax-driven floating UI cards (`Rahul Kumar Main Card`, `Completed Job Badge`, `New Request Alert`) giving users an immediate visual preview of the product lifecycle.
- **Asymmetrical Service Grid**: Full-width 12-column grid across 8 service categories with compact, high-information-density cards.

### 👤 2. Dual-Role Authentication & Access Control
- **JWT & HTTP-Only Cookies**: Secure authentication flow with role-based routing (`customer`, `technician`, `admin`).
- **Account Suspension Protection**: Built-in `accountStatus` (`ACTIVE` / `SUSPENDED`) enforcing immediate access blockage for suspended accounts.

### 🔍 3. Professional Discovery & Filtering
- Discover verified technicians by service category (Plumbing, Electrical, AC Repair, Cleaning, etc.), distance proximity, hourly rates, and customer star ratings.
- View detailed technician profiles including skills, bio, service areas, and real verified customer reviews.

### 🔄 4. Active Service Request Lifecycle
- **Step 1: Request Creation**: Customers submit detailed problem titles, descriptions, schedules, and addresses.
- **Step 2: Technician Review**: Professionals receive requests in their dashboard with `[Accept]` or `[Reject]` actions.
- **Step 3: Service Lifecycle**: Real-time progress updates through status stages:
  $$\text{PENDING} \longrightarrow \text{ACCEPTED} \longrightarrow \text{IN\_PROGRESS} \longrightarrow \text{COMPLETED}$$

### ⭐ 5. Ratings, Reviews & Recalculation Engine
- Customers rate completed bookings ($1-5$ stars) and leave written feedback.
- Automated rating recalculation engine updates technician average rating and total review count in real time upon creation or administrative moderation.

### 🔔 6. Persistent Notification Engine
- Header notification bell (`NotificationBell.jsx`) with live unread badge counter.
- Automated alerts for new job requests, profile approvals/rejections, job status updates, and review receipts.
- "Mark as read" and "Mark all as read" controls.

### 🛡️ 7. Admin Control Panel & Platform Management (`/admin/*`)
- **Real MongoDB KPI Stats**: Live counts for total users, technicians, pending verifications, active bookings, completed services, total reviews, and completion rate ($87.4\%$).
- **Technician Verification Queue**: Review pending professional profiles with `[Approve]` or `[Reject]` triggers (with required rejection notes).
- **User Account Suspension**: Toggle customer or technician accounts between `ACTIVE` and `SUSPENDED` (protected against self-admin suspension).
- **Review Moderation**: Admin can delete inappropriate reviews with automatic technician rating recalculation.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/) + Custom HSL design tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion 12](https://www.framer.com/motion/)
- **Routing**: `react-router-dom v7`

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) + [Mongoose ODM](https://mongoosejs.com/)
- **Security**: `jsonwebtoken` (JWT), `bcryptjs` password hashing, `cookie-parser`

---

## 📂 Project Structure

```
Fixly-Local-Services/
├── server/                      # Express Backend Server
│   ├── config/                  # Database Connection (db.js)
│   ├── controllers/             # Business Logic Handlers
│   │   ├── adminController.js   # Platform Analytics & Moderation
│   │   ├── authController.js    # JWT Authentication & Registration
│   │   ├── notificationController.js # Notification Engine
│   │   ├── requestController.js # Booking Lifecycle Engine
│   │   ├── reviewController.js  # Ratings & Reviews Controller
│   │   ├── serviceController.js # Service Categories
│   │   └── technicianController.js # Pro Profiles & Filtering
│   ├── middleware/              # Auth & Error Middleware
│   ├── models/                  # Mongoose Database Schemas
│   ├── routes/                  # API Endpoint Routes
│   └── server.js                # Server Entry Point
│
├── src/                         # React Frontend Client
│   ├── components/              # Modular UI Components
│   │   ├── cards/               # Service & Technician Cards
│   │   ├── common/              # NotificationBell, RatingStars
│   │   ├── home/                # HeroVisual (3 Floating Cards)
│   │   ├── layout/              # Navbar, AdminSidebar, Footer
│   │   └── routes/              # ProtectedRoute Component
│   ├── context/                 # AuthContext & State Management
│   ├── pages/                   # Application Pages & Admin Panel
│   ├── services/                # API Client Wrapper Services
│   ├── App.jsx                  # Main Routing Component
│   └── index.css                # Custom CSS Design Tokens & Utilities
│
├── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18.x or higher)
- **npm** or **yarn**
- **MongoDB** (Local instance running on `mongodb://127.0.0.1:27017/fixly` or MongoDB Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/Omkar-narsale/Fixly-Local-Services.git
cd Fixly-Local-Services
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/fixly
JWT_SECRET=fixnear_default_jwt_secret_key_2026
NODE_ENV=development
```

### 4. Seed Development Marketplace Data
Populate MongoDB with categories, verified technicians, customer profiles, and test bookings:
```bash
npm run seed
```

### 5. Run the Application
Start both the Express Backend and Vite Frontend dev server concurrently:

```bash
# Terminal 1: Backend Server (Port 5000)
npm run server

# Terminal 2: Frontend Dev Server (Port 5174)
npm run dev
```

Visit `http://localhost:5174` in your browser.

---

## 🔑 Demo Login Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@fixnear.com` | `Admin@123456` | Full Platform Management (`/admin/*`) |
| **Customer** | `customer1@test.com` | `Password123` | Create Requests, Customer Portal (`/customer/*`) |
| **Technician (Rahul)** | `rahul.kumar@fixly.com` | `Password123` | Accept Jobs, Technician Portal (`/technician/*`) |

---

## 📡 API Reference Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer or technician account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive HTTP-Only JWT |
| `GET` | `/api/services` | Public | List all 8 service categories |
| `GET` | `/api/technicians` | Public | Search & filter verified technicians |
| `POST` | `/api/requests` | Customer | Create a new service request |
| `PATCH` | `/api/requests/:id/accept` | Technician | Accept service request |
| `PATCH` | `/api/requests/:id/start` | Technician | Start active job (`IN_PROGRESS`) |
| `PATCH` | `/api/requests/:id/complete` | Technician | Complete active job (`COMPLETED`) |
| `POST` | `/api/reviews` | Customer | Submit 5-star review & recalculate ratings |
| `GET` | `/api/notifications` | Protected | Fetch user notifications & unread count |
| `GET` | `/api/admin/stats` | Admin | Fetch platform KPI statistics & completion rate |
| `PATCH` | `/api/admin/users/:id/status` | Admin | Suspend or activate user account |
| `PATCH` | `/api/admin/technicians/:id/verify` | Admin | Approve or reject technician profile |

---

## 📝 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ by <strong>Yash Patil</strong></sub>
</div>
