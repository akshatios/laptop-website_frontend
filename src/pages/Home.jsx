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

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <>
      <CategoryFilter onCategoryChange={setActiveCategory} activeCategory={activeCategory} onSortChange={setActiveSort} activeSort={activeSort} />
      <ProductGrid products={products} onAddToCart={() => setToastVisible(true)} favoriteIds={favoriteIds} />
      <div className="h-10" />
      <Toast visible={toastVisible} onHide={() => setToastVisible(false)} />
    </>
  );
};

export default Home;
