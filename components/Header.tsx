import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { getProductCategories, getVendors } from '../services/marketplaceApi';
import type { Vendor } from '../types';

const Header: React.FC = () => {
    const { cartCount } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNavData = async () => {
            try {
                const [categoriesData, vendorsData] = await Promise.all([
                    getProductCategories(),
                    getVendors()
                ]);
                setCategories(categoriesData);
                setVendors(vendorsData);
            } catch (error) {
                console.error("Failed to fetch nav data:", error);
            }
        };
        fetchNavData();
    }, []);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            if (mobileMenuOpen) setMobileMenuOpen(false);
        }
    };
    
    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-2">
                            <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="text-2xl font-bold text-gray-800">Marketplace</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {/* Categories Dropdown */}
                        <div className="relative group">
                            <button className="font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200 flex items-center">
                                Categories
                                <svg className="ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                            <div className="absolute top-full -left-4 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                    {categories.map(category => (
                                        <Link key={category} to={`/search?category=${encodeURIComponent(category)}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">{category}</Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                         {/* Vendors Dropdown */}
                        <div className="relative group">
                            <button className="font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200 flex items-center">
                                Vendors
                                <svg className="ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                            <div className="absolute top-full -left-4 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="py-1 max-h-60 overflow-y-auto" role="menu" aria-orientation="vertical">
                                    {vendors.map(vendor => (
                                        <Link key={vendor.id} to={`/vendor/${vendor.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">{vendor.name}</Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Admin</Link>
                    </nav>

                    {/* Search and Cart (Desktop) */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-48 bg-gray-100 border border-gray-200 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Search..."
                            />
                        </form>
                        <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 rounded-full">
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            {cartCount > 0 && <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{cartCount}</span>}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex lg:hidden items-center">
                         <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 rounded-full">
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            {cartCount > 0 && <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{cartCount}</span>}
                        </Link>
                        <button onClick={() => setMobileMenuOpen(true)} className="ml-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                            <span className="sr-only">Open menu</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 z-50"></div>
                    <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                             <Link to="/" onClick={closeMobileMenu} className="-m-1.5 p-1.5 flex items-center space-x-2">
                                <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                <span className="text-2xl font-bold text-gray-800">Marketplace</span>
                            </Link>
                            <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700" onClick={closeMobileMenu}>
                                <span className="sr-only">Close menu</span>
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    <form onSubmit={handleSearchSubmit} className="mb-4">
                                        <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="block w-full bg-gray-100 border border-gray-200 rounded-full py-2 px-4 text-sm" placeholder="Search for products..."/>
                                    </form>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Categories</h3>
                                    {categories.map(category => (
                                        <Link key={category} to={`/search?category=${encodeURIComponent(category)}`} onClick={closeMobileMenu} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">{category}</Link>
                                    ))}
                                     <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider pt-4">Vendors</h3>
                                     {vendors.map(vendor => (
                                        <Link key={vendor.id} to={`/vendor/${vendor.id}`} onClick={closeMobileMenu} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">{vendor.name}</Link>
                                    ))}
                                </div>
                                <div className="py-6">
                                    <Link to="/admin" onClick={closeMobileMenu} className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Admin</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;