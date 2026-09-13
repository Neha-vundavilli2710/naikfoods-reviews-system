# Naik Foods — Product Reviews & Ratings Prototype

A MERN-stack prototype built for the Bits and Volts **Full Stack MERN Intern** task, based on
hands-on analysis of the live site [naikfoods.co.in/in](https://www.naikfoods.co.in/in).

### Live Demo

- **Frontend:** https://naikfoods-reviews-system.vercel.app
- **Backend API:** https://naikfoods-reviews-system.onrender.com
- **GitHub:** https://github.com/Neha-vundavilli2710/naikfoods-reviews-system

## 1. Project Overview

Naik Foods' product pages display a review count (e.g. "(56 Reviews)") but no actual review
content, no rating breakdown, and no way to submit one. This prototype implements a real,
working version of that feature end to end, on a MongoDB + Express API with a React frontend.

## 2. Problem Identified

- Product pages advertise a review count with zero visible reviews behind it — a trust gap,
  not just a missing feature, since a claimed-but-empty count reads as fabricated.
- No aggregate rating (average score, star breakdown) is shown anywhere.
- No path exists for a customer to leave feedback on a product they bought.

## 3. Proposed Solution

A dedicated Review sub-system, tied to each Product, that:
- Lets any visitor submit a name + star rating + comment for a product.
- Immediately recalculates and persists that product's average rating and 5→1 star
  breakdown after each new review — no manual refresh or admin step.
- Lets shoppers sort existing reviews (newest / highest / lowest rated) and page through
  them without loading the entire review history at once.

## 4. Features

- Product grid seeded with real Naik Foods products, categories, prices, and weights.
- Product detail page with an aggregate rating summary (average score + star breakdown bars).
- Paginated, sortable review list (5 per page by default).
- Review submission form with client- and server-side validation, a live character counter,
  a loading state while submitting, and a success confirmation on completion.
- Explicit empty states ("no reviews yet"), a 404 state for unknown products, and an
  API-unreachable error state — the UI never silently shows nothing.

## 5. Architecture

```
        User
          |
          v
  React + Vite UI  (product grid, product detail, review form/list)
          |
      REST API (JSON over HTTP)
          |
          v
  Node.js + Express  (routes: products, reviews; validation; rating recalculation)
          |
      Mongoose ODM
          |
          v
       MongoDB  (Product, Review collections)
```

The frontend calls the REST API for products and reviews. Review submissions are validated
by the backend, stored in MongoDB, and immediately used to recalculate the parent product's
`averageRating` and `ratingBreakdown` fields, which the frontend re-fetches and displays.

## 6. Tech stack

- **Frontend:** React 18 + Vite, React Router, hand-written CSS (no framework).
- **Backend:** Node.js + Express, Mongoose.
- **Database:** MongoDB (local or MongoDB Atlas).

## 7. Folder structure

```
naikfoods-reviews/
├── backend/
│   ├── models/          # Product.js, Review.js (Mongoose schemas)
│   ├── routes/          # products.js, reviews.js (Express routers)
│   ├── server.js        # App entry point (CORS, DB connection)
│   ├── seed.js          # Seeds real Naik Foods sample products + reviews
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/  # StarRating, RatingSummary, ReviewForm, ReviewList, ProductCard
    │   ├── pages/        # ProductListPage, ProductDetailPage
    │   ├── api.js        # fetch() wrappers for the backend API
    │   └── App.jsx
    └── .env.example
```

## 8. Setup instructions

### Database
- **Local:** install MongoDB Community Edition, use `mongodb://127.0.0.1:27017/naikfoods_reviews`.
- **Atlas (recommended for deploying):** create a free cluster at
  [mongodb.com/atlas](https://www.mongodb.com/atlas), create a database user, copy the
  connection string.

### Backend
```bash
cd backend
npm install
cp .env.example .env      # edit MONGO_URI (and FRONTEND_URL once you deploy the frontend)
npm run seed                # populates sample products + reviews
npm start                   # runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL should point at your backend, e.g. http://localhost:5000/api
npm run dev                 # runs on http://localhost:5173
```

## 9. Environment variables

**backend/.env**
| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `FRONTEND_URL` | Deployed frontend origin, used to restrict CORS in production. Falls back to `*` (open) if unset — set this before going live. |

**frontend/.env**
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` |

## 10. API endpoints

| Method | Endpoint                          | Description                          |
|--------|------------------------------------|---------------------------------------|
| GET    | `/api/products`                    | List all products                    |
| GET    | `/api/products/:slug`              | Get one product                      |
| GET    | `/api/products/:slug/reviews`      | List reviews — `?sort=newest\|highest\|lowest&page=1&limit=10` |
| POST   | `/api/products/:slug/reviews`      | Submit a review `{ name, rating, comment }` |

The reviews GET endpoint returns `{ reviews: [...], pagination: { page, limit, total, totalPages } }`.

## 11. Database schema

**Product**
```
name, slug, category, price, weight, image, description,
averageRating, reviewCount, ratingBreakdown: { 1..5: count }
```

**Review**
```
product (ref -> Product), name, rating (1-5), comment,
verifiedPurchase (reserved, see Known Limitations), timestamps
```

`averageRating` / `reviewCount` / `ratingBreakdown` are denormalized onto the Product
document and recalculated on every new review, rather than aggregated on every page load —
this keeps the product list fast even with thousands of reviews.

## 12. Screenshots

Not included in this submission — the prototype was built and verified in a sandboxed
environment without a browser/display available to capture screenshots. Running
`npm run dev` locally (see Setup above) reproduces the UI exactly; happy to send screenshots
or a short screen recording separately if useful.

## 13. Deployment

### Backend — Render

The backend API is deployed on Render.

- **Platform:** Render
- **Root directory:** `backend`
- **Build command:** `npm install`
- **Start command:** `npm start`
- **Backend URL:** https://naikfoods-reviews-system.onrender.com

Required environment variables:

- `MONGO_URI`
- `FRONTEND_URL`

### Frontend — Vercel

The React frontend is deployed on Vercel.

- **Platform:** Vercel
- **Root directory:** `frontend`
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **API environment variable:** `VITE_API_URL`

Production API configuration:

```text
VITE_API_URL=https://naikfoods-reviews-system.onrender.com/api

## 14. Known limitations

- `verifiedPurchase` exists as a schema field but is **not** wired to any real order or
  authentication system, and is not shown in the UI — it is a placeholder for future
  integration, not a real "verified" signal today.
- No authentication: any visitor can submit any number of reviews under any name. There is
  no spam, profanity, or duplicate-review protection.
- No review moderation/reporting flow.
- No photo/video attachments on reviews.

## 15. Future enhancements

- Tie reviews to authenticated users and real orders for genuine verified-purchase badges.
- Rate-limit or require sign-in to prevent spam/duplicate reviews.
- Admin moderation queue for reported reviews.
- Photo uploads on reviews.
- "Helpful / not helpful" voting on individual reviews.
- Product + AggregateRating structured data (JSON-LD) for search engine rich snippets.
- Analytics on review submission and read engagement.
