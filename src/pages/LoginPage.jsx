import React, { useEffect, useState } from "react";
import Input from "../components/Input";
import { loginUser } from "../store/authSlice";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();

  const { loading, error: authError } = useSelector((state) => state.auth);
  const isAuthenticated = useSelector((state) => state.auth.status);

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await dispatch(loginUser({ email, password })).unwrap();
      console.log("Login successful in component, userData:", userData);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed in component, error payload:", error);
    }
  };
  return (
    <div className="flex items-center justify-center w-full py-10">
      <div className="mx-auto w-full max-w-md bg-gray-100 rounded-xl p-8 border border-gray-300 shadow-md">
        <h2 className="text-center text-2xl font-bold leading-tight text-gray-800">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?
          <Link
            to="/signup"
            className="font-medium text-blue-600 transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        {authError && (
          <p className="text-red-600 mt-4 text-center bg-red-100 p-2 rounded">
            {authError}
          </p>
        )}
        {/* The actual form */}
        <form onSubmit={handleLoginSubmit} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Email:"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password:"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
