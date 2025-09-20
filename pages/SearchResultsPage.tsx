import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts, getVendors, getProducts } from '../services/marketplaceApi';
import type { Product, Vendor } from '../types';
import ProductCard from '../components/ProductCard';

const SearchResultsPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const initialCategory = searchParams.get('category') || 'all';

    const [initialResults, setInitialResults] = useState<Product[]>([]);
    const [filteredResults, setFilteredResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
    const [selectedVendor, setSelectedVendor] = useState<string>('all');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    useEffect(() => {
        // When category from URL changes, update state
        setSelectedCategory(initialCategory);
    }, [initialCategory]);

    useEffect(() => {
        const performSearchAndFetchFilters = async () => {
            setLoading(true);
            try {
                // Fetch static data for filters first
                const [allVendors, allProducts] = await Promise.all([
                    getVendors(),
                    getProducts()
                ]);

                setVendors(allVendors);
                const uniqueCategories = [...new Set(allProducts.map(p => p.category))].sort();
                setCategories(uniqueCategories);

                // Determine the initial set of products based on the query
                let products;
                if (query) {
                    products = await searchProducts(query);
                } else {
                    // If no search query, start with all products so category filter can work
                    products = allProducts;
                }
                setInitialResults(products);

            } catch (error) {
                console.error("Failed to fetch search data:", error);
                setInitialResults([]);
            } finally {
                setLoading(false);
            }
        };

        performSearchAndFetchFilters();
    }, [query]);

    useEffect(() => {
        let results = [...initialResults];

        if (selectedCategory !== 'all') {
            results = results.filter(p => p.category === selectedCategory);
        }

        if (selectedVendor !== 'all') {
            results = results.filter(p => p.vendorId === selectedVendor);
        }

        const minPrice = parseFloat(priceRange.min);
        if (!isNaN(minPrice)) {
            results = results.filter(p => p.price >= minPrice);
        }
        
        const maxPrice = parseFloat(priceRange.max);
        if (!isNaN(maxPrice)) {
            results = results.filter(p => p.price <= maxPrice);
        }

        setFilteredResults(results);
    }, [initialResults, selectedCategory, selectedVendor, priceRange]);
    
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPriceRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const resetFilters = () => {
        setSelectedCategory(initialCategory); // Reset to URL category or 'all'
        setSelectedVendor('all');
        setPriceRange({ min: '', max: '' });
    };

    const renderResults = () => {
        if (loading) {
            return <p className="text-gray-500 col-span-full text-center">Searching...</p>;
        }
        
        if (initialResults.length === 0 && query) {
            return (
                 <div className="text-center py-10 col-span-full">
                    <p className="text-lg text-gray-500">No products found matching your search for "{query}".</p>
                    <p className="text-sm text-gray-400">Try searching for something else.</p>
                </div>
            );
        }

        if (filteredResults.length === 0) {
            return (
                <div className="text-center py-10 col-span-full">
                    <p className="text-lg text-gray-500">No products match the current filters.</p>
                    <p className="text-sm text-gray-400">Try adjusting or resetting your filters.</p>
                </div>
            );
        }

        return (
             <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                {filteredResults.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        );
    };
    
    const pageTitle = useMemo(() => {
        if(query) return `Search Results for "${query}"`;
        if(initialCategory !== 'all') return `Browsing: ${initialCategory}`;
        return 'Search Results';
    }, [query, initialCategory]);
    
    const FilterPanel = () => (
        <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                 <button onClick={resetFilters} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Reset</button>
            </div>
            {/* Category Filter */}
            <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select id="category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option value="all">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            {/* Vendor Filter */}
            <div className="mb-6">
                <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
                <select id="vendor" value={selectedVendor} onChange={e => setSelectedVendor(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option value="all">All Vendors</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
            </div>
             {/* Price Filter */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex items-center space-x-2">
                    <input type="number" name="min" placeholder="Min" value={priceRange.min} onChange={handlePriceChange} min="0" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                    <span className="text-gray-500">-</span>
                    <input type="number" name="max" placeholder="Max" value={priceRange.max} onChange={handlePriceChange} min="0" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                </div>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Mobile Filter Button */}
            <div className="lg:hidden col-span-1 mb-4">
                <button onClick={() => setIsFilterOpen(true)} className="w-full flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                     <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                    Filters
                </button>
            </div>
            
            {/* Mobile Filter Drawer */}
            {isFilterOpen && (
                 <div className="lg:hidden fixed inset-0 z-40" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" onClick={() => setIsFilterOpen(false)}></div>
                    <div className="relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto">
                        <div className="px-4 flex items-center justify-between">
                            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                            <button type="button" className="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400" onClick={() => setIsFilterOpen(false)}>
                                <span className="sr-only">Close menu</span>
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="mt-4 px-4">
                            <FilterPanel />
                        </div>
                    </div>
                </div>
            )}
            
            {/* Filters Sidebar (Desktop) */}
            <aside className="hidden lg:block lg:col-span-1 sticky top-24">
                 <FilterPanel />
            </aside>

            {/* Search Results */}
            <main className="lg:col-span-3">
                 <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-6">
                    {pageTitle}
                </h1>
                {renderResults()}
            </main>
        </div>
    );
};

export default SearchResultsPage;