import { useState, useEffect } from "react";
import CategoryFilter from "../components/CategoryFilter";
import ProductGrid from "../components/ProductGrid";
import Toast from "../components/Toast";
import apiFetch from "../utils/apiFetch";

const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSort, setActiveSort] = useState("relevance");
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Fetch favorites once if logged in
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    apiFetch(`/api/auth/favorites`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        const list = d.data || d.favorites || [];
        setFavoriteIds(list.map((p) => p.id || p._id));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const category = activeCategory !== "All" ? `&category=${activeCategory}` : "";
        const sort = activeSort !== "relevance" ? `&sort=${activeSort}` : "";
        const res = await apiFetch(`/api/products?page=1&limit=20${category}${sort}`);
        const json = await res.json();
        if (json.success) setProducts(json.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory, activeSort]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <span className="material-symbols-outlined animate-spin text-primary text-[40px]">progress_activity</span>
    </div>
  );

  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-48 w-full rounded-2xl overflow-hidden shadow-lg group mb-md">
        <div className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCpo_SWU7OnK192CkOshXmkZbiF64u0mELpRgoxFWBCyAdHKurh1uYVk0zuwFax1lpqPE00tnHZQiiqC32Nvg-0TQ6aYWKY-LtdwAEQ8Ph8QD3UhqpSX3BtvvHYC4wzm9b0gr4S5K83wK_S-P4yrVp3GQkjfb76Rn-xN2Q3xbMECvfVQNPpMXE2Mktz8bj5WtiUxctCAbLdjs5SOfVoJAqxnR-5GAgueptbC_YKguhRB_aw9zJKmNgPTlYK_NJSM_87nmv3OaheKw')" }} />
        <div className="absolute inset-0 flex flex-col justify-center px-md z-10"
          style={{ background: "linear-gradient(to right, rgba(70,72,212,0.85), transparent)" }}>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-primary max-w-[200px]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Premium Tech Deals
          </h2>
          <p className="font-body-md text-on-primary/80 mt-1">Limited time offers on flagship tech</p>
        </div>
      </section>

      <CategoryFilter onCategoryChange={setActiveCategory} activeCategory={activeCategory} onSortChange={setActiveSort} activeSort={activeSort} />
      <ProductGrid products={products} onAddToCart={() => setToastVisible(true)} favoriteIds={favoriteIds} />
      <div className="h-10" />
      <Toast visible={toastVisible} onHide={() => setToastVisible(false)} />
    </>
  );
};

export default Home;
