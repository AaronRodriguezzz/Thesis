import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { post_data } from "../../services/PostMethod";
import { useUserProtection } from "../../hooks/userProtectionHooks";
import { motion } from "framer-motion";

export default function RegisterPage() {
  useUserProtection();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await post_data(formData, "/user_registration");

    if (response) {
      navigate("/login");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('./login.png')] bg-cover bg-center filter invert" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Form Container */}
      <motion.form
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        animate={{ opacity: 1, y:0 }}
        onSubmit={handleSubmit}
        className="w-[40%] min-w-[340px] max-w-[500px] flex flex-col items-center gap-y-4 md:shadow-lg shadow-white rounded-xl bg-black/40 text-white py-6"
      >
        <h1 className="font-extralight text-[40px] my-3">Create Account</h1>

        {/* Inputs */}
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="w-[80%] max-w-sm px-3 py-2 rounded-md border border-white/20 text-white placeholder-white/60 bg-white/10 focus:outline-none focus:border-white/40"
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="w-[80%] max-w-sm px-3 py-2 rounded-md border border-white/20 text-white placeholder-white/60 bg-white/10 focus:outline-none focus:border-white/40"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-[80%] max-w-sm px-3 py-2 rounded-md border border-white/20 text-white placeholder-white/60 bg-white/10 focus:outline-none focus:border-white/40"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-[80%] max-w-sm px-3 py-2 rounded-md border border-white/20 text-white placeholder-white/60 bg-white/10 focus:outline-none focus:border-white/40"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-[80%] max-w-sm px-3 py-2 rounded-md border border-white/20 text-white placeholder-white/60 bg-white/10 focus:outline-none focus:border-white/40"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-[80%]  max-w-sm bg-green-500 py-2 rounded-md text-white my-4 hover:bg-green-600 transition duration-200 ease-in-out"
        >
          REGISTER
        </button>

        <p className="text-sm md:text-md">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 underline">
            Log In
          </a>
        </p>
      </motion.form>
    </div>
  );
}
