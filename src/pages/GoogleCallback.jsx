import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (token) {
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("authChange"));
      navigate("/", { replace: true });
    } else {
      navigate(`/login${error ? `?error=${error}` : ""}`, { replace: true });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-on-surface-variant">
      <span className="material-symbols-outlined animate-spin text-[48px] text-secondary">progress_activity</span>
      <p className="font-body-md text-body-md">Signing you in...</p>
    </div>
  );
}
