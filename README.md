# SchoolHub - Modern School Management Dashboard

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

SchoolHub is a modern, responsive, and feature-rich dashboard designed to streamline school administration. It provides a clean, intuitive interface for managing students, teachers, attendance, finance, and more, helping administrators and educators make data-driven decisions.

## 📸 Screenshot



## ✨ Features

-   **📊 Interactive Dashboard:** A comprehensive overview of key school metrics, including student/teacher counts, attendance statistics, financial summaries, and recent activities.
-   **👨‍🎓 Student Management:** Full CRUD (Create, Read, Update, Delete) functionality for student records with advanced filtering, sorting, and data import/export.
-   **👩‍🏫 Teacher Management:** A complete system for managing teacher profiles with full CRUD operations and data export.
-   **✅ Attendance Tracking:** An interactive grid for marking daily attendance with dynamic filters by month and class.
-   **💰 Finance Module:** Track fee collections, view payment statuses, and visualize financial data with interactive charts.
-   **📢 Announcements:** A dedicated section for posting, viewing, and managing school-wide announcements.
-   **📅 School Calendar:** A full-page calendar to manage and view school events, holidays, and exams.
-   **📚 Library Management:** A system to manage library books, track their status (Available/Issued), and handle check-ins/check-outs.
-   **💬 Messaging Interface:** A clean, user-friendly chat interface for internal communications.
-   **🤖 AI Lesson Plan Helper:** An integrated tool to assist educators in creating structured lesson plans using AI.
-   **👤 Account & Profile Management:** Manage user accounts and allow individuals to update their own profile information.
-   **⚙️ Settings Page:** A centralized location for application and user preferences.
-   **📱 Fully Responsive:** A mobile-first design ensures a seamless experience on all devices, from desktops to smartphones.

## 🛠️ Tech Stack

-   **Frontend:** [React](https://reactjs.org/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Database:** [Firebase Firestore](https://firebase.google.com/docs/firestore) for data persistence.
-   **AI Integration:** [Google Gemini API](https://ai.google.dev/) for lesson planning and data extraction.
-   **Image Storage:** [Cloudinary](https://cloudinary.com/) for profile picture uploads.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   Firebase, Cloudinary, and Google Gemini API keys.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/schoolhub.git
    cd schoolhub
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add the necessary API keys and Firebase configuration.
    
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## 📂 Project Structure

The project follows a standard React application structure to keep the codebase organized and maintainable.

```
/src
|-- /components     # Reusable React components (e.g., Modals, Tables, Icons)
|-- /services       # API communication layer (Firebase, Gemini, Cloudinary)
|-- /types          # TypeScript type definitions
|-- /constants      # Mock data and constants
|-- App.tsx         # Main application component and view router
|-- index.tsx       # Entry point of the application
|-- firebaseConfig.ts # Firebase initialization
```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.