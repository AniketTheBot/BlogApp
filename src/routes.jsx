import CreatePostPage from "./pages/CreatePostPage";
import YourBlogs from "./pages/YourBlogs";
import AllBlogs from "./pages/AllBlogs";
import UserInfo from "./pages/profile/UserInfo";
import LikedPosts from "./pages/profile/LikedPosts";
import MainLayout from "./components/Layout/MainLayout";
import ProfileLayout from "./pages/ProfileLayout";
import AuthLayout from "./components/Layout/AuthLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { Link } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import SinglePostPage from "./pages/SinglePostPage";
import EditPostPage from "./pages/EditPostPage";

export const routeConfig = [
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <AllBlogs /> },
      { path: "/all-blogs", element: <AllBlogs /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/your-blogs", element: <YourBlogs /> }, // Requires auth (handle with ProtectedRoute later)
          { path: "/create-post", element: <CreatePostPage /> },
          { path: "/edit-post/:postId", element: <EditPostPage /> },
          
          { path: "/post/:postId", element: <SinglePostPage /> }, // Requires auth
          {
            path: "/profile",
            element: <ProfileLayout />,
            children: [
              { index: true, element: <UserInfo /> },
              { path: "liked-posts", element: <LikedPosts /> },
              { path: "my-blogs", element: <YourBlogs /> },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
    ],
  },

  {
    path: "*",
    element: (
      <MainLayout>
        <div className="text-center p-20">
          <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
          <p className="mt-4">
            Sorry, the page you are looking for does not exist.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Go Home
          </Link>
        </div>
      </MainLayout>
    ),
  },
];
