import { createContext, useContext, useState, useCallback } from 'react';

const RouterCtx = createContext(null);
export const useRouter = () => useContext(RouterCtx);

export default function RouterProvider({ children }) {
  const [page, setPage] = useState({ name: 'dashboard', params: {} });
  const navigate = useCallback((name, params = {}) => setPage({ name, params }), []);
  return <RouterCtx.Provider value={{ page, navigate }}>{children}</RouterCtx.Provider>;
}
