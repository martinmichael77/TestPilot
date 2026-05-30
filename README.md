# TestPilot

TestPilot is a beginner-friendly API Test Collection Runner for manual QA and early-stage API testers.


## Features

- **Try Demo Collection:** Instantly run a sample collection and environment with one click—no Postman knowledge required.
- **Upload & Run Collections:** Upload Postman collection and optional environment JSON files. No raw JSON editing needed—manage variables in a table UI.
- **Execution Progress:** See step-by-step progress (upload, environment, running requests, report generation) for every run.
- **Beginner-Friendly Results:** View pass/fail results with assertion-level details and AI-powered, beginner-focused error explanations and suggestions.
- **Slow API Detection:** Requests taking over 1 second are flagged as "⚠ Slow Endpoint" with response time shown.
- **Downloadable Reports:** Download HTML, PDF, and CSV reports for any run.
- **Execution History:** Track, open, and delete previous runs. History is persistent with MongoDB Atlas.
- **Dashboard Metrics:** See total runs, pass rate, failed APIs, and average response time in a professional dashboard.

## Tech Stack

### Frontend

- React + Vite
- Material UI (MUI)
- Axios
- React Router
- React Dropzone
- MUI DataGrid

### Backend

- Node.js + Express
- MongoDB Atlas free tier for execution history
- Newman
- Multer
- newman-reporter-html
- UUID
- PDFKit
- fs-extra

## Project Structure

- `frontend/`: React application
- `backend/`: Express API and Newman runner
- `backend/src/controllers`: API request handlers
- `backend/src/services`: Newman execution and report/history services
- `backend/src/routes`: API routes
- `backend/src/middleware`: Upload and error middleware
- `backend/src/models`: MongoDB execution model
- `backend/reports`: Generated HTML/PDF/CSV reports

## Backend Endpoints

- `POST /api/upload`
- `POST /api/run-collection`
- `GET /api/execution-history`
- `GET /api/execution/:id`
- `DELETE /api/execution/:id`
- `GET /api/execution/:id/report/:format`

## Run Locally

### 1. Backend

```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

If needed, configure frontend API base URL:

- `VITE_API_BASE_URL=http://localhost:5000/api`

## Free Hosting

Recommended free setup:

- Frontend: Vercel static site
- Backend: Render web service
- Database: MongoDB Atlas free cluster

Steps:

1. Push this repository to GitHub.
2. Create a free MongoDB Atlas M0 cluster and copy the connection string.
3. Create a new Render web service from the `backend/` folder.
4. Use `npm install` as the build command and `npm start` as the start command.
5. Set `FRONTEND_URL`, `MONGODB_URI`, and optionally `MONGODB_DB_NAME` on Render.
6. Create a Vercel project from the `frontend/` folder.
7. Set `VITE_API_BASE_URL` to your Render API URL, ending in `/api`.
8. Redeploy the frontend after setting the environment variable.

Deployment files included:

- [render.yaml](render.yaml)
- [frontend/vercel.json](frontend/vercel.json)
- [frontend/.env.example](frontend/.env.example)
- [backend/.env.example](backend/.env.example)

Free-tier note:

- Execution history is stored in MongoDB Atlas, so it persists across free hosting restarts.

## Notes

- File upload only accepts `.json` files.
- Execution history is stored in MongoDB Atlas when `MONGODB_URI` is configured, with local JSON fallback for development.
- The UI is always in dark mode by default.
- Architecture is modular and ready for future additions.
