# Make Me Ready 👔👗✨

> **Personalized AI Styling & Digital Wardrobe Platform**

Make Me Ready is a comprehensive full-stack fashion curation and wardrobe intelligence application built with **React 18 + Vite**, **Express.js**, and **MongoDB**. It pairs digital wardrobe management with AI styling intelligence (powered by Google Gemini), occasion-based outfit generation, curated luxury shopping, and a seamless checkout experience.

---

## 🌟 Key Features

| Feature | Description |
|---|---|
| 🤖 **AI Fashion Stylist** | Intelligent styling consultant powered by Google Gemini API providing instant outfit suggestions, color palettes, aesthetics, and grooming advice. |
| ✨ **AI Outfit Generator** | Dynamic 4-step outfit generator tailoring curated combinations to occasions, user gender, aesthetic preferences, and items in the user's wardrobe. |
| 👗 **Digital Wardrobe** | Visual wardrobe inventory supporting categorisation (Tops, Pants, Dresses, Footwear, Jewelry, Accessories), custom item upload via Multer & GridFS, and persistent sync. |
| 🛍️ **Luxury Shopping Catalog** | Multi-category designer apparel catalog with gender filtering, instant "Add to Wardrobe", and "Add to Cart" functionality. |
| 💳 **Checkout & Payment** | Full checkout flow supporting UPI (GPay, PhonePe, Paytm), Cards, Net Banking, and Cash on Delivery with delivery address management. |
| 🎯 **Occasion Collections** | 20+ occasions across Personal, Professional, Social, Travel, Festive, and Traditional themes. |
| 💡 **Curated Recommendations** | 12 high-fashion editorial looks per gender with quick Save to Looks and detailed breakdowns. |
| 💖 **Saved Looks** | Personal fashion lookbook with instant filtering, unsaving, and local-first fallback persistence. |
| 👤 **User Profile & Styling DNA** | Profile completion tracking, body measurements, brand and aesthetic preferences, multi-address book, and secure password updates. |
| ⚡ **One-Click Quick Login** | Instant demo login option with pre-configured profile credentials (`sahil@makemeready.in`) for instant testing. |

---

## 📁 Repository Structure

```
Make-Me-Ready/
├── api/
│   └── index.js                   # Vercel Serverless Function entrypoint
├── backend/                       # Express.js REST API
│   ├── .env                       # Backend environment configuration (git-ignored)
│   ├── .env.example               # Backend template with instructions
│   ├── app.js                     # Express application definition & route assembly
│   ├── index.js                   # Standalone HTTP server for local development
│   ├── config/
│   │   ├── db.js                  # Mongoose connection (serverless cached) & GridFS bucket setup
│   │   └── env.js                 # Environment variables loader
│   ├── controllers/
│   │   ├── assistantController.js # AI Stylist chat endpoint (gemini-3.5-flash-lite)
│   │   ├── authController.js      # User registration, authentication & quick login
│   │   ├── catalogController.js   # Occasions, looks, products & configuration
│   │   ├── userController.js      # User state, profile, cart, favorites & looks
│   │   └── wardrobeController.js  # Wardrobe item creation, streaming & deletion
│   ├── middleware/
│   │   ├── auth.js                # JWT Bearer token authentication guard
│   │   ├── errorHandler.js        # Centralized HTTP error handler
│   │   └── upload.js              # Multer memory storage configuration
│   ├── models/
│   │   ├── User.js                # User accounts & profile schema
│   │   ├── WardrobeItem.js        # User digital wardrobe schema
│   │   ├── Product.js             # E-commerce catalog item schema
│   │   ├── Look.js                # Curated outfit looks schema
│   │   ├── Occasion.js            # Occasions schema
│   │   ├── Config.js              # App configuration schema
│   │   └── CatalogItem.js         # Polymorphic catalog compatibility schema
│   ├── routes/
│   │   ├── assistantRoutes.js     # /api/assistant routes
│   │   ├── authRoutes.js          # /api/auth routes
│   │   ├── catalogRoutes.js       # /api/catalog routes
│   │   ├── userRoutes.js          # /api/state, /api/profile, /api/cart routes
│   │   ├── wardrobeRoutes.js      # /api/wardrobe routes
│   │   └── index.js               # Route mounting
│   └── services/
│       ├── imageService.js        # GridFS stream & static fallback image handler
│       └── seedService.js         # Automatic database catalog seeding
│
├── frontend/                      # React 18 + Vite Single Page Application
│   ├── .env                       # Frontend environment configuration (git-ignored)
│   ├── .env.example               # Frontend environment template
│   ├── index.html                 # HTML shell
│   ├── vite.config.js             # Vite configuration with /api & /img proxy
│   ├── tailwind.config.js         # Design tokens & color system
│   ├── public/
│   │   ├── wardrobe/              # High-resolution wardrobe piece assets
│   │   ├── Recommendations/       # Curated editorial look assets
│   │   ├── Occasions/             # Occasion artwork assets
│   │   └── BackGround Images/     # Background images
│   └── src/
│       ├── App.jsx                # Application routes & authentication guards
│       ├── main.jsx               # React DOM entrypoint
│       ├── store.jsx              # Re-export of StoreContext hook
│       ├── index.css              # Custom styling & utilities
│       ├── api/
│       │   └── client.js          # API client wrapper with JWT token handling
│       ├── context/
│       │   └── StoreContext.jsx   # Global application state (auth, cart, wardrobe)
│       ├── data/
│       │   ├── constants.js       # Navigation, image paths, brands & colors
│       │   └── data.js            # Curated catalog dataset & helper functions
│       ├── pages/
│       │   ├── Auth.jsx           # Login, registration & quick login
│       │   ├── Home.jsx           # Dashboard & quick actions
│       │   ├── Wardrobe.jsx       # Digital wardrobe gallery & item uploader
│       │   ├── CreateOutfit.jsx   # 4-step interactive outfit creator
│       │   ├── Occasions.jsx      # Occasion browser
│       │   ├── FashionAssistant.jsx # AI Stylist chat powered by Gemini
│       │   ├── Recommendations.jsx# Curated fashion looks & save system
│       │   ├── SavedLooks.jsx     # Saved looks collection
│       │   ├── Shopping.jsx       # Shopping catalog & cart
│       │   ├── Payment.jsx        # Order checkout, address & payment
│       │   └── Profile.jsx        # Style profile, measurements & security
│       └── ui.jsx                 # UI component exports (Layout, Hero, Modal, etc.)
│
├── vercel.json                    # Vercel deployment & serverless routing configuration
├── package.json                   # Root monorepo scripts & dependencies
└── README.md
```

---

## ⚙️ Environment Configuration

### Backend (`backend/.env`)

Create `backend/.env` with the following variables:

```env
# MongoDB Connection String (Local or MongoDB Atlas)
MONGODB_URI=mongodb://127.0.0.1:27017/make_me_ready

# JWT Signing Secret (Minimum 32 characters recommended)
JWT_SECRET=super_secret_make_me_ready_jwt_token_key_development_2026_xyz

# Server Port
PORT=3001

# Allowed Client Origin (for CORS)
CLIENT_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)

Create `frontend/.env` with the following variables:

```env
# Backend API Base URL (Local Development)
VITE_API_URL=http://localhost:3001

# Google Gemini API Key (Get free key from https://aistudio.google.com/)
VITE_GEMINI_KEY=your_gemini_api_key_here
```

> **Note:** `.env` files are excluded from Git by `.gitignore` to protect sensitive credentials. Template files (`.env.example` and `frontend/.env.example`) are provided for reference.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** running locally on port 27017, or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI

### 2. Installation
Install all dependencies from the root directory:
```bash
npm install
```

### 3. Run in Development Mode
Start both frontend and backend concurrently:
```bash
npm run dev
```

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **Health Check**: [http://localhost:3001/api/health](http://localhost:3001/api/health)

### 4. Demo Credentials
You can log in instantly using the **Quick Login** button on the sign-in page, or enter:
- **Email**: `alex@makemeready.in`
- **Password**: `Alex@123`

---

## 🚀 Deploying to Vercel (Frontend & Backend)

Make Me Ready is configured for **zero-friction single-project fullstack deployment on Vercel**. With [`vercel.json`](file:///vercel.json) and [`api/index.js`](file:///api/index.js), the frontend is built into static edge assets and the Express backend runs automatically as high-performance Serverless Functions under the same domain.

### Step 1: Push your latest code to GitHub
Make sure all your changes are committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "feat: configure fullstack vercel deployment"
git push origin main
```

### Step 2: Import Project on Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** > **Project**.
3. Import your **`sahil-khot/Make-Me-Ready`** repository.

### Step 3: Configure Build & Project Settings
Vercel detects the configuration from [`vercel.json`](file:///vercel.json) automatically:
- **Framework Preset**: Vite / Other
- **Root Directory**: `./` (Leave as default project root)
- **Build Command**: `npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install`

### Step 4: Add Environment Variables in Vercel
In the Vercel project deployment screen, open **Environment Variables** and add the following keys:

| Variable Name | Required | Description | Example / Note |
|---|---|---|---|
| `MONGODB_URI` | **Yes** | MongoDB Atlas connection string | `mongodb+srv://<username>:<password>@cluster0.mongodb.net/make_me_ready?retryWrites=true&w=majority` |
| `JWT_SECRET` | **Yes** | Auth token signing secret | Minimum 32 random characters |
| `GEMINI_API_KEY` | **Yes** | Google Gemini API key (AI Stylist backend) | Free from [Google AI Studio](https://aistudio.google.com/) |
| `GEMINI_MODEL` | Optional | Gemini model identifier | `gemini-3.5-flash-lite` (default) |
| `VITE_GEMINI_KEY` | Optional | Client Gemini fallback key | Same Gemini API key |
| `CLIENT_ORIGIN` | Optional | Allowed CORS origins | `*` (or your production domain) |

#### 📋 Quick Copy-Paste for Vercel
You can paste these directly into Vercel's Environment Variables interface:

```env
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@<cluster-host>/make_me_ready?retryWrites=true&w=majority
JWT_SECRET=super_secret_make_me_ready_jwt_token_key_production_2026_xyz
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash-lite
VITE_GEMINI_KEY=your_gemini_api_key_here
CLIENT_ORIGIN=*
```

> [!IMPORTANT]
> **MongoDB Atlas Network Access:**
> Because Vercel serverless functions run on dynamic cloud IPs, you **must** allow access from anywhere in MongoDB Atlas:
> 1. Go to **MongoDB Atlas** > **Network Access**.
> 2. Click **Add IP Address**.
> 3. Select **Allow Access from Anywhere** (`0.0.0.0/0`) and click **Confirm**.

### Step 5: Click Deploy
Click **Deploy**. Vercel will install dependencies, compile the Vite React frontend into `frontend/dist`, package `api/index.js` as serverless functions, and assign your production URL (e.g., `https://make-me-ready.vercel.app`).

Both the frontend and all `/api/*` endpoints (authentication, catalog, wardrobe, cart, AI assistant) will run together seamlessly on your Vercel domain!

---

## 🛠️ Available NPM Scripts

| Command | Action |
|---|---|
| `npm run dev` | Runs backend (`node --watch`) and frontend (`vite`) concurrently |
| `npm run dev:server` | Starts the Express server with live reload (`--watch`) |
| `npm run dev:client` | Starts the Vite development server on port 5173 |
| `npm run build` | Builds the production bundle of the frontend into `frontend/dist` |
| `npm start` | Runs the production backend (serves API and compiled frontend) |
| `npm run preview` | Previews the built frontend with Vite preview server |

---

## 🌐 API Reference

### Authentication
- `POST /api/auth/register` — Create a new account
- `POST /api/auth/login` — Sign in and get JWT token
- `POST /api/auth/quick-login` — Instant sign-in with demo account
- `GET /api/auth/me` — Get authenticated user details

### User & Preferences
- `GET /api/state` — Retrieve user profile, wardrobe, cart, favorites, and saved looks
- `PATCH /api/profile` — Update user profile details and style preferences
- `POST /api/change-password` — Change account password
- `PUT /api/favorites` — Toggle favorite item ID
- `PUT /api/saved-looks` — Toggle saved look ID
- `POST /api/cart` — Add product to cart
- `DELETE /api/cart/:id` — Remove item from cart
- `DELETE /api/cart` — Clear cart

### Wardrobe
- `GET /api/wardrobe` — List all wardrobe items for user
- `POST /api/wardrobe` — Add new wardrobe item (supports file upload or catalog reference)
- `DELETE /api/wardrobe/:id` — Delete wardrobe item

### Catalog
- `GET /api/catalog` — Get curated occasions, wardrobe pieces, looks, and products

### Images & System
- `GET /img/:filename` — Stream image from GridFS or local asset storage
- `GET /api/health` — API and database connectivity status check

---

## 🔒 Security Practices

- **Bcrypt Password Encryption**: Salted passwords hashed with 12 rounds.
- **JWT Authentication**: State verified using signed JWTs with expiration.
- **Rate Limiting**: Built-in rate limiting on authentication routes to mitigate brute force attacks.
- **Helmet Headers**: Cross-origin and HTTP header hardening.
- **CORS Protection**: Restricted to allowed client origins.
- **Secret Protection**: `.gitignore` configured to prevent accidental leakage of environment credentials.

---

## 👨‍💻 Author

Created by **Sahil Khot**  
GitHub: [@sahil-khot](https://github.com/sahil-khot)  
Project Repository: [sahil-khot/Make-Me-Ready](https://github.com/sahil-khot/Make-Me-Ready)
