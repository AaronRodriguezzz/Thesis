import { useEffect, useState } from 'react';
import { get_data } from '../services/GetMethod'; // adjust this path if needed

const useFetch = (url) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIt = async () => {
      try {
        const res = await get_data(url);
        setData(res);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchIt();
  }, [url]);

  return { loading, data, error };
}

export default useFetch;
