const CATEGORIES = ["All", "Laptop", "Mobile", "Accessories"];

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_low_to_high", label: "Price: Low to High" },
  { value: "price_high_to_low", label: "Price: High to Low" },
];

const CategoryFilter = ({ onCategoryChange, activeCategory, onSortChange, activeSort = "relevance" }) => {
  return (
    <section className="mb-stack-lg">
      {/* Section heading + Sort dropdown */}
      <div className="flex items-center justify-between mb-stack-md">
        <h2 className="font-headline-md text-headline-md">Explore Products</h2>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-secondary text-[18px] pointer-events-none">sort</span>
          <select
            value={activeSort}
            onChange={(e) => onSortChange && onSortChange(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg border border-outline-variant font-label-sm text-label-sm text-on-surface bg-white focus:outline-none focus:border-secondary appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category scroll row */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-margin-mobile px-margin-mobile">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange && onCategoryChange(cat)}
            className={`whitespace-nowrap font-label-sm text-label-sm px-5 py-2 rounded-full transition-all ${
              activeCategory === cat
                ? "bg-secondary text-on-secondary"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryFilter;
