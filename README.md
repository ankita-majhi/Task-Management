# TaskFlow – Task Management Application

A full-stack task management web app built with **Next.js** and **MongoDB**.
Users can create an account, log in, and manage their own tasks on a board with three stages: **Pending**, **In Progress** and **Completed**.

## Features

- User signup and login
- Passwords are hashed with bcrypt before being stored
- Each user sees only their own tasks
- Add, edit and delete tasks
- Move tasks between Pending → In Progress → Completed
- Task counts shown on the dashboard
- Protected dashboard (redirects to login if not logged in)
- Responsive, modern UI built with Tailwind CSS

## Tech Stack

| Layer    | Technology                      |
| -------- | ------------------------------- |
| Frontend | Next.js (Pages Router), React   |
| Styling  | Tailwind CSS                    |
| Backend  | Next.js API Routes              |
| Database | MongoDB Atlas (official driver) |
| Security | bcryptjs (password hashing)     |

## Project Structure

```
├── components/
│   ├── StatCard.js        # Count card on the dashboard
│   ├── TaskColumn.js      # One board column
│   └── TaskCard.js        # Single task with edit / move / delete
├── lib/
│   └── mongodb.js         # Shared MongoDB connection
├── pages/
│   ├── api/
│   │   ├── signup.js      # POST   /api/signup
│   │   ├── login.js       # POST   /api/login
│   │   └── tasks/
│   │       ├── index.js   # GET, POST  /api/tasks
│   │       └── [id].js    # PUT, DELETE /api/tasks/:id
│   ├── index.js           # Redirects to login or dashboard
│   ├── signup.js
│   ├── login.js
│   └── dashboard.js
└── styles/globals.css
```

## API Endpoints

| Method | Endpoint                        | Description                    |
| ------ | ------------------------------- | ------------------------------ |
| POST   | `/api/signup`                   | Create a new user              |
| POST   | `/api/login`                    | Log in and get user details    |
| GET    | `/api/tasks?userId=...`         | Get all tasks of a user        |
| POST   | `/api/tasks`                    | Create a task                  |
| PUT    | `/api/tasks/:id`                | Update a task's title / status |
| DELETE | `/api/tasks/:id?userId=...`     | Delete a task                  |

## Database Collections

**users**: `name`, `email`, `password` (hashed), `createdAt`

**tasks**: `userId`, `title`, `status` (`pending` / `progress` / `completed`), `createdAt`

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root (see `.env.example`):

   ```
   MONGODB_URI=your-mongodb-connection-string
   MONGODB_DB=your-database-name
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

> **Note:** If you see `querySrv ECONNREFUSED` on Windows, use the standard
> `mongodb://` connection string from MongoDB Atlas instead of the `mongodb+srv://` one.

## Known Limitations

This is a learning project, so login is kept simple. The logged-in user is stored in the browser's `localStorage` and the user id is sent with each request. A production app would use secure sessions or JWT tokens so the server can verify who is making each request.
