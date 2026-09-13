import { Routes, Route, Link } from "react-router-dom";
import ProductListPage from "./pages/ProductListPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="app-header__logo">
          Naik Foods <span>· Reviews Prototype</span>
        </Link>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
        </Routes>
      </main>
      <footer className="app-footer">
        Built as a MERN prototype for the Bits and Volts Full Stack Intern task.
      </footer>
    </div>
  );
}
