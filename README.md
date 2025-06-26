# 🎓 Student Management System

Welcome to the **Student Management System**! This is a web application designed to help schools and educational institutions manage students, classes, and classrooms with a fun, minimalist retro-inspired interface.

![image](https://github.com/user-attachments/assets/b83a0422-5060-4411-b3b3-2b212f0f5b9d)

## ✨ Features

This system is built to be both functional and fun to use. Here's what you can do:

- **🔐 Secure Authentication**: Admins and teachers can log in securely to access their dashboards.
- **📊 Interactive Dashboard**: Get a quick overview of key stats, including the number of admins, students, and classes.
- **👨‍🎓 Student Management**:
  - Add, view, edit, and archive student profiles.
  - Upload student photos and manage personal details.
  - Track student enrollments in different classes.
- **📚 Class Management**:
  - Create, view, edit, and archive classes.
  - Assign teachers and schedules to classes.
- **🏫 Classroom Management**:
  - Add, view, edit, and delete classrooms.
  - See details on classroom capacity and assigned students/classes.
- **🕹️ Retro UI**: A unique, minimalist retro theme with a pixel-perfect design and the classic "Press Start 2P" font.

## 🛠️ Tech Stack

This project is built with modern web technologies, combining a fast frontend with a reliable backend:

- **Frontend**:
  - [React](https://react.dev/) (with Vite)
  - [React Router](https://reactrouter.com/) for navigation
- **Backend**:
  - [Firebase](https://firebase.google.com/)
    - **Firestore**: For the database
    - **Storage**: For file uploads (like student photos)
- **Styling**:
  - Custom CSS with a retro, minimalist aesthetic
  - [Google Fonts](https://fonts.google.com/specimen/Press+Start+2P) for the "Press Start 2P" font

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/your-username/student-management-system.git
   ```
2. **Navigate to the project directory**
   ```sh
   cd student-management-system
   ```
3. **Install NPM packages**
   ```sh
   npm install
   ```
4. **Set up your Firebase credentials**
   - Create a `.env` file in the root of your project.
   - Add your Firebase project's configuration keys to the `.env` file:
     ```env
     VITE_API_KEY=your_api_key
     VITE_AUTH_DOMAIN=your_auth_domain
     VITE_PROJECT_ID=your_project_id
     VITE_STORAGE_BUCKET=your_storage_bucket
     VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_APP_ID=your_app_id
     VITE_MEASUREMENT_ID=your_measurement_id
     ```

### Running the App

Once you've installed the dependencies and set up your environment variables, you can run the app with:

```sh
npm run dev
```

This will start the development server, and you can view the app in your browser at `http://localhost:5173` (or another port if 5173 is in use).

---

We hope you enjoy using the Student Management System. If you have any questions or ideas, feel free to reach out! 