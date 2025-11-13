# Prompt Instruction for Cursor IDE

I want to create a full-stack volunteer shift registration application using the following stack:

## 🧱 Tech Stack

- **Frontend**: React (with TypeScript)
- **Backend**: Node.js (with TypeScript and Express.js)
- **Database and Auth**: Supabase
- **ORM**: Supabase client (no Prisma or Sequelize)
- **Styling**: Tailwind CSS for responsive design
- **Deployment targets**: Vercel (frontend), Render or Railway (backend)

---

## 📋 Requirements

The app is for managing **shift registrations** similar to this Google Sheet:
🔗 https://docs.google.com/spreadsheets/d/18gnPgSTvCwb5Sa54f4OGWD0ffRLK5WBQgPrXUWWA6LM/edit#gid=286972494

---

## 🔐 Auth

Use Supabase Auth with email/password authentication.
- Volunteers should be able to register, log in, and view shifts.
- Admins can create/edit/delete shifts and view all registrations.

---

## 🗂️ Supabase Schema

Please define the following tables in Supabase:

### Table: `volunteers`
| Column | Type | Notes                  |
| ------ | ---- | ---------------------- |
| id     | uuid | PK, auto-generated     |
| name   | text | required               |
| email  | text | unique, required       |
| phone  | text | optional               |
| role   | text | "Volunteer" or "Admin" |

### Table: `shifts`
| Column     | Type    | Notes                |
| ---------- | ------- | -------------------- |
| id         | uuid    | PK, auto-generated   |
| date       | date    | required             |
| time       | text    | "Morning", "Evening" |
| location   | text    | required             |
| has_patrol | boolean | default false        |
| notes      | text    | optional             |

### Table: `registrations`
| Column       | Type | Notes                        |
| ------------ | ---- | ---------------------------- |
| id           | uuid | PK, auto-generated           |
| shift_id     | uuid | FK -> shifts.id              |
| volunteer_id | uuid | FK -> volunteers.id          |
| status       | text | "Pending", "Confirmed", etc. |

---

## 🖥️ Frontend Pages

1. `/login` - Sign in / sign up
2. `/dashboard` - Show upcoming shifts and registrations
3. `/shifts/new` - Admin creates a shift
4. `/shifts/:id` - View shift details, register
5. `/profile` - Show user’s registrations

Use:
- Tailwind CSS for layout and responsiveness
- Supabase JS client for API calls and auth
- React Router for navigation

---

## ⚙️ Backend Setup (Express + TS)

Create a Node.js backend with the following API endpoints:

- `POST /api/shifts` – create shift (admin only)
- `GET /api/shifts` – list all shifts
- `GET /api/shifts/:id` – get shift details
- `POST /api/register` – register for a shift
- `GET /api/registrations/me` – get logged-in user’s registrations

Use environment variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Also include:
- CORS setup for frontend
- dotenv config loader
- Simple role check middleware

---

## 🧪 Testing

Add dummy data seeding script for local development, and make sure the UI handles edge cases like:
- No shifts available
- Already registered
- Viewing shifts as admin vs. volunteer

---

## 📦 Bonus

If possible, add:
- Reusable `ShiftCard` component
- Admin panel route guard
- Supabase RLS (Row Level Security) policies to secure data access

---

Generate the necessary code, configs, and UI components automatically. Start with the backend first, then move on to frontend pages.

