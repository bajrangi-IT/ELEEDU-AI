import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
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
        <a href="#main-content" className="skip-link">Skip to Content</a>
        <header role="banner">
          <nav className="navbar glass-morphism" role="navigation" aria-label="Main Navigation">
            <div className="nav-logo">
              <CheckCircle className="logo-icon" aria-hidden="true" />
              <span className="sr-only">EleEdu AI - Home</span>
              <span>EleEdu AI</span>
            </div>
            <div className="nav-links">
              <NavLink to="/" className="nav-link" aria-label="Go to Dashboard Page"><HomeIcon size={20} aria-hidden="true" /> Dashboard</NavLink>
              <NavLink to="/assistant" className="nav-link" aria-label="Go to AI Election Assistant"><MessageSquare size={20} aria-hidden="true" /> Assistant</NavLink>
              <NavLink to="/checker" className="nav-link" aria-label="Check your Voter Eligibility"><CheckCircle size={20} aria-hidden="true" /> Checker</NavLink>
              <NavLink to="/explainer" className="nav-link" aria-label="Understand the Voting Process"><Info size={20} aria-hidden="true" /> Flow</NavLink>
              <NavLink to="/locator" className="nav-link" aria-label="Locate your nearest Polling Station"><MapPin size={20} aria-hidden="true" /> Booths</NavLink>
            </div>
            <div className="nav-actions">
               <button className="btn-secondary" aria-label="Select Application Language" title="Select Language">Language</button>
               <button className="btn-primary" aria-label="Access User Profile or Sign In" title="Sign In">Sign In</button>
            </div>
          </nav>
        </header>

        <main className="main-content" id="main-content" role="main" aria-label="Primary Application Content">
          <Suspense fallback={<div className="loader" role="status">Loading application module...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/checker" element={<Checker />} />
              <Route path="/explainer" element={<Explainer />} />
              <Route path="/locator" element={<BoothLocator />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="footer glass-morphism" role="contentinfo" aria-label="Application Footer">
          <p>© 2026 EleEdu AI - Empowering Voters through Intelligence</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
