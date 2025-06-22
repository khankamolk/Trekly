import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {PackagePlus, Folder} from 'lucide-react';

import Onboarding from './pages/Onboarding.jsx'
import Roadmap from "./pages/Roadmap.jsx";

// Main App Component
function AppContent() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/roadmap" element={<Roadmap />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);