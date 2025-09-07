// src/hooks/useFetch.js
import { useEffect, useState } from "react";
import { get_data } from "../services/GetMethod";

export const useFetch = (url, page = null, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await get_data(url, page);
        if (isMounted) setData(result);
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
  }, [...deps]);

  return { data, loading, error, setData };
};
