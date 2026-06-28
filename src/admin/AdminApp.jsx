import { useState } from 'react';
import RouterProvider, { useRouter } from './context/RouterContext';
import ToastProvider from './context/ToastContext';
import AuthProvider, { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import NewProductPage from './pages/NewProductPage';
import EditProductPage from './pages/EditProductPage';
import './styles/global.css';

function DashboardShell() {
  const { page } = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  let content;
  switch (page.name) {
    case 'dashboard':
      content = <><Topbar title="Dashboard" breadcrumb="Overview" onMenuClick={() => setSidebarOpen(true)} /><DashboardPage /></>;
      break;
    case 'products':
      content = <ProductsPage onMenuClick={() => setSidebarOpen(true)} />;
      break;
    case 'new-product':
      content = <NewProductPage onMenuClick={() => setSidebarOpen(true)} />;
      break;
    case 'edit-product':
      content = <EditProductPage id={page.params.id} onMenuClick={() => setSidebarOpen(true)} />;
      break;
    default:
      content = <><Topbar title="Dashboard" onMenuClick={() => setSidebarOpen(true)} /><DashboardPage /></>;
  }

  return (
    <div className="admin-app-shell">
      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">{content}</div>
    </div>
  );
}

function AdminRoutes() {
  const { isAuth } = useAuth();
  
  if (!isAuth) {
    return (
      <div style={{ height: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, fontFamily: 'Inter, sans-serif', color: '#7c879f' }}>
        <div style={{ fontSize: 32 }}>🔒</div>
        <p style={{ fontSize: 14 }}>Unauthorized. <a href="/login" style={{ color: '#4f8ef7' }}>Login as superadmin</a></p>
      </div>
    );
  }
  return <DashboardShell />;
}

export default function AdminApp() {
  return (
    <div className="admin-shell-root">
      <RouterProvider>
        <ToastProvider>
          <AuthProvider>
            <AdminRoutes />
          </AuthProvider>
        </ToastProvider>
      </RouterProvider>
    </div>
  );
}
