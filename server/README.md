# Farm Market Backend

Lightweight Express + MongoDB API for the Tamale farm produce marketplace.

## Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- express-validator + rate limiting + compression

## Folder Structure
```txt
server
  server.js
  src
    app.js
    config
    controllers
    middlewares
    models
    routes
    services
    utils
```

## Setup
1. `cd server`
2. `npm install`
3. Copy `.env.example` to `.env`
4. `npm run dev`

Cloudinary is required for image upload:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Optional seed:
- `npm run seed:prices`

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/me` (supports `multipart/form-data` with `profilePicture`)

### Listings
- `GET /api/listings` (filters: `cropType`, `minPrice`, `maxPrice`, `location`, `page`, `limit`)
- `GET /api/listings/:id`
- `GET /api/listings/me` (farmer)
- `POST /api/listings` (farmer)
  - accepts `multipart/form-data` with `images` files
- `PUT /api/listings/:id` (owner farmer)
- `DELETE /api/listings/:id` (owner farmer)
- `PATCH /api/listings/:id/sold` (owner farmer)

### Prices
- `GET /api/prices`
- `POST /api/prices` (admin only)

## Notes
- Register endpoint allows roles `farmer` and `buyer`.
- `POST /api/prices` requires an admin token (create admin user manually in DB for now).
- Listing responses include farmer `phoneNumber` for call/WhatsApp contact.
- API payloads are compact and paginated for low-bandwidth clients.
