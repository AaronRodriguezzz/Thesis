// hooks/usePost.js
import { useState } from "react";
import axios from "axios";
import { CustomAlert } from "../components/modal/CustomAlert";

export const usePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (url, payload, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(url, payload, config);
      CustomAlert('success',  response.data.message || 'Successful');
      return response.data;

    } catch (err) {
      const message = err.response.data.message || err.response.data.error || 'Unknown error';
      CustomAlert('error', message);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error };
};