import { useRouter } from '../context/RouterContext';
import { useToast } from '../context/ToastContext';
import Topbar from '../components/Topbar';
import ProductForm from '../components/ProductForm';
import api from '../api/api';

export default function NewProductPage({ onMenuClick }) {
  const { navigate } = useRouter();
  const toast = useToast();

  const handleSubmit = async (payload) => {
    await api.createProduct(payload);
    toast('Listing created!', 'success');
    navigate('products');
  };

  return (
    <>
      <Topbar title="Add New Listing" breadcrumb="Catalog / Add New" onMenuClick={onMenuClick} />
      <div className="admin-content">
        <div className="admin-page-header">
          <div className="admin-page-header-info">
            <h2>Add New Listing</h2>
            <p>Fill in the details to list a laptop</p>
          </div>
          <button className="admin-btn admin-btn-ghost" onClick={() => navigate('products')}>← Back</button>
        </div>
        <div className="admin-card">
          <ProductForm onSubmit={handleSubmit} submitLabel="Create Listing" isEdit={false} />
        </div>
      </div>
    </>
  );
}
