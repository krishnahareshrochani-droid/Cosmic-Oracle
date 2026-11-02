import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { api, loadDraft, saveDraft } from './lib/api.js';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import ReadingFlow from './pages/ReadingFlow.jsx';
import ReadingPage from './pages/ReadingPage.jsx';
import NumerologyLab from './pages/NumerologyLab.jsx';
import Journal from './pages/Journal.jsx';
import Pricing from './pages/Pricing.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

export const AppContext = createContext(null);

export const useApp = () => useContext(AppContext);

export default function App() {
  const [catalog, setCatalog] = useState([]);
  const [sections, setSections] = useState([]);
  const [cities, setCities] = useState([]);
  const [payment, setPayment] = useState(null);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfileState] = useState(() => loadDraft());
  const location = useLocation();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [cat, cityRes, meRes] = await Promise.all([api.catalog(), api.cities(), api.me()]);
        if (!alive) return;
        setCatalog(cat.catalog);
        setSections(cat.sections);
        setPayment(cat.payment);
        setCities(cityRes.cities);
        setMe(meRes);
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [location.pathname]);

  const setProfile = useCallback((patch) => {
    setProfileState((prev) => {
      const next = { ...prev, ...patch };
      saveDraft(next);
      return next;
    });
  }, []);

  const refreshMe = useCallback(async () => {
    try { setMe(await api.me()); } catch { /* ignore */ }
  }, []);

  const value = useMemo(() => ({
    catalog, sections, cities, payment, me, loading, error, profile, setProfile, refreshMe,
    byId: (id) => catalog.find((r) => r.id === id),
    bySection: (section) => catalog.filter((r) => r.section === section)
  }), [catalog, sections, cities, payment, me, loading, error, profile, setProfile, refreshMe]);

  return (
    <AppContext.Provider value={value}>
      <Layout>
        {error && (
          <div className="wrap" style={{ paddingTop: '1rem' }}>
            <div className="notice notice-error">{error}</div>
          </div>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/readings" element={<Catalog />} />
          <Route path="/readings/:section" element={<Catalog />} />
          <Route path="/read/:typeId" element={<ReadingFlow />} />
          <Route path="/reading/:id" element={<ReadingPage />} />
          <Route path="/numerology" element={<NumerologyLab />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </AppContext.Provider>
  );
}
