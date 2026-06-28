import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;
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
      const method = saved ? "DELETE" : "POST";
      await fetch(`${API}/api/auth/favorites/${id}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaved(!saved);
    } catch (_) {}
    setLoading(false);
  };

  const badgeClasses =
    status === "SOLD"
      ? "bg-error-container text-on-error-container"
      : "bg-secondary/10 text-secondary";

  return (
    <div onClick={() => navigate(`/product/${id}`)} className="bg-white rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-outline-variant group flex flex-col cursor-pointer">
      <div className="aspect-square bg-surface-container-low relative flex items-center justify-center overflow-hidden">
        <img src={image} alt={title} className="w-4/5 h-4/5 object-contain group-hover:scale-110 transition-transform duration-500" loading="lazy" />
        {condition && (
          <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${badgeClasses}`}>
            {condition}
          </span>
        )}
        <button
          onClick={handleFavorite}
          disabled={loading}
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow transition-transform hover:scale-110 disabled:opacity-60"
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ color: saved ? "#e53935" : "#76777d", fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-headline-md text-[15px] leading-tight text-on-surface mb-1 truncate">{title}</h3>
        <div className="mt-auto flex items-end justify-between gap-2">
          <span className="font-price-display text-price-display text-secondary">
            ₹{parseFloat(price).toLocaleString("en-IN")}
          </span>
          {onAddToCart && (
            <button
              onClick={onAddToCart}
              className="hidden md:flex items-center gap-1 text-[12px] font-semibold bg-secondary text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0"
            >
              <span className="material-symbols-outlined text-[14px]">add_shopping_cart</span>
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
