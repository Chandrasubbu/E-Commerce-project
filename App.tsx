import React from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import VendorPage from './pages/VendorPage';
import CartPage from './pages/CartPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AdminPage from './pages/AdminPage';
import ProductFormPage from './pages/ProductFormPage';
import VendorFormPage from './pages/VendorFormPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';


const AppContent: React.FC = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-800">
            <Header />
            <main className="flex-grow">
                {isHomePage && (
                    <div className="relative bg-gray-900">
                        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
                             <img src="https://picsum.photos/1920/1080?grayscale&blur=2" alt="Hero background" className="w-full h-full object-center object-cover"/>
                        </div>
                        <div aria-hidden="true" className="absolute inset-0 bg-gray-900 opacity-60"></div>
                        <div className="relative max-w-3xl mx-auto py-32 px-6 flex flex-col items-center text-center sm:py-48 lg:px-8">
                             <h1 className="text-4xl font-extrabold tracking-tight text-white lg:text-6xl">Find Your Next Treasure</h1>
                             <p className="mt-4 text-xl text-white">Discover unique products from the best independent vendors around the world.</p>
                        </div>
                    </div>
                )}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/product/:productId" element={<ProductDetailPage />} />
                        <Route path="/vendor/:vendorId" element={<VendorPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                        <Route path="/search" element={<SearchResultsPage />} />
                        {/* Admin Routes */}
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/admin/product/new" element={<ProductFormPage />} />
                        <Route path="/admin/product/edit/:productId" element={<ProductFormPage />} />
                        <Route path="/admin/vendor/new" element={<VendorFormPage />} />
                        <Route path="/admin/vendor/edit/:vendorId" element={<VendorFormPage />} />
                    </Routes>
                </div>
            </main>
            <Footer />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <CartProvider>
            <HashRouter>
                <AppContent />
            </HashRouter>
        </CartProvider>
    );
};

export default App;