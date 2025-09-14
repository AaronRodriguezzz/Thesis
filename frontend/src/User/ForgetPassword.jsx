import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { usePost } from "../../hooks/usePost";
import { update_data } from "../../services/PutMethod";
import { useNavigate } from 'react-router-dom';

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
        console.log(response?.code)
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

      if(response.updated) {
        navigate('/login')
      }

    } catch {
      setError(true);
    }
  };

  return (
    <div className="h-screen w-screen bg-[url('/login.png')] bg-cover bg-center flex items-center justify-center">
      <div className="w-[400px] bg-white/80 p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl mb-4 tracking-tight">Forgot Password</h1>

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={error}
            />
            <button
              type="submit"
              className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4">
            <TextField
              label="4-Digit Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              inputProps={{ maxLength: 4 }}
              error={error}
            />
            <button
              type="submit"
              className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
              disabled={loading}
            >
              Verify Code
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <TextField
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              error={error}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={error}
            />
            <button
              type="submit"
              className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
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
