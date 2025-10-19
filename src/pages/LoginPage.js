import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const formData = new URLSearchParams();
            formData.append("username", username);
            formData.append("password", password);
            formData.append("grant_type", "password");

            const response = await api.post("/auth/token", formData, {
                headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            localStorage.setItem("token", response.data.access_token);
            navigate("/dashboard"); // Redirect to dashboard after successful login
            } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            setError("Invalid username or password");
            } finally {
            setLoading(false);
            }
    };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <div className="mb-4">
          <label className="block mb-1 text-gray-600">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-gray-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
