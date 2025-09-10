// hooks/usePost.js
import { useState } from "react";
import axios from "axios";

export const usePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (url, payload, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(url, payload, config);
      return response.data;
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err; // so caller can still handle it
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error };
};