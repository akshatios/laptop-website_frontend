import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const BASE_NAV = [
  { icon: "home", label: "Home", to: "/", fillOnActive: true },
  { icon: "grid_view", label: "Catalog", to: "/catalog", fillOnActive: false },
  { icon: "favorite", label: "Saved", to: "/saved", fillOnActive: false },
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant h-16 flex justify-around items-center z-50">
      {BASE_NAV.map(({ icon, label, to, fillOnActive }) => (
        <NavLink
          key={label}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? "text-secondary" : "text-on-surface-variant"}`
          }
          aria-label={label}
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined"
                style={isActive && fillOnActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {icon}
              </span>
              <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>{label}</span>
            </>
          )}
        </NavLink>
      ))}

      {isLoggedIn ? (
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? "text-secondary" : "text-on-surface-variant"}`
          }
          aria-label="Profile"
        >
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined">{isActive ? "person" : "person"}</span>
              <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>Profile</span>
            </>
          )}
        </NavLink>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex flex-col items-center gap-1 text-on-surface-variant"
          aria-label="Login"
        >
          <span className="material-symbols-outlined">login</span>
          <span className="text-[10px] font-medium">Login</span>
        </button>
      )}
    </nav>
  );
};

export default BottomNav;
