import { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/catalog", label: "Catalog" },
  { to: "/saved", label: "Saved" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());

  useEffect(() => {
    const check = () => setIsLoggedIn(!!getToken());
    window.addEventListener("authChange", check);
    return () => window.removeEventListener("authChange", check);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeSearch();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`${API}/api/products/search?q=${encodeURIComponent(query.trim())}&limit=6`);
        const d = await res.json();
        setResults(d.data || []);
      } catch (_) {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
  };

  const handleSelect = (id) => {
    closeSearch();
    navigate(`/product/${id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (results.length > 0) handleSelect(results[0].id);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile max-w-container-max mx-auto bg-surface transition-all duration-300 ${
        scrolled ? "h-16 shadow-md" : "h-20 shadow-sm"
      }`}
    >
      {/* Left: Logo */}
      <h1 className={`font-headline-lg-mobile text-headline-lg-mobile tracking-tighter text-on-surface transition-all duration-200 ${searchOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        TECHNOVA
      </h1>

      {/* Desktop Nav Links */}
      {!searchOpen && (
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `text-[20px] font-medium transition-colors ${
                  isActive ? "text-secondary font-bold" : "text-on-surface-variant hover:text-secondary"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          {isLoggedIn ? (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `text-[20px] font-medium transition-colors ${
                  isActive ? "text-secondary font-bold" : "text-on-surface-variant hover:text-secondary"
                }`
              }
            >
              Profile
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `text-[20px] font-medium transition-colors ${
                  isActive ? "text-secondary font-bold" : "text-on-surface-variant hover:text-secondary"
                }`
              }
            >
              Login
            </NavLink>
          )}
        </nav>
      )}

      {/* Search area */}
      <div ref={containerRef} className={`flex items-center transition-all duration-300 ${searchOpen ? "absolute inset-x-4 top-1/2 -translate-y-1/2" : "relative"}`}>
        {searchOpen ? (
          <div className="w-full relative">
            <form onSubmit={handleSubmit} className="flex items-center bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-md">
              <span className="material-symbols-outlined text-secondary pl-3 text-[22px]">search</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-3 py-3 bg-transparent outline-none font-body-md text-body-md text-on-surface"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="pr-2 text-outline-variant">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              )}
              <button type="button" onClick={closeSearch} className="px-3 text-on-surface-variant border-l border-outline-variant h-full py-3">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
            </form>

            {/* Dropdown results */}
            {(results.length > 0 || searching || query.trim()) && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-xl border border-outline-variant shadow-lg overflow-hidden z-50">
                {searching && (
                  <div className="flex items-center gap-2 px-4 py-3 text-on-surface-variant font-body-md text-body-md">
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    Searching...
                  </div>
                )}
                {!searching && query.trim() && results.length === 0 && (
                  <div className="px-4 py-3 text-on-surface-variant font-body-md text-body-md">No results found</div>
                )}
                {!searching && results.map((p) => {
                  const image = p.images?.[0]?.image_url;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelect(p.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors border-b border-outline-variant last:border-0"
                    >
                      <div className="w-10 h-10 rounded-lg bg-surface-container-low overflow-hidden shrink-0 flex items-center justify-center">
                        {image
                          ? <img src={image} alt={p.title} className="w-full h-full object-contain" />
                          : <span className="material-symbols-outlined text-outline-variant text-[20px]">image</span>
                        }
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-label-sm text-label-sm text-on-surface truncate">{p.title}</p>
                        <p className="text-[12px] text-secondary font-semibold">₹{parseFloat(p.price).toLocaleString("en-IN")}</p>
                      </div>
                      <span className="material-symbols-outlined text-outline-variant text-[18px]">arrow_forward</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="material-symbols-outlined text-on-surface-variant hover:text-secondary transition-colors"
            aria-label="Search"
          >
            search
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
