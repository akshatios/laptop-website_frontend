import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiFetch from "../utils/apiFetch";

const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("desc");
  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await apiFetch(`/api/products/${id}`);
        const json = await res.json();
        if (json.success) setProduct(json.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Check if already favorited
  useEffect(() => {
    const token = getToken();
    if (!token || !id) return;
    apiFetch(`/api/auth/favorites`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        const list = d.data || d.favorites || [];
        setSaved(list.some((p) => String(p.id) === String(id) || String(p._id) === String(id)));
      })
      .catch(() => {});
  }, [id]);

  const handleFavorite = async () => {
    const token = getToken();
    if (!token) { navigate("/login?redirect=saved"); return; }
    setFavLoading(true);
    try {
      const method = saved ? "DELETE" : "POST";
      await apiFetch(`/api/auth/favorites/${id}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaved(!saved);
    } catch (_) {}
    setFavLoading(false);
  };

  const swipeNext = (total) => setActiveImage((i) => (i + 1) % total);
  const swipePrev = (total) => setActiveImage((i) => (i - 1 + total) % total);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e, total) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) diff > 0 ? swipeNext(total) : swipePrev(total);
  };

  if (loading)
    return <p className="text-center py-20">Loading...</p>;

  if (!product)
    return <p className="text-center py-20 text-error">Product not found.</p>;

  const { title, description, price, category, condition, status, whatsapp_url, images } = product;

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-36">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile h-16 bg-surface shadow-sm max-w-container-max mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center text-secondary active:opacity-80 transition-all"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="font-headline-lg-mobile text-headline-lg-mobile tracking-tighter text-on-surface">
          TECHNOVA
        </span>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center text-secondary active:opacity-80 transition-all">
            <span className="material-symbols-outlined">share</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-secondary active:opacity-80 transition-all">
            <span className="material-symbols-outlined">shopping_cart</span>
          </button>
        </div>
      </header>

      <main className="mt-16">
        {/* Hero Gallery */}
        <section className="relative bg-white pt-8 pb-12 overflow-hidden">
          <div className="flex flex-col items-center px-margin-mobile">
            {/* Swipeable main image */}
            <div
              className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 flex items-center justify-center bg-surface-container-low select-none"
              onTouchStart={onTouchStart}
              onTouchEnd={(e) => onTouchEnd(e, images?.length || 1)}
            >
              <img
                key={activeImage}
                src={images?.[activeImage]?.image_url}
                alt={title}
                className="w-full h-full object-contain mix-blend-multiply transition-opacity duration-200"
              />
            </div>

            {/* Dot indicators */}
            {images?.length > 1 && (
              <div className="flex items-center gap-1.5 mb-4">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`rounded-full transition-all duration-200 ${
                      activeImage === i
                        ? "w-5 h-2 bg-secondary"
                        : "w-2 h-2 bg-outline-variant"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Thumbnail row */}
            {images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto hide-scrollbar w-full px-2">
                {images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`min-w-[72px] h-[72px] rounded-lg border-2 overflow-hidden bg-surface-container cursor-pointer transition-all ${
                      activeImage === i ? "border-secondary" : "border-outline-variant"
                    }`}
                  >
                    <img src={img.image_url} alt={title} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Product Identity */}
        <section className="px-margin-mobile -mt-6 relative z-10">
          <div className="bg-white rounded-xl shadow-sm p-stack-lg border border-surface-container-high">
            <div className="flex justify-between items-start mb-2">
              <span
                className={`text-label-sm font-label-sm px-3 py-1 rounded-full uppercase tracking-wider ${
                  status === "SOLD"
                    ? "bg-error-container text-on-error-container"
                    : "bg-secondary/10 text-secondary"
                }`}
              >
                {condition} · {status}
              </span>
              <span className="text-label-sm font-label-sm text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
                {category}
              </span>
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2 mt-3 capitalize">
              {title}
            </h1>
            {description && (
              <p className="text-on-surface-variant font-body-md text-body-md mb-4 leading-relaxed">
                {description}
              </p>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-secondary font-price-display text-[28px]">
                ₹{parseFloat(price).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="mt-stack-lg border-t border-outline-variant">
          <div className="flex px-margin-mobile border-b border-outline-variant">
            {["desc", "specs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-center font-label-sm text-label-sm transition-all capitalize ${
                  activeTab === tab
                    ? "text-secondary border-b-2 border-secondary"
                    : "text-on-surface-variant"
                }`}
              >
                {tab === "desc" ? "Description" : "Specs"}
              </button>
            ))}
          </div>

          <div className="p-margin-mobile min-h-[200px]">
            {activeTab === "desc" && (
              <p className="text-on-surface-variant font-body-md text-body-md leading-relaxed">
                {description || "No description provided."}
              </p>
            )}
            {activeTab === "specs" && (
              <div className="space-y-4">
                {[
                  ["Category", category],
                  ["Condition", condition],
                  ["Status", status],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-outline-variant">
                    <span className="text-on-surface-variant font-label-sm text-label-sm">{label}</span>
                    <span className="font-label-sm text-label-sm font-bold">{value}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-outline-variant px-margin-mobile py-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex gap-4 max-w-container-max mx-auto">
          <button
            onClick={handleFavorite}
            disabled={favLoading}
            className="flex-[0.3] flex items-center justify-center h-14 border-2 border-primary rounded-xl text-primary font-label-sm text-label-sm active:scale-95 transition-all disabled:opacity-60"
          >
            <span
              className="material-symbols-outlined"
              style={{ color: saved ? "#e53935" : undefined, fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
          <a
            href={whatsapp_url}
            target="_blank"
            rel="noreferrer"
            className="flex-1 h-14 bg-secondary text-white rounded-xl font-label-sm text-label-sm font-bold uppercase tracking-wide active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            Contact on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
