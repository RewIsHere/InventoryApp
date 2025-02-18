import { useState, useEffect } from "react";
import { fetchPendingProductDetails } from "../services/pendingDetailsService";

export const usePendingDetails = (id) => {
  const [pending, setPending] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPendingDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchPendingProductDetails(id);
        setPending(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPendingDetails();
  }, [id]);

  return { pending, loading, error };
};
