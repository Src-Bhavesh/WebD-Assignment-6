# Relay Helpdesk

Relay is a small customer support ticket app. Customers can open a request, follow its progress, and reply to the support team. Admins can route tickets to departments, update their status, and see a few useful counts.

This project uses React, Vite, React Router, Express, MongoDB, Mongoose, JWT, and bcryptjs. The folders and components are kept separate so each part is easier to find and change.

## Features

- Customer registration and login, plus a separate admin role
- Create, view, edit, and delete open tickets
- Readable ticket numbers such as `TKT-1024`
- Search and filter the admin ticket list by status, priority, or title
- Assign a ticket to a department and move it through Open → In Progress → Resolved → Closed
- A comment thread for customers and support staff
- Customers can reopen a resolved ticket once; closed tickets are read-only
- Dashboard with open and resolved totals, priority and category counts, and average resolution time
- Loading, empty, and error messages on the main list and form pages

## Folder layout

```text
client/
  src/
    api/                 Fetch helper
    components/          Navbar, protected routes, ticket rows and status labels
    pages/               Home, login, ticket, admin and dashboard pages
    App.jsx               Routes and logged-in user state
server/
  config/                MongoDB connection
  controllers/           Request handling and ticket rules
  middleware/            Login checks and error handling
  models/                User, department and ticket schemas
  routes/                API endpoints
```

## Run it locally

You need Node.js 18.11 or newer, npm, and a MongoDB connection string (local MongoDB or Atlas).

1. In `server`, install packages and copy `.env.example` to `.env`.
2. Put your MongoDB connection string in `MONGO_URI`. Change `JWT_SECRET` and the admin password too.
3. Run `npm run seed` once to add the first admin, a demo customer, four departments, and ten sample tickets.
4. Start the API with `npm run dev`. It runs at `http://localhost:5050` by default. The health page is `/api/health`.
5. In `client`, install packages and copy `.env.example` to `.env`. For local work it points to `http://localhost:5050/api`. Set `VITE_API_URL` to your deployed API address ending in `/api` when needed.
6. Start the site with `npm run dev`. Vite prints the local address, usually `http://localhost:5173`.

Example terminal commands:

```sh
cd server
npm install
cp .env.example .env
npm run seed
npm run dev
```

In a second terminal:

```sh
cd client
npm install
cp .env.example .env
npm run dev
```

### Demo logins

The seed script makes a customer account with `alex@example.com` and password `Customer123!`. The admin email comes from `ADMIN_EMAIL` and the password comes from `ADMIN_PASSWORD` in `server/.env`. Change these before deploying. Re-running the seed script updates those two accounts and only creates sample tickets when the ticket collection is empty.

## Environment variables

| Folder | Name | What it is for |
| --- | --- | --- |
| server | `PORT` | API port; hosting services may set this automatically |
| server | `MONGO_URI` | MongoDB connection string |
| server | `JWT_SECRET` | Secret used to sign login tokens |
| server | `CLIENT_URL` | Frontend origin allowed by CORS; comma-separated origins are supported |
| server | `ADMIN_NAME` | Name for the seeded admin |
| server | `ADMIN_EMAIL` | Email for the seeded admin |
| server | `ADMIN_PASSWORD` | Password for the seeded admin |
| client | `VITE_API_URL` | API base URL ending with `/api` |

Never commit `.env` files. The example files contain placeholders only.

## API endpoints

All API routes return JSON. Protected routes take `Authorization: Bearer <token>`.

| Method | URL | Who can use it | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Anyone | Create a customer account |
| POST | `/api/auth/login` | Anyone | Log in |
| GET | `/api/auth/me` | Logged in | Read the current account |
| GET, POST | `/api/tickets` | Admin for GET; customer for POST | List all tickets with filters; create a ticket |
| GET | `/api/tickets/my` | Customer | List own tickets |
| GET, PUT, DELETE | `/api/tickets/:id` | Owner or admin for GET; owner for changes | Read, edit, or remove an open ticket |
| POST | `/api/tickets/:id/comments` | Owner or admin | Add a reply |
| PATCH | `/api/tickets/:id/status` | Admin | Move a ticket through its status steps |
| PATCH | `/api/tickets/:id/reopen` | Ticket owner | Reopen one resolved ticket once |
| PATCH | `/api/tickets/:id/assign` | Admin | Assign a department |
| GET | `/api/departments` | Logged in | List departments |
| POST, PUT, DELETE | `/api/departments/:id` | Admin | Manage departments |
| GET | `/api/dashboard` | Admin | Read dashboard numbers |

Admin ticket filters are query parameters: `status`, `priority`, `category`, and `search`.

## Deployment notes

- Deploy `server` as a Node web service and set its environment variables in the hosting dashboard.
- Deploy `client` as a Vite site. Set `VITE_API_URL` to the deployed API URL ending in `/api`. If it is not set, production builds use the Render API URL below.
- `client/vercel.json` rewrites app routes to `index.html` so refreshing a ticket URL works on Vercel.
- The API allows the local frontend and `https://web-d-assignment-6.vercel.app`. Add any other deployed frontend origin to `CLIENT_URL` on the API service.
- Run the seed command once against the production database if you want to use the sample records.

API service (Render): https://webd-assignment-6.onrender.com

Frontend site: https://web-d-assignment-6.vercel.app

Screenshots: add screenshots of the customer ticket list and admin dashboard here after deployment.

## Things to try

- Register a customer and open a ticket.
- Log in as the admin, assign the ticket to a department, reply, and update its status one step at a time.
- Log in as the customer and reply. After it is resolved, use the one-time reopen option.
- Check that an open ticket can be edited or deleted, and that a closed ticket cannot be changed.
