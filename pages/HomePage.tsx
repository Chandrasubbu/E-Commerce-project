
import React, { useState, useEffect } from 'react';
import { getProducts, getVendors } from '../services/marketplaceApi';
import type { Product, Vendor } from '../types';
import ProductCard from '../components/ProductCard';
import VendorCard from '../components/VendorCard';

const HomePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productsData, vendorsData] = await Promise.all([getProducts(), getVendors()]);
                setProducts(productsData);
                setVendors(vendorsData);
            } catch (error) {
                console.error("Failed to fetch homepage data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-10">
                <p className="text-lg text-gray-500">Loading treasures...</p>
            </div>
        );
    }

    return (
        <div className="space-y-16">
            {/* Featured Products */}
            <section>
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-6">Featured Products</h2>
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {products.slice(0, 8).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* Top Vendors */}
            <section>
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-6">Top Vendors</h2>
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {vendors.map((vendor) => (
                        <VendorCard key={vendor.id} vendor={vendor} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
