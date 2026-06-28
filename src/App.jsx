import { BrowserRouter, useLocation } from "react-router-dom";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import AppRoutes from "./routes/index";

const Layout = () => {
  const location = useLocation();
  const isDetailPage = location.pathname.startsWith("/product/");
  const isAdminPage = location.pathname.startsWith("/admin");

  if (isAdminPage) return <AppRoutes />;

  return (
    <div className="bg-surface text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {!isDetailPage && <Header />}
      <main className={isDetailPage ? "" : "pt-24 pb-stack-lg px-4 md:px-8 lg:px-16 max-w-7xl mx-auto w-full"}>
        <AppRoutes />
      </main>
      {!isDetailPage && <BottomNav />}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default App;
