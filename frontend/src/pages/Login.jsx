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
      // Step 1: Get JWT token
      const tokenRes = await axios.post("/api/token/", { email, password });
      const token = tokenRes.data.access;

      // Step 2: Get user info with token
      const userRes = await axios.get("/api/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const users = userRes.data.results || [];
      const loggedInUser = users.find((user) => user.email === email);

      if (!loggedInUser) {
        throw new Error("User not found.");
      }

      // Save user info in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", loggedInUser.user_role);
      localStorage.setItem("userName", loggedInUser.name);
      localStorage.setItem("hallId", loggedInUser.hall);
      localStorage.setItem("userEmail", loggedInUser.email);
      localStorage.setItem("userImage", loggedInUser.image);
      localStorage.setItem("userPhone", loggedInUser.phone_number);

      // Step 3: If student, fetch registration number
      if (loggedInUser.user_role === "student") {
        const studentRes = await axios.get(`/api/students/${loggedInUser.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.setItem("registrationNumber", studentRes.data.registration_number);
      }

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
          {/* Welcome section omitted for brevity */}

          {/* Login form */}
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
                  <label htmlFor="email" className="block text-sm font-medium text-base-content mb-2">
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
                    <label htmlFor="password" className="block text-sm font-medium text-base-content">
                      Password
                    </label>
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

                <button type="submit" className="w-full btn btn-primary" disabled={isLoading}>
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
