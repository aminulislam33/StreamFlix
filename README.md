# StreamFlix

StreamFlix is a small Node.js / Express web application that demonstrates user signup/login with OTP, basic profile management, and a premium access flow using Razorpay for payments. Views are rendered with EJS and MongoDB (Mongoose) is used for persistence.

---

## Tech stack

- Node.js + Express
- EJS templates
- MongoDB + Mongoose
- Razorpay (payments)
- Nodemailer (OTP emails)
- Cloudinary (media uploads - configured but may require setup)

---

## Quick setup

1. Copy repository and install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root and set required environment variables (see below).

3. Start the app:

```bash
npm start
```

The server listens on port `8000` by default.

---

## Required environment variables

Set these in your `.env` file (example names used by the app):

- `MONGO_URL` — MongoDB connection string
- `SECRET` — JWT secret used for OTP/session signing in controllers
- `EMAIL` — SMTP/email address used to send OTP emails
- `PASSWORD` — SMTP/email password or app password
- `BASE_URL` — Base URL for frontend links (optional)
- `CLOUDI_NAME` — Cloudinary cloud name (app references cloudinary)
- `CLOUDI_KEY` — Cloudinary API key
- `CLOUDI_SECRET` — Cloudinary API secret

Notes:
- The repository currently contains a `src/service/razorpay.js` file with test keys hard-coded; replace those with secure env-based values (recommended env names: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`).
- `src/service/auth.js` uses an inline secret `very_secret`. You should replace it to read `process.env.SECRET` for consistency and security.

---

## Project structure (important files)

- `index.js` — app entry point, Express setup, middleware, route mounts
- `package.json` — dependencies & scripts
- `src/routes/` — Express routers
	- `user.js` — signup, login, profile, payment order endpoints
	- `moviesRouter.js` — protected movie view
	- `staticRouter.js` — home page
- `src/controllers/` — request handlers
	- `user.js` — OTP generation, signup flow, login, profile updates
	- `payment.js` — payment order creation and granting access
- `src/service/` — helper services
	- `auth.js` — JWT helpers (create/get token)
	- `razorpay.js` — Razorpay client instance (currently hard-coded keys)
- `src/middleware/` — request-level checks
	- `auth.js` — checks `uid` cookie and populates `req.user`
	- `paymentPass.js` — checks `hasAccess` and renders premium prompt
- `src/models/` — Mongoose models
	- `user.js` — user schema (name, email, password (hashed), hasAccess)
	- `otp.js` — OTP model (expires after 5 minutes)
- `src/utils/sendmail.js` — nodemailer wrapper used to send OTP emails
- `src/views/` — EJS templates used for pages

---

## Routes & pages

User-facing routes (prefix `/user`):

- `POST /user/signup` — Creates OTP and emails it; session stores a JWT with pending user data
- `GET /user/signup` — Signup page (EJS)
- `POST /user/verify-otp` — Submit OTP; on success the user record is created
- `GET /user/login` — Login page
- `POST /user/login` — Login form; sets `uid` cookie with JWT token
- `GET /user/logout` — Clears cookie and redirects to `/`
- `GET /user/profile` — Protected profile page (requires login)
- `POST /user/profile` — Update profile name

Payment-related routes:

- `GET /user/create-order` — Renders payment page (requires login)
- `POST /user/create-order` — Creates a Razorpay order (JSON response)
- `POST /user/update-user-access` — Marks a user as having access (grants premium)

Other routes:

- `GET /` — Home page (protected)
- `GET /movies` — Movie page (protected, requires `hasAccess` to view; otherwise shows `buyPremium`)

Notes:
- All protected routes check the `uid` cookie. The JWT helper returns the email which is used to look up the user.

---

## Authentication & OTP flow (high level)

1. User submits signup form -> `POST /user/signup`.
2. Server generates a 6-digit OTP and stores it in `OTP` collection (expires in 5 minutes).
3. OTP is sent via email using `nodemailer` (`src/utils/sendmail.js`).
4. A JWT with `name`, `email`, `password` is signed and stored in `req.session.token` for temporary state.
5. User posts OTP to `POST /user/verify-otp` -> server verifies OTP and creates a `User` document. The session token is cleared.
6. Login (`POST /user/login`) validates credentials and sets a cookie named `uid` containing a JWT. Protected middleware reads that cookie, decodes the token, and fetches the user.

Security notes:
- Passwords are hashed with `bcrypt` in a `pre('save')` hook.
- The project currently mixes secrets in code (Razorpay keys and `auth.js` secret). Move secrets to `.env` and do not commit them.

---

## Payment flow

- `POST /user/create-order` (body: `{ amount }`) uses `src/service/razorpay.js` to create an order. The controller sends the Razorpay `order` object back to the client.
- After successful client-side capture/verification, the app expects to call `POST /user/update-user-access` to mark a user as `hasAccess: true` (server currently finds one user with `hasAccess: false` and updates them — this is simplistic and should be scoped to the authenticated user).

Important: Replace the hard-coded test `razorpay` keys and implement server-side verification of payment signatures before granting access.

---

## Models

- `User`:
	- `name` (String, required)
	- `email` (String, required, unique)
	- `password` (String, hashed)
	- `hasAccess` (Boolean, default: false)
	- `salt` (String)

- `OTP`:
	- `email`, `otp`, `createdAt` with TTL set to 300 seconds (5 minutes)

---

## Known issues & recommended fixes

- Move all secrets and API keys into `.env` and load them via `process.env`.
- Replace the inline secret in `src/service/auth.js` and change Razorpay initialization to use env vars.
- `src/controllers/user.js` uses `process.env.SECRET` while `src/service/auth.js` uses a hard-coded `very_secret` — unify these to avoid broken token verification.
- `src/controllers/payment.js` updates the first user with `hasAccess: false` — change to update the currently authenticated user only.
- Validate and verify Razorpay payment signatures server-side before calling `updateUserAccess`.

---

## Deployment

- The repo contains a `vercel.json`. When deploying to Vercel or other hosts ensure your environment variables are set in the platform.
- The app listens on port `8000` in `index.js`; cloud platforms may require using `process.env.PORT`.

---

## Contributing / Next steps

- Fix the security issues listed above.
- Add client-side Razorpay integration and server-side verification.
- Add tests for auth, OTP expiry, and payment flow.

If you'd like, I can:

- Replace hard-coded secrets with `process.env` usage throughout the codebase.
- Implement secure Razorpay signature verification and fix `updateUserAccess` to use the authenticated user.

---

License: ISC