import { BrowserRouter, Routes, Route } from "react-router-dom";
import QualifierPage from "./pages/QualifierPage";
import AdminPage from "./pages/AdminPage";
import OttermapPage from "./pages/OttermapPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OttermapPage />} />
        {/* <Route path="/ottermap" element={<OttermapPage />} /> */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
