# Team Dashboard Frontend (React + JWT)

## 📌 Project Overview
This is the **frontend React application** for the "Team Task Manager" project, built as a headless dashboard for managing teams and tasks. It interacts with a WordPress backend using **JWT (JSON Web Token) authentication**.

The app provides different views and access controls for **Admins** and **Team Members**, ensuring a role-based experience across the dashboard.

---

## 🎯 Purpose
The purpose of this project is to:
- Build a responsive task management frontend.
- Allow login via WordPress JWT authentication.
- Support protected routes based on user roles.
- Enable Admins to manage teams and tasks.
- Allow Team Members to only view assigned tasks.

---

## 🛠 Tech Stack
- **Frontend**: React 19 (Vite)
- **Authentication**: JWT (token stored in localStorage)
- **Routing**: React Router DOM v7
- **UI Components**: Plain React (optional Bootstrap integration)
- **Backend (WordPress)**: Exposes custom REST API + JWT

---

## 👥 Role-Based Access

| Role           | Access                                            |
|----------------|---------------------------------------------------|
| Administrator  | Full dashboard: manage teams, tasks, assignments |
| Team Member    | Limited to viewing tasks only                    |

---

## 🧱 Folder Structure

```
src/
├── api/              # Axios instance + auth functions
├── components/       # Sidebar, TeamList, TaskList, Forms
├── pages/            # Login, AdminDashboard, TeamDashboard
├── router/           # AppRoutes.jsx (handles route setup)
├── App.jsx           # Main app (user state + routing)
├── main.jsx          # Entry point with <BrowserRouter>
```

---

## 🔐 Authentication Flow

1. User logs in with WordPress credentials  
2. `/jwt-auth/v1/token` returns JWT token  
3. Token stored in `localStorage`  
4. `GET /wp/v2/users/me` fetches current user info + role  
5. Routes render based on role  

---

## 🚀 Available Routes

| Tasks           | Access           | Description                  |
|----------------|------------------|------------------------------|
| `login`       | Public            | Login screen                 |
| `admin`       | Admin only        | Admin dashboard              |
| `teams`       | Admin only        | Manage teams                 |
| `tasks`       | Admin + Team      | View tasks                   |
| `Add team`     | Admin only        | Add new team                 |
| `Add task`     | Admin only        | Add new task                 |
| `Assign task`  | Admin only        | Assign tasks to teams        |
| `Team`        | Team Member only  | Team dashboard               |

---

## ✅ How to Run

1. Clone the repository  
2. Run `npm install`  
3. Start dev server:

```bash
npm run dev
```

✅ Make sure your WordPress backend is running with JWT plugin, CORS enabled, and correct secret in `wp-config.php`.

---

## 🧠 Why This Project Was Created

This app was created to demonstrate how a frontend developer can:
- Work with WordPress as a headless CMS
- Implement secure login via JWT
- Build modular and scalable React apps
- Apply role-based access control in frontend routing
- Collaborate with backend APIs professionally

---

## 🤝 Who Can Use This?

This documentation is written to help:
- Frontend developers
- HR managers testing the UI
- Interviewers evaluating skills
- Full-stack collaborators connecting backend + frontend

---

## 📫 Contact

For help or walkthrough, contact:  
📧 **mayankpadhi@gmail.com**

---

_This project is a part of the full Team Task Manager assignment using WordPress (PHP) and React (JS)._
