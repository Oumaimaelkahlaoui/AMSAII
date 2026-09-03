import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CheckIn from "./pages/CheckIn";
import DocumentUpload from "./pages/DocumentUpload";
import Contract from "./pages/Contract";
import Confirmation from "./pages/Confirmation";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";

import Contact from "./pages/Contact";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/check-in" element={<CheckIn />} />
        <Route path="/check-in/document-upload" element={<DocumentUpload />} />
        <Route path="/check-in/contract" element={<Contract />} />
        <Route path="/check-in/confirmation" element={<Confirmation />} />
        <Route path="/contact" element={<Contact />} />
       {/* Routes Administration */}
<Route path="/admin" element={<AdminLogin />} />
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;