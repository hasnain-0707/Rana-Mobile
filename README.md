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

## Deployment

Deploy the frontend and backend separately. Vercel hosts the frontend; deploy the Express backend to a Node.js web-service host with persistent storage for `backend/uploads`. Vercel serverless storage is temporary and is not suitable for these uploaded images.

1. Before pushing to GitHub, remove any previously committed secrets from Git tracking and rotate credentials that were committed. Keep real values only in `backend/.env` or your host's environment settings.
2. Deploy the backend and configure `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `FRONTEND_URL`. Set the optional `SMTP_*` variables to enable OTP email. `FRONTEND_URL` must be the deployed Vercel origin.
3. In Vercel, import the GitHub repository and set the project Root Directory to `frontend`. Set `VITE_API_URL` to the backend URL ending in `/api`, then deploy.
4. In the GitHub repository, ensure `backend/.env`, `node_modules`, and build output are not tracked. If `backend/.env` was committed before, removing it in a new commit does not erase it from Git history; rotate its credentials and clean repository history before making the repository public.
