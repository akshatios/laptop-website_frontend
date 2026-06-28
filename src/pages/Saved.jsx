import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../utils/apiFetch";

const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

const Saved = () => {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) { navigate("/login?redirect=saved"); return; }
    apiFetch(`/api/auth/favorites`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setSaved(d.data || d.favorites || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const remove = async (productId) => {
    const token = getToken();
    try {
      await apiFetch(`/api/auth/favorites/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaved((prev) => prev.filter((p) => p.id !== productId && p._id !== productId));
    } catch (_) {}
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-on-surface-variant">
        <span className="material-symbols-outlined animate-spin text-[32px]">progress_activity</span>
      </div>
    );

  if (saved.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-on-surface-variant">
        <span className="material-symbols-outlined text-[48px]">favorite_border</span>
        <p className="text-headline-md font-headline-md">No saved items yet</p>
      </div>
    );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {saved.map((product) => {
        const pid = product.id || product._id;
        const image = product.images?.[0]?.image_url;
        return (
          <div
            key={pid}
            onClick={() => navigate(`/product/${pid}`)}
            className="bg-white rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-outline-variant flex flex-col cursor-pointer group"
          >
            <div className="aspect-square bg-surface-container-low relative flex items-center justify-center overflow-hidden">
              <img src={image} alt={product.title} className="w-4/5 h-4/5 object-contain group-hover:scale-110 transition-transform duration-500" loading="lazy" />
              <button
                onClick={(e) => { e.stopPropagation(); remove(pid); }}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ color: "#e53935", fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </button>
            </div>
            <div className="p-3 flex flex-col flex-1">
              <h3 className="font-headline-md text-[15px] leading-tight text-on-surface mb-1 truncate">{product.title}</h3>
              <span className="font-price-display text-price-display text-secondary mt-auto">
                ₹{parseFloat(product.price).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Saved;
