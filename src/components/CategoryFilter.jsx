const CATEGORIES = ["All", "Laptop", "Mobile", "Accessories"];

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_low_to_high", label: "Price: Low to High" },
  { value: "price_high_to_low", label: "Price: High to Low" },
];

const CategoryFilter = ({ onCategoryChange, activeCategory, onSortChange, activeSort = "relevance" }) => {
  return (
    <section className="mb-md space-y-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-headline-md text-headline-md text-on-surface"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Explore Products
        </h3>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-primary text-[18px] pointer-events-none">filter_list</span>
          <select
            value={activeSort}
            onChange={(e) => onSortChange && onSortChange(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg border border-outline-variant font-label-md text-label-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-margin-mobile px-margin-mobile hide-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange && onCategoryChange(cat)}
            className={`whitespace-nowrap font-label-md text-label-md px-6 py-2 rounded-full transition-all duration-200 ${
              activeCategory === cat
                ? "text-white"
                : "bg-surface-container-highest/50 text-on-surface-variant hover:bg-surface-variant"
            }`}
            style={activeCategory === cat
              ? { backgroundColor: "#4648d4", boxShadow: "0 4px 12px rgba(70,72,212,0.3)" }
              : {}}
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryFilter;
