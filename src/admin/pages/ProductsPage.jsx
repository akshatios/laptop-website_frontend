import { useState, useEffect, useCallback } from 'react';
import { useRouter } from '../context/RouterContext';
import { useToast } from '../context/ToastContext';
import Topbar from '../components/Topbar';
import ActionMenu from '../components/ActionMenu';
import ConfirmModal from '../components/ConfirmModal';
import Icon from '../components/Icon';
import api from '../api/api';

const CATEGORIES = ['Laptop', 'Mobile', 'Accessories'];
const PAGE_LIMIT = 15;

export default function ProductsPage({ onMenuClick }) {
  const { navigate } = useRouter();
  const toast = useToast();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [delTarget, setDelTarget] = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  const load = useCallback(async (p = 1, s = search, cat = filterCat, status = filterStatus) => {
    setLoading(true);
    try {
      const res = await api.getProducts({ page: p, limit: PAGE_LIMIT, search: s || undefined, category: cat || undefined, status: status || undefined });
      setData(res.data || []);
      setPagination(res.pagination || { page: 1, total: 0, total_pages: 1 });
    } catch { toast('Failed to load products', 'error'); }
    finally { setLoading(false); }
  }, [search, filterCat, filterStatus]);

  useEffect(() => { load(page); }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); load(1, search, filterCat, filterStatus); }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => { setPage(1); load(1, search, filterCat, filterStatus); }, [filterCat, filterStatus]);

  const handleDelete = async () => {
    setDelLoading(true);
    try {
      await api.deleteProduct(delTarget.id);
      toast('Listing deleted', 'success');
      setDelTarget(null);
      load(page);
    } catch (e) {
      toast(e?.message || 'Delete failed', 'error');
    } finally { setDelLoading(false); }
  };

  const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

  return (
    <>
      <Topbar title="Products" breadcrumb="Catalog / All Listings" onMenuClick={onMenuClick} />
      <div className="admin-content">
        <div className="admin-page-header">
          <div className="admin-page-header-info">
            <h2>All Listings</h2>
            <p>{pagination.total} laptop{pagination.total !== 1 ? 's' : ''} listed</p>
          </div>
          <button className="admin-btn admin-btn-primary" onClick={() => navigate('new-product')}>
            <Icon name="plus" /> Add Listing
          </button>
        </div>

        <div className="admin-filter-bar">
          <div className="admin-search-wrap">
            <Icon name="search" size={15} />
            <input type="text" placeholder="Search by title, category…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="admin-filter-select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="admin-filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="SOLD">Sold</option>
          </select>
        </div>

        <div className="admin-card">
          {loading ? (
            <div className="admin-spinner-wrap"><div className="admin-big-spinner" /></div>
          ) : data.length === 0 ? (
            <div className="admin-empty-state">
              <div className="icon">🔍</div>
              <h3>No listings found</h3>
              <p>{search || filterCat || filterStatus ? 'Try adjusting your filters' : 'Add your first laptop listing'}</p>
            </div>
          ) : (
            <>
              <div className="admin-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Image</th><th>Title</th><th>Category</th><th>Price</th><th>Condition</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="admin-img-thumb">
                            {p.images?.[0] ? <img src={p.images[0].image_url} alt="" onError={e => { e.target.style.display = 'none'; }} /> : '💻'}
                          </div>
                        </td>
                        <td style={{ maxWidth: 240 }}>
                          <div style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>
                            {p.title}
                          </div>
                        </td>
                        <td style={{ color: 'var(--admin-muted)', fontSize: 12 }}>{p.category}</td>
                        <td><span className="admin-price">{fmt(p.price)}</span></td>
                        <td><span className={`admin-badge ${p.condition?.toLowerCase()}`}>{p.condition}</span></td>
                        <td><span className={`admin-badge ${p.status?.toLowerCase()}`}>{p.status}</span></td>
                        <td>
                          <ActionMenu
                            onEdit={() => navigate('edit-product', { id: p.id })}
                            onDelete={() => setDelTarget(p)}
                            onWhatsApp={() => window.open(p.whatsapp_url, '_blank')}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="admin-pagination">
                <div className="admin-pagination-info">
                  Showing {(pagination.page - 1) * PAGE_LIMIT + 1}–{Math.min(pagination.page * PAGE_LIMIT, pagination.total)} of {pagination.total}
                </div>
                <button className="admin-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={!pagination.has_prev}>
                  <Icon name="chevronL" size={13} />
                </button>
                {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                  const p = pagination.total_pages <= 5 ? i + 1 : Math.max(1, Math.min(pagination.total_pages - 4, pagination.page - 2)) + i;
                  return (
                    <button key={p} className={`admin-page-btn ${p === pagination.page ? 'active' : ''}`} onClick={() => setPage(p)}>
                      {p}
                    </button>
                  );
                })}
                <button className="admin-page-btn" onClick={() => setPage(p => Math.min(pagination.total_pages, p + 1))} disabled={!pagination.has_next}>
                  <Icon name="chevronR" size={13} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {delTarget && (
        <ConfirmModal
          title="Delete listing?"
          body={`"${delTarget.title}" will be permanently removed.`}
          onConfirm={handleDelete}
          onCancel={() => setDelTarget(null)}
          loading={delLoading}
        />
      )}
    </>
  );
}
