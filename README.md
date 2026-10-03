# Rana Mobile Shop

Full-stack mobile catalog with a React frontend, Express API, MongoDB, JWT admin authentication, and Multer image uploads.

## Setup

1. Install Node.js and MongoDB.
2. In `backend`, copy `.env.example` to `.env` and set `JWT_SECRET`.
3. Run `npm install` in `backend` and `frontend`.
4. Start the API with `npm run dev` from `backend`.
5. Start the frontend with `npm run dev` from `frontend`.

The default admin credentials are controlled by `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the backend environment.

For admin OTP login, add a Gmail App Password to `backend/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASS=your-gmail-app-password
```

Use a Google App Password, not your normal Gmail password. Then restart the backend with `npm run dev`.
