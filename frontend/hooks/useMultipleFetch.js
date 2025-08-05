import { useEffect, useState } from 'react';
import { get_data } from '../services/GetMethod';

const useMultiFetch = (endpoints = []) => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const responses = await Promise.all(
          endpoints.map(endpoint => get_data(endpoint))
        );
        setResults(responses);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (endpoints.length > 0) {
      fetchAll();
    }
  }, [endpoints]);

  return { loading, results, error };
};

export default useMultiFetch;