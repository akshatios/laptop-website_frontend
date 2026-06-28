import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const BASE_NAV = [
  { icon: "home", label: "Home", to: "/", fill: true },
  { icon: "grid_view", label: "Catalog", to: "/catalog", fill: false },
  { icon: "favorite", label: "Saved", to: "/saved", fill: false },
];

const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

const BottomNav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => setIsLoggedIn(!!getToken());
    window.addEventListener("authChange", check);
    return () => window.removeEventListener("authChange", check);
  }, []);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-xl border-t border-outline-variant/20 shadow-lg flex justify-around items-center h-20 px-4"
      style={{ background: "rgba(248,249,255,0.92)", backdropFilter: "blur(20px)" }}>
      {BASE_NAV.map(({ icon, label, to, fill }) => (
        <NavLink key={label} to={to} end={to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 transition-transform active:scale-90 ${isActive ? "text-primary font-bold scale-110" : "text-on-surface-variant opacity-70"}`
          }>
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined"
                style={isActive && fill ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {icon}
              </span>
              <span className="font-label-sm text-label-sm">{label}</span>
            </>
          )}
        </NavLink>
      ))}

      {isLoggedIn ? (
        <NavLink to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 transition-transform active:scale-90 ${isActive ? "text-primary font-bold scale-110" : "text-on-surface-variant opacity-70"}`
          }>
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                person
              </span>
              <span className="font-label-sm text-label-sm">Profile</span>
            </>
          )}
        </NavLink>
      ) : (
        <button onClick={() => navigate("/login")}
          className="flex flex-col items-center justify-center gap-0.5 text-on-surface-variant opacity-70 active:scale-90">
          <span className="material-symbols-outlined">login</span>
          <span className="font-label-sm text-label-sm">Login</span>
        </button>
      )}
    </nav>
  );
};

export default BottomNav;
