# Make Me Ready 👔👗

A full-stack AI-driven personal stylist and wardrobe management platform built with React, Vite, Express, and MongoDB.

---

## 📁 Project Architecture & Folder Structure

```
make-me-ready/
├── backend/
│   ├── .env.example            # Backend environment template
│   ├── index.js                # Server entrypoint & route mounting
│   ├── config/
│   │   ├── db.js               # MongoDB connection & GridFS bucket provider
│   │   └── env.js              # Environment variable parser & fallbacks
│   ├── controllers/
│   │   ├── authController.js   # User registration, login & session handling
│   │   ├── catalogController.js# Catalog, occasions, and looks API
│   │   ├── userController.js   # Profile, favorites, saved looks & cart
│   │   └── wardrobeController.js # Wardrobe item uploads & image handling
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication middleware
│   │   ├── errorHandler.js     # Centralized API error handling
│   │   └── upload.js           # Multer configuration for image uploads
│   ├── models/
│   │   ├── User.js             # User & profile schema
│   │   ├── WardrobeItem.js     # Wardrobe item schema
│   │   ├── CatalogItem.js      # Dynamic catalog & configuration schema
│   │   └── index.js            # Barrel export for models
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth endpoints
│   │   ├── catalogRoutes.js    # /api/catalog endpoints
│   │   ├── userRoutes.js       # /api/state, /api/profile, etc.
│   │   ├── wardrobeRoutes.js   # /api/wardrobe endpoints
│   │   └── index.js            # Master API router
│   └── services/
│       ├── imageService.js     # GridFS streaming with public image fallback
│       └── seedService.js      # Automated catalog & image library seeding
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── public/
│   │   └── img/                # High-resolution wardrobe & occasion imagery
│   └── src/
│       ├── App.jsx             # Route definitions & protected route guards
│       ├── main.jsx            # Application entrypoint
│       ├── index.css           # Tailwind & custom CSS design tokens
│       ├── api/
│       │   └── client.js       # Typed API client with token & status tracking
│       ├── components/
│       │   ├── cards/          # LookCard, OccCard, WardrobeCard
│       │   ├── common/         # Hero, Modal, Tabs, Section, Logo, Icon, Heart
│       │   └── layout/         # Sidebar, Topbar, Layout wrapper
│       ├── context/
│       │   └── StoreContext.jsx# Application context, auth state, local storage
│       ├── data/
│       │   └── constants.js    # Catalog, occasion & navigation definitions
│       └── pages/
│           ├── Auth.jsx        # Login & Multi-step registration
│           ├── CreateOutfit.jsx# Interactive Outfit Builder
│           ├── Home.jsx        # Dashboard & quick style actions
│           ├── Occasions.jsx   # Curated occasion recommendations
│           ├── Profile.jsx     # User style profile, measurements & preferences
│           ├── Recommendations.jsx # AI-powered style recommendations
│           ├── SavedLooks.jsx  # User saved outfits collection
│           ├── Shopping.jsx    # Curated brand catalog & cart
│           └── Wardrobe.jsx    # Digital wardrobe inventory & photo upload
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local MongoDB instance or MongoDB Atlas cluster)

### 2. Environment Configuration
Copy `.env.example` to `backend/.env`:
```sh
cp .env.example backend/.env
```
Ensure your database URI and JWT secret are configured:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/make_me_ready
JWT_SECRET=your-secret-key-at-least-32-characters-long
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
```

### 3. Installation
```sh
npm install
```

### 4. Running the Project
To run both backend API and Vite frontend simultaneously:
```sh
npm run dev
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **Health Check**: [http://localhost:3001/api/health](http://localhost:3001/api/health)

---

## 🛠 Available Scripts

- `npm run dev`: Starts concurrently both Express API and Vite Dev Server.
- `npm run dev:client`: Runs Vite frontend dev server only.
- `npm run dev:server`: Runs Express backend with live reload (`--watch`).
- `npm run build`: Generates the production build of the frontend.
- `npm start`: Runs the Express backend in production mode (serves frontend build).

---

## 🔐 Authentication & Security

- **JWT Sessions**: Secure Bearer tokens with 7-day expiration.
- **Password Hashing**: Salted bcrypt hashing (12 rounds).
- **Rate Limiting**: IP-based rate limiting on sensitive authentication routes.
- **Security Headers**: Helmet integration with cross-origin resource policy support.
- **File Validation**: Strict mimetype validation and file size limits for wardrobe uploads.