import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Post login credentials
      const loginRes = await axios.post(
        "http://127.0.0.1:8000/user_info/login/",
        {
          email,
          password,
        }
      );

      const loggedInUser = loginRes.data;
      console.log("logged In user ", loggedInUser);

      // Save user info in localStorage
      localStorage.setItem("userId", loggedInUser.id);
      localStorage.setItem("userRole", loggedInUser.user_role);
      localStorage.setItem("userName", loggedInUser.name);
      localStorage.setItem("hallId", loggedInUser.hall);
      localStorage.setItem("userEmail", loggedInUser.email);
      localStorage.setItem("userImage", loggedInUser.image);
      localStorage.setItem("userPhone", loggedInUser.phone_number);

      // Step 2: If student, fetch registration number
      if (loggedInUser.user_role === "student") {
        const studentRes = await axios.get(`/api/students/${loggedInUser.id}/`);
        localStorage.setItem(
          "registrationNumber",
          studentRes.data.registration_number
        );
      }

      // Step 3: Redirect
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Login failed.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const goToApply = () => {
    navigate("/apply");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary-50">
      <div className="absolute top-5 right-5">
        <button onClick={goToApply} className="btn btn-primary">
          Apply for Seat
        </button>
      </div>
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-6xl mx-auto">
          {/* Left side - Welcome text */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-4">
              Welcome to SUST Halls
            </h1>
            <p className="text-lg text-base-content mb-6">
              Access your dashboard, manage services, and stay connected with
              the residential hall community. Secure and easy access for all
              authorized users.
            </p>
            <div className="hidden lg:block">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-base-content">
                    Easy Access
                  </h3>
                  <p className="text-base-content/70">
                    Login once, access all hall services
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-base-content">
                    Secure Platform
                  </h3>
                  <p className="text-base-content/70">
                    Your data is always protected
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="w-full lg:w-1/2 max-w-md">
            <div className="bg-base-100 rounded-lg shadow-xl p-8 border border-base-200">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-base-content">
                  Login to your account
                </h2>
                <p className="text-base-content/70 mt-2">
                  Enter your credentials to access your dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-base-content mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-lg border border-base-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-base-content"
                    >
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-sm text-primary hover:text-primary-focus"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 rounded-lg border border-base-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-error/10 text-error rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Sign in"
                  )}
                </button>

                <div className="mt-6 text-center">
                  <p className="text-sm text-base-content/70">
                    Demo accounts:{" "}
                    <span className="font-medium">admin@sust.com</span>,{" "}
                    <span className="font-medium">student@sust.com</span>,{" "}
                    <span className="font-medium">staff@sust.com</span>,{" "}
                    <span className="font-medium">dining@sust.com</span>
                  </p>
                  <p className="text-sm text-base-content/70 mt-1">
                    Password for all:{" "}
                    <span className="font-medium">password</span>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
