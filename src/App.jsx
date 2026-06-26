import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import QualifierPage from "./pages/QualifierPage";
import AdminPage from "./pages/AdminPage";
import OttermapPage from "./pages/OttermapPage";
import TrraPage from "./pages/TrraPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<OttermapPage />} /> */}
        {/* <Route path="/ottermap" element={<OttermapPage />} /> */}
        <Route path="/" element={<TrraPage />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
