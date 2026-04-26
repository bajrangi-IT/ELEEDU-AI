import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home as HomeIcon, MessageSquare, CheckCircle, Info, MapPin } from 'lucide-react';
import './App.css';

// Lazy loading components for efficiency
const Home = lazy(() => import('./pages/Home'));
const Assistant = lazy(() => import('./pages/Assistant'));
const Checker = lazy(() => import('./pages/Checker'));
const Explainer = lazy(() => import('./pages/Explainer'));
const BoothLocator = lazy(() => import('./pages/BoothLocator'));

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar glass-morphism">
          <div className="nav-logo">
            <CheckCircle className="logo-icon" />
            <span>EleEdu AI</span>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link"><HomeIcon size={20} /> Dashboard</Link>
            <Link to="/assistant" className="nav-link"><MessageSquare size={20} /> Assistant</Link>
            <Link to="/checker" className="nav-link"><CheckCircle size={20} /> Checker</Link>
            <Link to="/explainer" className="nav-link"><Info size={20} /> Flow</Link>
            <Link to="/locator" className="nav-link"><MapPin size={20} /> Booths</Link>
          </div>
          <div className="nav-actions">
             <button className="btn-secondary">Language</button>
             <button className="btn-primary">Sign In</button>
          </div>
        </nav>

        <main className="main-content">
          <Suspense fallback={<div className="loader">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/checker" element={<Checker />} />
              <Route path="/explainer" element={<Explainer />} />
              <Route path="/locator" element={<BoothLocator />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="footer glass-morphism">
          <p>© 2026 EleEdu AI - Empowering Voters through Intelligence</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
