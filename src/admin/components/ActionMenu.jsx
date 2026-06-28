import { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

export default function ActionMenu({ onEdit, onDelete, onWhatsApp }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="admin-action-menu-wrap" ref={ref}>
      <button className="admin-btn admin-btn-icon admin-btn-ghost admin-btn-sm" onClick={() => setOpen(o => !o)}>
        <Icon name="dots" size={15} />
      </button>
      {open && (
        <div className="admin-action-menu">
          <button className="admin-action-menu-item" onClick={() => { setOpen(false); onEdit(); }}>
            <Icon name="edit" /> Edit
          </button>
          <button className="admin-action-menu-item" onClick={() => { setOpen(false); onWhatsApp(); }}>
            <Icon name="whatsapp" /> WhatsApp
          </button>
          <button className="admin-action-menu-item danger" onClick={() => { setOpen(false); onDelete(); }}>
            <Icon name="trash" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
