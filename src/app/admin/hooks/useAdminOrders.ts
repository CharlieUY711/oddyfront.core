import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../utils/supabase/client";

export function useAdminOrders(limit = 50) {
  const [orders,  setOrders]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_orders").select("*")
      .order("created_at", { ascending: false }).limit(limit);
    if (error) setError(error.message);
    else setOrders(data || []);
    setLoading(false);
  }, [limit]);

  useEffect(() => { refetch(); }, []);
  return { orders, loading, error, refetch };
}
