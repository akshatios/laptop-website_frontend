import { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import Icon from '../components/Icon';
import api from '../api/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const { navigate } = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, allRes] = await Promise.all([
          api.getStats(),
          api.getProducts({ page: 1, limit: 5 }),
        ]);
        setStats({
          total: statsRes.data.total_listings,
          available: statsRes.data.available,
          sold: statsRes.data.sold,
          images: statsRes.data.total_images,
        });
        setRecent(allRes.data || []);
      } catch { }
      finally { setLoading(false); }
    })();
  }, []);

  const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

  if (loading) return <div className="admin-spinner-wrap"><div className="admin-big-spinner" /></div>;

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div className="admin-page-header-info">
          <h2>Dashboard</h2>
          <p>Overview of your laptop marketplace</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => navigate('new-product')}>
          <Icon name="plus" /> Add Listing
        </button>
      </div>
      <div className="admin-stats-grid">
        <div className="admin-stat-card blue"><div className="admin-stat-icon blue">📦</div><div className="admin-stat-value">{stats?.total ?? '—'}</div><div className="admin-stat-label">Total Listings</div></div>
        <div className="admin-stat-card green"><div className="admin-stat-icon green">✅</div><div className="admin-stat-value">{stats?.available ?? '—'}</div><div className="admin-stat-label">Available</div></div>
        <div className="admin-stat-card amber"><div className="admin-stat-icon amber">🏷️</div><div className="admin-stat-value">{stats?.sold ?? '—'}</div><div className="admin-stat-label">Sold</div></div>
        <div className="admin-stat-card red"><div className="admin-stat-icon red">📸</div><div className="admin-stat-value">{stats?.images ?? '—'}</div><div className="admin-stat-label">Total Images</div></div>
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <div><div className="admin-card-title">Recent Listings</div><div className="admin-card-sub">Last added products</div></div>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => navigate('products')}>View all</button>
        </div>
        {recent.length === 0 ? (
          <div className="admin-empty-state"><div className="icon">📭</div><h3>No listings yet</h3><p>Add your first laptop listing</p></div>
        ) : (
          <div className="admin-table-wrap">
            <table>
              <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Status</th><th>Condition</th></tr></thead>
              <tbody>
                {recent.map(p => (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => navigate('edit-product', { id: p.id })}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="admin-img-thumb">{p.images?.[0] ? <img src={p.images[0].image_url} alt="" onError={e => { e.target.style.display = 'none'; }} /> : '💻'}</div>
                        <span style={{ fontWeight: 500, fontSize: 13 }}>{p.title}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--admin-muted)', fontSize: 12 }}>{p.category}</td>
                    <td><span className="admin-price">{fmt(p.price)}</span></td>
                    <td><span className={`admin-badge ${p.status?.toLowerCase()}`}>{p.status}</span></td>
                    <td style={{ color: 'var(--admin-muted)', fontSize: 12 }}>{p.condition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
