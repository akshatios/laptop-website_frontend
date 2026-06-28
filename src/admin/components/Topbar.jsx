export default function Topbar({ title, breadcrumb, onMenuClick }) {
  return (
    <div className="admin-topbar">
      <button className="admin-menu-btn" onClick={onMenuClick}>
        <span /><span /><span />
      </button>
      <div className="admin-topbar-title">{title}</div>
      {breadcrumb && <div className="admin-topbar-breadcrumb">{breadcrumb}</div>}
    </div>
  );
}
