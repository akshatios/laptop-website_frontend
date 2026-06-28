import ProductCard from "./ProductCard";

const ProductGrid = ({ products, onAddToCart }) => {
  if (!products || products.length === 0) {
    return (
      <div className="col-span-2 flex flex-col items-center justify-center py-16 text-on-surface-variant">
        <span className="material-symbols-outlined text-[48px] mb-3">
          inventory_2
        </span>
        <p className="font-body-md text-body-md">No products found.</p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </section>
  );
};

export default ProductGrid;