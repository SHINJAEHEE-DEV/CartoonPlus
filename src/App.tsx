import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MockDataRepository } from './lib/storage';
import Header from './components/Header';
import Footer from './components/Footer';
import BookRequestModal from './components/BookRequestModal';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import EntertainmentPage from './pages/EntertainmentPage';
import MenuPage from './pages/MenuPage';
import StorePage from './pages/StorePage';
import AdminDeskPage from './pages/AdminDeskPage';

export default function App() {
  const [selectedStore, setSelectedStore] = useState<'snu' | 'jamsil'>(() =>
    MockDataRepository.getSelectedStore()
  );
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestPrefillTitle, setRequestPrefillTitle] = useState('');

  const handleStoreChange = (storeId: 'snu' | 'jamsil') => {
    setSelectedStore(storeId);
    MockDataRepository.setSelectedStore(storeId);
  };

  const handleOpenBookRequest = (prefilledTitle = '') => {
    setRequestPrefillTitle(prefilledTitle);
    setIsRequestModalOpen(true);
  };

  return (
    <AuthProvider>
      <HashRouter>
        <div className="min-h-screen bg-brand-surface flex flex-col font-sans text-brand-charcoal selection:bg-brand-yellow selection:text-brand-charcoal">
          {/* Global Header */}
          <Header selectedStore={selectedStore} onStoreChange={handleStoreChange} />

          {/* Main Content Area */}
          <main className="flex-1">
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    selectedStore={selectedStore}
                    onOpenBookRequest={handleOpenBookRequest}
                  />
                }
              />
              <Route
                path="/search"
                element={
                  <SearchPage
                    selectedStore={selectedStore}
                    onOpenBookRequest={handleOpenBookRequest}
                  />
                }
              />
              <Route path="/entertainment" element={<EntertainmentPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/admin" element={<AdminDeskPage />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <Footer />

          {/* Global Book Request Modal */}
          <BookRequestModal
            isOpen={isRequestModalOpen}
            onClose={() => setIsRequestModalOpen(false)}
            defaultStoreId={selectedStore}
            prefilledTitle={requestPrefillTitle}
          />
        </div>
      </HashRouter>
    </AuthProvider>
  );
}
