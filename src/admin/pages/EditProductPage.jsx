import { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useToast } from '../context/ToastContext';
import Topbar from '../components/Topbar';
import ProductForm from '../components/ProductForm';
import api from '../api/api';

export default function EditProductPage({ id, onMenuClick }) {
  const { navigate } = useRouter();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProduct(id)
      .then(r => { setProduct(r.data); setLoading(false); })
      .catch(() => { toast('Failed to load product', 'error'); setLoading(false); });
  }, [id]);

  const handleSubmit = async (payload) => {
    await api.updateProduct(id, payload);
    toast('Listing updated!', 'success');
    navigate('products');
  };

  if (loading) return <div className="admin-spinner-wrap"><div className="admin-big-spinner" /></div>;
  if (!product) return (
    <div className="admin-content">
      <div className="admin-empty-state"><div className="icon">❌</div><h3>Product not found</h3></div>
    </div>
  );

  return (
    <>
      <Topbar title="Edit Listing" breadcrumb={`Catalog / ${product.title}`} onMenuClick={onMenuClick} />
      <div className="admin-content">
        <div className="admin-page-header">
          <div className="admin-page-header-info">
            <h2>Edit Listing</h2>
            <p>{product.title}</p>
          </div>
          <button className="admin-btn admin-btn-ghost" onClick={() => navigate('products')}>← Back</button>
        </div>
        <div className="admin-card">
          <ProductForm initialData={product} onSubmit={handleSubmit} submitLabel="Save Changes" isEdit={true} />
        </div>
      </div>
    </>
  );
}
