import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { post_service } from "../../services/PostMethod"; // Adjust this path as needed

export default function RegisterPage() {
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

    const response = await post_service(formData, "/user_registration");

    if (response) {
      navigate("/");
    }
  };

  return (
    <div className="h-screen w-screen bg-[url('/login.png')] bg-cover bg-center flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-[40%] min-w-[340px] max-w-[500px] flex flex-col items-center gap-y-4 md:shadow-lg rounded-xl bg-white/80 py-6"
      >
        <h1 className="font-extralight text-[40px] my-3">Create Account</h1>

        <TextField
          label="First Name"
          name="firstName"
          variant="outlined"
          value={formData.firstName}
          onChange={handleChange}
          sx={{ width: "80%" }}
        />

        <TextField
          label="Last Name"
          name="lastName"
          variant="outlined"
          value={formData.lastName}
          onChange={handleChange}
          sx={{ width: "80%" }}
        />

        <TextField
          label="Phone"
          name="phone"
          variant="outlined"
          value={formData.phone}
          onChange={handleChange}
          sx={{ width: "80%" }}
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          variant="outlined"
          value={formData.email}
          onChange={handleChange}
          sx={{ width: "80%" }}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          value={formData.password}
          onChange={handleChange}
          sx={{ width: "80%" }}
        />

        <button
          type="submit"
          className="w-[80%] bg-green-500 py-3 rounded-md text-white my-4 hover:bg-green-600 transition duration-200 ease-in-out"
        >
          REGISTER
        </button>

        <p className="text-sm md:text-md">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 underline">
            Log In
          </a>
        </p>
      </form>
    </div>
  );
}
