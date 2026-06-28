import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../utils/apiFetch";

const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

const ProductCard = ({ product, onAddToCart, initialSaved = false }) => {
  const { id, title, price, condition, status, images } = product;
  const image = images?.[0]?.image_url;
  const navigate = useNavigate();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const handleFavorite = async (e) => {
    e.stopPropagation();
    const token = getToken();
    if (!token) { navigate("/login?redirect=saved"); return; }
    setLoading(true);
    try {
      await apiFetch(`/api/auth/favorites/${id}`, {
        method: saved ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaved(!saved);
    } catch (_) {}
    setLoading(false);
  };

  const isSold = status === "SOLD";

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className="group flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Image area */}
      <div className="relative aspect-square w-full bg-surface-container p-3">
        {/* Condition badge */}
        {condition && (
          <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md shadow-sm"
            style={{ background: "rgba(57,184,253,0.9)", backdropFilter: "blur(4px)" }}>
            <span className="font-label-sm text-label-sm text-on-secondary-container tracking-wider uppercase">
              {condition}
            </span>
          </div>
        )}

        {/* Sold overlay */}
        {isSold && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl"
            style={{ background: "rgba(186,26,26,0.15)", backdropFilter: "blur(2px)" }}>
            <span className="bg-error text-on-error font-label-md text-label-md px-3 py-1 rounded-full">SOLD</span>
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          disabled={loading}
          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full shadow-sm transition-colors disabled:opacity-60"
          style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)" }}
        >
          <span className="material-symbols-outlined text-[20px]"
            style={{
              color: saved ? "#e53935" : "#4648d4",
              fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0"
            }}>
            favorite
          </span>
        </button>

        {/* Product image */}
        <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
          {image
            ? <img src={image} alt={title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                loading="lazy" />
            : <span className="material-symbols-outlined text-outline text-[48px]">image</span>
          }
        </div>
      </div>

      {/* Info area */}
      <div className="p-3 space-y-1">
        <h4 className="font-label-md text-label-md text-on-surface line-clamp-1">{title}</h4>
        <div className="flex items-center justify-between">
          <span className="font-headline-md text-headline-md text-primary">
            ₹{parseFloat(price).toLocaleString("en-IN")}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart && onAddToCart(); }}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-90"
            style={{ background: "rgba(70,72,212,0.1)", color: "#4648d4" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#4648d4"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(70,72,212,0.1)"; e.currentTarget.style.color = "#4648d4"; }}
          >
            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
