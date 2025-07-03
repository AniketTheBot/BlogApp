import React from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, Outlet } from "react-router-dom";

function ProfileLayout() {
  const authStatus = useSelector((state) => state.auth.status);
  if (!authStatus) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="flex container mx-auto mt-8 min-h-[calc(100vh-200px)]">
      <aside className="w-1/4 p-4 mr-4 bg-gray-100 rounded-l-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Profile Menu</h3>
        <nav className="space-y-2">
          <Link to="/profile" className="block p-2 hover:bg-gray-200 rounded">
            User Info
          </Link>
          <Link
            to="/profile/liked-posts"
            className="block p-2 hover:bg-gray-200 rounded"
          >
            Liked Posts
          </Link>
          <Link
            to="/profile/my-blogs"
            className="block p-2 hover:bg-gray-200 rounded"
          >
            My Posts
          </Link>
        </nav>
      </aside>
      <main className="w-3/4 p-6 bg-white rounded-r-lg shadow">
        <Outlet />
      </main>
    </div>
  );
}

export default ProfileLayout;
