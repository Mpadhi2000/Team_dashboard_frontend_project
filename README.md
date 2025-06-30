# Team Dashboard Frontend (React + JWT)

## 📌 Project Overview
This is the frontend React application for the **Team Task Manager** project. It acts as a headless dashboard to manage teams and tasks, communicating with a WordPress backend that uses JWT (JSON Web Token) for authentication.

The app supports role-based access, giving Admins full control and Team Members limited view access.

---

## ⚠️ Important: Installing Dependencies

When you first set up this project, **please install node modules using this command** to avoid peer dependency conflicts (especially with React 19):

```bash
npm install --legacy-peer-deps
```

This ensures smooth installation and avoids errors related to package version conflicts.

---

## 🎯 Purpose

- Build a responsive task management frontend using React 19 (Vite)
- Allow login via WordPress JWT authentication
- Support protected routes based on user roles (Admin, Team Member)
- Enable Admins to manage teams, tasks, and assignments
- Allow Team Members to view their assigned tasks only

---

## 🛠 Tech Stack

- **Frontend**: React 19 (Vite)
- **Authentication**: JWT (token stored in localStorage)
- **Routing**: React Router DOM v7
- **UI Components**: Plain React (optional Bootstrap integration)
- **Backend**: WordPress exposing custom REST API + JWT plugin

---

## 👥 Role-Based Access

| Role          | Access                                         |
|---------------|------------------------------------------------|
| Administrator | Full dashboard: manage teams, tasks, assignments |
| Team Member   | Limited to viewing only assigned tasks         |

---

## 🧱 Folder Structure

```
src/
├── api/             # Axios instance + auth functions
├── components/      # Sidebar, TeamList, TaskList, Forms
├── pages/           # Login, AdminDashboard, TeamDashboard
├── router/          # AppRoutes.jsx (handles route setup)
├── App.jsx          # Main app (user state + routing)
├── main.jsx         # Entry point with <BrowserRouter>
```

---

## 🔐 Authentication Flow

1. User logs in with WordPress credentials
2. `/jwt-auth/v1/token` returns JWT token
3. Token is stored in localStorage
4. `/wp/v2/users/me` fetches current user info including role
5. Routes render conditionally based on user role

---

## 🚀 Tasks & Access Control

| Route/Feature | Access           | Description                |
|---------------|------------------|----------------------------|
| `/login`      | Public           | Login screen               |
| `/admin`      | Admin only       | Admin dashboard            |
| `/teams`      | Admin only       | Manage teams               |
| `/tasks`      | Admin + Team     | View tasks                 |
| `/addteam`    | Admin only       | Add new team               |
| `/addtask`    | Admin only       | Add new task               |
| `/assigntask` | Admin only       | Assign tasks to teams      |
| `/team`       | Team Member only | Team dashboard             |

---

## ✅ How to Run

1. Clone the repository
2. Run:

```bash
npm install --legacy-peer-deps
```

3. Start the development server:

```bash
npm run dev
```

✅ Make sure your WordPress backend is running with JWT plugin enabled, CORS properly configured, and the secret key set in `wp-config.php`.

---

## 🧠 Why This Project Was Created

- To demonstrate working with WordPress as a headless CMS
- To implement secure login via JWT
- To build modular and scalable React apps
- To apply role-based access control in frontend routing
- To collaborate professionally with backend APIs

---

## 🤝 Who Can Use This?

- Frontend developers learning WordPress + React integration
- HR managers testing the UI
- Interviewers evaluating frontend skills
- Full-stack collaborators connecting backend and frontend

---

## 📫 Contact

For help or walkthrough, contact:  
📧 **mayankpadhi91@gmail.com**

---

_This project is part of the full Team Task Manager assignment using WordPress (PHP) and React (JS)._
