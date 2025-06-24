import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";
import Navigation from "../../components/NavBar";
import { post_data } from "../../services/PostMethod"; // Adjust path if needed

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: "",
    comment: "",
    rating: 0,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRatingChange = (e, value) => {
    setFormData((prev) => ({
      ...prev,
      rating: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await post_data(formData, "/submit_feedback"); // Adjust endpoint

    if (response) {
      alert("Feedback submitted successfully!");
      setFormData({ name: "", comment: "", rating: 0 });
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[url('/login.png')] bg-cover bg-center flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg flex flex-col items-center gap-y-5 bg-white/90 rounded-xl p-8 shadow-lg"
      >
        <h1 className="font-light text-3xl mb-2">We Value Your Feedback</h1>

        <TextField
          label="Your Name"
          name="name"
          variant="outlined"
          value={formData.name}
          onChange={handleChange}
          sx={{ width: "100%" }}
        />

        <TextField
          label="Your Comment"
          name="comment"
          variant="outlined"
          multiline
          rows={4}
          value={formData.comment}
          onChange={handleChange}
          sx={{ width: "100%" }}
        />

        <div className="flex flex-col items-center w-full">
          <label className="text-sm font-medium mb-1">Your Rating</label>
          <Rating
            name="rating"
            value={formData.rating}
            onChange={handleRatingChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-blue-700 text-white py-3 rounded-md transition duration-200 ease-in-out"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
}
