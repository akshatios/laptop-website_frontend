import { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import apiFetch from "../utils/apiFetch";

const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/catalog", label: "Catalog" },
  { to: "/saved", label: "Saved" },
];

const Header = () => {
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
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) closeSearch();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await apiFetch(`/api/products/search?q=${encodeURIComponent(query.trim())}&limit=6`);
        const d = await res.json();
        setResults(d.data || []);
      } catch (_) { setResults([]); }
      finally { setSearching(false); }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const closeSearch = () => { setSearchOpen(false); setQuery(""); setResults([]); };
  const handleSelect = (id) => { closeSearch(); navigate(`/product/${id}`); };
  const handleSubmit = (e) => { e.preventDefault(); if (results.length > 0) handleSelect(results[0].id); };

  return (
    <header className="sticky top-0 w-full z-50 border-b border-outline-variant/30 flex justify-between items-center px-margin-mobile h-16"
      style={{ background: "rgba(248,249,255,0.85)", backdropFilter: "blur(12px)" }}>

      {/* Logo */}
      <h1 className={`font-headline-md text-headline-md font-extrabold tracking-tighter text-on-surface transition-all duration-200 ${searchOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        TECHNOVA
      </h1>

      {/* Desktop Nav */}
      {!searchOpen && (
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === "/"}
              className={({ isActive }) =>
                `font-label-md text-label-md transition-colors ${isActive ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"}`
              }>
              {label}
            </NavLink>
          ))}
          <NavLink to={isLoggedIn ? "/profile" : "/login"}
            className={({ isActive }) =>
              `font-label-md text-label-md transition-colors ${isActive ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"}`
            }>
            {isLoggedIn ? "Profile" : "Login"}
          </NavLink>
        </nav>
      )}

      {/* Search */}
      <div ref={containerRef} className={`flex items-center transition-all duration-300 ${searchOpen ? "absolute inset-x-4 top-1/2 -translate-y-1/2" : "relative"}`}>
        {searchOpen ? (
          <div className="w-full relative">
            <form onSubmit={handleSubmit} className="flex items-center rounded-xl overflow-hidden shadow-md border border-outline-variant/50"
              style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)" }}>
              <span className="material-symbols-outlined text-primary pl-3 text-[22px]">search</span>
              <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-3 py-3 bg-transparent outline-none font-body-md text-on-surface" />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="pr-2 text-outline">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              )}
              <button type="button" onClick={closeSearch} className="px-3 text-on-surface-variant border-l border-outline-variant/50 h-full py-3">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
            </form>
            {(results.length > 0 || searching || query.trim()) && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-xl border border-outline-variant shadow-lg overflow-hidden z-50">
                {searching && (
                  <div className="flex items-center gap-2 px-4 py-3 text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    Searching...
                  </div>
                )}
                {!searching && query.trim() && results.length === 0 && (
                  <div className="px-4 py-3 text-on-surface-variant">No results found</div>
                )}
                {!searching && results.map((p) => (
                  <button key={p.id} onClick={() => handleSelect(p.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors border-b border-outline-variant last:border-0">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-low overflow-hidden shrink-0 flex items-center justify-center">
                      {p.images?.[0]?.image_url
                        ? <img src={p.images[0].image_url} alt={p.title} className="w-full h-full object-contain" />
                        : <span className="material-symbols-outlined text-outline text-[20px]">image</span>}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-label-md text-label-md text-on-surface truncate">{p.title}</p>
                      <p className="text-[12px] text-primary font-semibold">₹{parseFloat(p.price).toLocaleString("en-IN")}</p>
                    </div>
                    <span className="material-symbols-outlined text-outline text-[18px]">arrow_forward</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => setSearchOpen(true)}
            className="hover:bg-surface-variant/50 transition-colors p-2 rounded-full active:scale-95 text-on-surface">
            <span className="material-symbols-outlined">search</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
