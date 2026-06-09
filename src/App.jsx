import { BrowserRouter, Routes, Route } from "react-router-dom";
import QualifierPage from "./pages/QualifierPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QualifierPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
