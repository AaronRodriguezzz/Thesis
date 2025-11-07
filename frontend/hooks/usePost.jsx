// hooks/usePost.js
import { useState } from "react";
import { post_data } from "../services/PostMethod";
import { CustomAlert } from "../components/modal/CustomAlert";

export const usePost = () => {
  const [postLoading, setLoading] = useState(false);
  const [postError, setError] = useState(null);

  const postData = async (e, url, payload, onSuccessAction) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await post_data(payload, url)

      if(response){
        onSuccessAction()
      }

    } catch (err) {
      const message = err.response.data.message || err.response.data.error || 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { postData, postLoading, postError };
};