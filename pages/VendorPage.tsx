
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getVendorById, getProductsByVendorId } from '../services/marketplaceApi';
import type { Vendor, Product } from '../types';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';

const VendorPage: React.FC = () => {
    const { vendorId } = useParams<{ vendorId: string }>();
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!vendorId) return;
            setLoading(true);
            try {
                const [vendorData, productsData] = await Promise.all([
                    getVendorById(vendorId),
                    getProductsByVendorId(vendorId)
                ]);
                setVendor(vendorData || null);
                setProducts(productsData);
            } catch (error) {
                console.error("Failed to fetch vendor data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [vendorId]);

    if (loading) {
        return <div className="text-center py-20">Loading vendor page...</div>;
    }

    if (!vendor) {
        return <div className="text-center py-20">Vendor not found.</div>;
    }

    return (
        <div>
            {/* Vendor Header */}
            <div className="relative h-64 rounded-lg overflow-hidden mb-8">
                 <img src={vendor.coverImageUrl} alt={`${vendor.name} cover`} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-8">
                      <div className="flex items-center">
                           <img className="h-24 w-24 rounded-full border-4 border-white object-cover" src={vendor.logoUrl} alt={`${vendor.name} logo`} />
                           <div className="ml-6">
                                <h1 className="text-4xl font-bold text-white">{vendor.name}</h1>
                                <div className="mt-1 flex items-center">
                                    <StarRating rating={vendor.rating} />
                                    <p className="ml-2 text-sm text-gray-200">({vendor.rating.toFixed(1)})</p>
                                </div>
                           </div>
                      </div>
                 </div>
            </div>
            
            <p className="text-lg text-gray-700 mb-12 max-w-4xl">{vendor.description}</p>

            {/* Vendor Products */}
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-6">Products from {vendor.name}</h2>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">This vendor has no products yet.</p>
            )}
        </div>
    );
};

export default VendorPage;
