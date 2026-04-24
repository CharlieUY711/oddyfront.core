import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function DashboardRedirect() {
  const navigate = useNavigate();
  useEffect(() => { navigate("/admin", { replace: true }); }, []);
  return null;
}
