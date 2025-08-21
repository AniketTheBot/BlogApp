# Blogify - A Modern Full-Stack Blog Platform

<img width="1916" height="941" alt="image" src="https://github.com/user-attachments/assets/b7979fa8-f3c4-482d-858e-f36d43ac5cad" />

 <!-- (1) ADD A SCREENSHOT HERE -->

A feature-rich, modern blog application built from the ground up with React, Redux Toolkit, and an Appwrite backend. This project demonstrates a complete full-stack development cycle from a frontend perspective, including user authentication, CRUD operations, state management, and real-world application architecture.

**Live Demo:** https://blogapp-eight-nu.vercel.app/<!-- (2) ADD YOUR DEPLOYED LINK HERE -->

---

## 🚀 Features

-   **User Authentication:** Secure user registration and login functionality.
-   **Protected Routes:** Certain pages and actions (like creating a post) are only accessible to authenticated users.
-   **Full CRUD for Posts:** Users can **C**reate, **R**ead, **U**pdate, and **D**elete their own blog posts.
-   **Rich Text Editor:** Implemented using TinyMCE for a powerful and intuitive post creation/editing experience.
-   **File Uploads:** Seamless image uploads for featured images, managed by Appwrite Storage.
-   **Comments System:** Users can add, edit, and delete their own comments on posts.
-   **Like/Unlike System:** Interactive post liking functionality.
-   **User Profile Page:** A dedicated section for users to view their liked posts, their own posts, and update their profile information.
-   **Responsive Design:** Styled with Tailwind CSS for a clean and responsive experience on all devices.

---

## 🛠️ Tech Stack & Architecture

This project was built with a modern, scalable tech stack, focusing on best practices and a clean separation of concerns.

-   **Frontend:** React.js, React Router DOM v6
-   **State Management:** Redux Toolkit (including Async Thunks for API calls and normalized state for related data)
-   **Form Handling:** React Hook Form
-   **Styling:** Tailwind CSS
-   **Backend:** Appwrite (Backend-as-a-Service) for:
    -   Authentication
    -   Database (Collections for posts, comments, likes)
    -   Storage (for file uploads)
-   **Bundler:** Vite

The application is structured with a clear service layer (`/appwrite`) to handle all backend communication, keeping API logic separate from the UI components. This makes the codebase maintainable and easier to test.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Appwrite](https://img.shields.io/badge/Appwrite-f02e65?style=for-the-badge&logo=appwrite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

---

## 🧠 What I Learned & Challenges Faced

This project was a significant learning experience that solidified my understanding of building complete, real-world applications.

-   **Complex State Management:** I moved beyond basic `useState` and mastered **Redux Toolkit**. A major challenge was managing related but separate data. I solved this by implementing a **normalized state structure** for comments and likes (e.g., `{ postId: [comments] }`), which prevented data loss on navigation and improved performance.

-   **Asynchronous Logic:** I learned how to effectively use **Async Thunks** to handle the entire lifecycle of an API request, including pending, fulfilled, and rejected states. This was crucial for providing UI feedback like loading spinners and error messages.

-   **Debugging Race Conditions:** I encountered and solved a real-world race condition where a user would be redirected *before* the logout state was fully updated in Redux. I solved this by properly using `async/await` with `dispatch().unwrap()` in my event handlers to ensure operations completed in the correct sequence.

-   **Backend-as-a-Service Integration:** I gained deep experience with Appwrite, learning not just how to perform CRUD operations, but also the importance of configuring **backend permissions** (for collections, storage buckets, and individual files/documents) and setting up **database indexes** to enable efficient queries.

---

## Local Setup & Installation

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AniketTheBot/BlogApp.git
    cd BlogApp
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Appwrite:**
    -   You will need a running Appwrite instance (either self-hosted or on Appwrite Cloud).
    -   Create a new project.
    -   Create the necessary Database, Collections (posts, comments, likes) with the correct attributes and indexes.
    -   Create a Storage Bucket for images and configure its permissions.

4.  **Set up Environment Variables:**
    -   Create a `.env` file in the root of the project.
    -   Copy the contents of `.env.example` (you should create this file) and fill in your Appwrite project details.

    ```env
    # .env.example file content
    VITE_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
    VITE_APPWRITE_PROJECT_ID="YOUR_PROJECT_ID"
    VITE_APPWRITE_DATABASE_ID="YOUR_DATABASE_ID"
    VITE_APPWRITE_POST_ID="YOUR_POSTS_COLLECTION_ID"
    VITE_APPWRITE_COMMENTS_ID="YOUR_COMMENTS_COLLECTION_ID"
    VITE_APPWRITE_LIKES_ID="YOUR_LIKES_COLLECTION_ID"
    VITE_APPWRITE_BUCKET_ID="YOUR_STORAGE_BUCKET_ID"
    VITE_TINYMCE_API_KEY="YOUR_TINYMCE_API_KEY"
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

---

## 📞 Contact

Aniket Loona - loonaaniket@gmail.com - https://github.com/AniketTheBot
