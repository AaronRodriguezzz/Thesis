// src/hooks/useFetch.js
import { useEffect, useState } from "react";
import axios from "axios";

export const useFetch = (url, page = null, limit = null, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if(!url) return 
    
    const fetchData = async () => {
      try {

        setLoading(true);
        const result = await axios.get(`/api/${url}`, { params: { page, limit } });        
        
        if (isMounted) setData(result?.data || null);

      } catch (err) {
        if (isMounted) setError(err.message || "Failed to fetch");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false; // cleanup
    };
  }, [url, page, limit, ...deps]);

  return { data, loading, error, setData };
};
