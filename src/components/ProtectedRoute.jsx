import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
  const isAuthenticated = useSelector((state) => state.auth.status); // Path to your auth status
  const isLoadingAuth = useSelector((state) => state.auth.loading); // Path to your loading flag
  const location = useLocation();

  // --- THE MOST IMPORTANT DEBUGGING STEP ---
  console.log("--- ProtectedRoute ---");
  console.log("Current Auth Status from Redux:", isAuthenticated);
  console.log("Is Loading Auth:", isLoadingAuth);
  console.log("----------------------");
  // --- END DEBUGGING STEP ---

  // Initial loading state for auth check
  if (isLoadingAuth && !isAuthenticated) {
    // This condition specifically targets the initial phase where 'checkAuthStatus' might be running
    // and we don't yet have a confirmed 'isAuthenticated = true'.
    // If 'isAuthenticated' becomes true while 'isLoadingAuth' is also true (e.g., during login/signup thunk),
    // this condition won't be met, which is correct.
    console.log("ProtectedRoute: Auth check in progress or initial state...");
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log(
      "ProtectedRoute: User not authenticated, redirecting to login. Current location:",
      location.pathname
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If we reach here, user is authenticated
  console.log(
    "ProtectedRoute: User IS authenticated, rendering Outlet for path:",
    location.pathname
  );
  return <Outlet />;
}

export default ProtectedRoute;
