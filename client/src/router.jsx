import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ProductsPage />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
