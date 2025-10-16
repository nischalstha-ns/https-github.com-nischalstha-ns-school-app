# SchoolHub - Modern School Management Dashboard

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

SchoolHub is a modern, responsive, and feature-rich dashboard designed to streamline school administration. It provides a clean, intuitive interface for managing students, teachers, and attendance, helping administrators and educators make data-driven decisions.

## 📸 Screenshot



## ✨ Features

-   **📊 Interactive Dashboard:** A comprehensive overview of key school metrics, including student/teacher counts, attendance statistics, financial summaries, and recent activities.
-   **👨‍🎓 Student Management:** Full CRUD (Create, Read, Update, Delete) functionality for student records.
    -   **Advanced Filtering:** Filter students by class, section, status, and more.
    -   **Dynamic Sorting:** Sort the student list by name, roll number, admission date, or any other column.
    -   **Pagination:** Efficiently handles large datasets with client-side pagination.
    -   **Bulk Import/Export:** Import student data from various file formats and export the list to CSV.
-   **👩‍🏫 Teacher Management:** A complete system for managing teacher profiles.
    -   **Full CRUD Operations:** Add, view, edit, and delete teacher records.
    -   **Robust Filtering & Sorting:** Quickly find teachers by department, class, or status.
    -   **Data Portability:** Export teacher data to a CSV file.
-   **✅ Attendance Tracking:**
    -   An interactive grid for marking daily attendance (Present, Absent, Leave).
    -   Dynamic filters for viewing attendance by month and class.
    -   At-a-glance summary statistics for each student.
-   **📱 Fully Responsive:** A mobile-first design ensures a seamless experience on all devices, from desktops to smartphones. Includes a slide-in sidebar and bottom navigation for mobile users.
-   **📝 Announcements & Notices:** A dedicated section for posting and viewing school-wide announcements.
-   **🤖 Lesson Plan Helper:** An integrated tool to assist educators in creating structured lesson plans.

## 🛠️ Tech Stack

-   **Frontend:** [React](https://reactjs.org/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **API Integration:** Native `fetch` API for external service communication.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

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

    Create a `.env` file in the root of the project and add the necessary API keys.
    ```
    # .env
    API_KEY="YOUR_API_KEY_HERE"
    ```
    *Note: The `API_KEY` is required for certain features like the Lesson Plan Helper and data import functionalities.*

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
|-- /services       # API communication layer
|-- /types          # TypeScript type definitions
|-- /constants      # Mock data and constants
|-- App.tsx         # Main application component and router
|-- index.tsx       # Entry point of the application
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
