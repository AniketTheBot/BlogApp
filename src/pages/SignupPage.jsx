import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../store/authSlice";
import Input from "../components/Input";
import Button from "../components/Button";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const { loading, error: authError } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
          const userData = await dispatch(signupUser({ email, password, name})).unwrap();
          console.log("Signup successful in component, userData:", userData);
          navigate("/");
        } catch (error) {
          console.error("signup failed in component, error payload:", error);
        }
  };

  return (
    <div className="flex items-center justify-center w-full py-10">
      <div className="mx-auto w-full max-w-md bg-gray-100 rounded-xl p-8 border border-gray-300 shadow-md">
        <h2 className="text-center text-2xl font-bold leading-tight text-gray-800">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?
          <Link
            to="/login"
            className="font-medium text-blue-600 transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>

        {authError && (
          <p className="text-red-600 mt-4 text-center bg-red-100 p-2 rounded">
            {authError}
          </p>
        )}

        <form onSubmit={handleSignupSubmit} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Full Name:"
              placeholder="Enter your full name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email:"
              placeholder="Enter your Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password:"
              placeholder="Enter your Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
