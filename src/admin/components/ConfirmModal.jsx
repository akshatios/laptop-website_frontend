export default function ConfirmModal({ title, body, onConfirm, onCancel, loading }) {
  return (
    <div className="admin-modal-backdrop" onClick={onCancel}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>⚠️</div>
        <div className="admin-modal-title">{title}</div>
        <div className="admin-modal-body">{body}</div>
        <div className="admin-modal-actions">
          <button className="admin-btn admin-btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="admin-btn admin-btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
