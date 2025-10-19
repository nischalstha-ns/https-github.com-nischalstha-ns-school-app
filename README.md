# SchoolHub - Modern School Management Dashboard

> ⚠️ **IMPORTANT SETUP NOTE:** If you see a "Missing or insufficient permissions" error after running the app, you **must** update your Firebase Firestore security rules. This is a required one-time setup step. Please see the [Troubleshooting](#-troubleshooting-common-errors) section below for the solution.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

SchoolHub is a modern, responsive, and feature-rich dashboard designed to streamline school administration. It provides a clean, intuitive interface for managing students, teachers, attendance, finance, and more, helping administrators and educators make data-driven decisions.

## 📸 Screenshot



## ❗ Troubleshooting Common Errors

### "Missing or insufficient permissions" or "Firestore Permission Denied"

This is the most common setup issue and is caused by Firebase's default security rules, which deny all access to your database. The project now includes a comprehensive `firestore.rules` file to solve this.

**To fix this, you must deploy the new security rules:**

1.  Open your Firebase Project.
2.  Go to **Firestore Database** in the left sidebar.
3.  Click on the **Rules** tab at the top.
4.  Copy the entire content of the `firestore.rules` file from this project.
5.  Paste it into the rules editor in the Firebase Console, replacing the existing content.
6.  Click **Publish**.
7.  Return to the application and click the "Retry Connection" button or refresh the page.

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

4.  **Firebase Firestore Setup**

    This project uses Firebase Firestore for its database. For the app to function correctly, you need to configure your Firestore Security Rules. **Please see the "Troubleshooting Common Errors" section above for detailed instructions.**

5.  **Cloudinary Setup**

    The application uses Cloudinary for image uploads (e.g., profile pictures). You must configure an **unsigned upload preset** for this to work.

    1.  Log in to your [Cloudinary Dashboard](https://cloudinary.com/console).
    2.  Go to **Settings** (the gear icon).
    3.  Navigate to the **Upload** tab.
    4.  Scroll down to **Upload presets**, and click **Add upload preset**.
    5.  Change the **Signing Mode** from `Signed` to `Unsigned`.
    6.  Enter `schoolhub_uploads` as the **Upload preset name**.
    7.  Click **Save**.

6.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## 🔥 Firebase Security Rules

This project includes a `firestore.rules` file with a comprehensive set of security rules that implement Role-Based Access Control (RBAC). You must deploy these rules to your Firebase project to ensure the application works correctly and securely.

**Important Implementation Note:**

For these rules to be effective, it is a security best practice that the document ID for each user's profile in the `/users` collection should be the same as their Firebase Authentication User ID (`uid`).

The current application code creates user documents with auto-generated IDs. To make the application fully secure and compatible with these rules, the user creation logic in `services/firestoreService.ts` should be updated to use `setDoc(doc(db, 'users', user.uid), data)` instead of `addDoc()`.

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