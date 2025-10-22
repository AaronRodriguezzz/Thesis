import React, { useState } from "react";
import { usePost } from "../../hooks/usePost";
import { update_data } from "../../services/PutMethod";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordUI() {
  const { postData, loading } = usePost();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [serverCode, setServerCode] = useState("");
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(false);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postData("/api/auth/send_code", { email: formData.email });
      if (response?.code) {
        setServerCode(response.code);
        setStep(2);
      }
    } catch {
      setError(true);
    }
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (formData.code !== serverCode) {
      setError(true);
    } else {
      setError(false);
      setStep(3);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError(true);
      return;
    }

    try {
      const response = await update_data("/auth/forget_password", {
        email: formData.email,
        password: formData.newPassword,
      });

      if (response.updated) {
        navigate("/login");
      }
    } catch {
      setError(true);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('./login.png')] bg-cover bg-center filter invert" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Main Container */}
      <div className="w-[400px] bg-black/40 shadow shadow-white p-6 rounded-xl text-white">
        <h1 className="text-2xl mb-4 tracking-tight">Forgot Password</h1>

        {/* STEP 1: Email */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border text-white placeholder-white/60 bg-white/10 focus:outline-none ${
                error ? "border-red-500" : "border-white/20 focus:border-white/40"
              }`}
            />
            <button
              type="submit"
              className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </form>
        )}

        {/* STEP 2: Code */}
        {step === 2 && (
          <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="code"
              placeholder="4-Digit Code"
              value={formData.code}
              maxLength={4}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border text-white placeholder-white/60 bg-white/10 focus:outline-none ${
                error ? "border-red-500" : "border-white/20 focus:border-white/40"
              }`}
            />
            <button
              type="submit"
              className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
              disabled={loading}
            >
              Verify Code
            </button>
          </form>
        )}

        {/* STEP 3: New Password */}
        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border text-white placeholder-white/60 bg-white/10 focus:outline-none ${
                error ? "border-red-500" : "border-white/20 focus:border-white/40"
              }`}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border text-white placeholder-white/60 bg-white/10 focus:outline-none ${
                error ? "border-red-500" : "border-white/20 focus:border-white/40"
              }`}
            />

            <button
              type="submit"
              className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
              disabled={loading}
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
