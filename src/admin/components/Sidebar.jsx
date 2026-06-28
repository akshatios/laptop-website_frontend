import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';

export default function Sidebar({ open, onClose }) {
  const { page, navigate } = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const navItem = (label, icon, pg) => (
    <button
      key={pg}
      className={`admin-nav-item ${page.name === pg || (pg === 'products' && page.name.startsWith('product')) ? 'active' : ''}`}
      onClick={() => { navigate(pg); onClose(); }}
    >
      <Icon name={icon} size={15} />
      {label}
    </button>
  );

  return (
    <div className={`admin-sidebar${open ? ' admin-sidebar-open' : ''}`}>
      <div className="admin-sidebar-logo">
        <div className="admin-logo-icon">💻</div>
        <div>
          <div className="admin-logo-text">LaptopBazaar</div>
          <div className="admin-logo-sub">Admin Panel</div>
        </div>
      </div>
      <div className="admin-sidebar-nav">
        <div className="admin-nav-section-label">Main</div>
        {navItem('Dashboard', 'dashboard', 'dashboard')}
        <div className="admin-nav-section-label" style={{ marginTop: 8 }}>Catalog</div>
        {navItem('All Products', 'product', 'products')}
        {navItem('Add Listing', 'plus', 'new-product')}
      </div>
      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-user">
          <div className="admin-user-avatar">S</div>
          <div className="admin-user-info">
            <div className="admin-user-name">Super Admin</div>
            <div className="admin-user-role">superadmin</div>
          </div>
          <button className="admin-btn admin-btn-icon admin-btn-ghost admin-btn-sm" title="Logout" onClick={handleLogout}>
            <Icon name="logout" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
