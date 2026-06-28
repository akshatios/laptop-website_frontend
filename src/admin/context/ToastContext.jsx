import { createContext, useContext, useState, useCallback } from 'react';

const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };

  return (
    <ToastCtx.Provider value={add}>
      {children}
      <div className="admin-toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`admin-toast ${t.type}`}>
            <span className="admin-toast-icon">{icons[t.type]}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
