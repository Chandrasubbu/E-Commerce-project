
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getVendorById } from '../services/marketplaceApi';
import type { Product, Vendor } from '../types';
import { useCart } from '../hooks/useCart';
import StarRating from '../components/StarRating';

const ProductDetailPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState<string>('');
    const { addToCart } = useCart();
    
    useEffect(() => {
        const fetchData = async () => {
            if (!productId) return;
            setLoading(true);
            try {
                const productData = await getProductById(productId);
                if (productData) {
                    setProduct(productData);
                    setMainImage(productData.imageUrl);
                    const vendorData = await getVendorById(productData.vendorId);
                    setVendor(vendorData || null);
                }
            } catch (error) {
                console.error("Failed to fetch product details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productId]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity);
        }
    };

    if (loading) {
        return <div className="text-center py-20">Loading product...</div>;
    }

    if (!product) {
        return <div className="text-center py-20">Product not found.</div>;
    }

    return (
        <div className="bg-white">
            <div className="pt-6">
                {/* Image gallery */}
                <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
                    <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                        <div className="aspect-w-4 aspect-h-3 hidden overflow-hidden rounded-lg lg:block">
                            <img src={mainImage} alt={product.name} className="h-full w-full object-cover object-center" />
                        </div>
                        <div className="mt-4 flex space-x-4">
                            {[product.imageUrl, ...product.gallery].map((img, idx) => (
                                <button key={idx} onClick={() => setMainImage(img)} className={`w-24 h-24 rounded-md overflow-hidden border-2 ${mainImage === img ? 'border-indigo-500' : 'border-transparent'}`}>
                                    <img src={img} alt={`${product.name} thumbnail ${idx}`} className="h-full w-full object-cover object-center" />
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Product info */}
                    <div className="mt-4 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
                        <p className="text-3xl tracking-tight text-gray-900 mt-2">${product.price.toFixed(2)}</p>
                        <div className="mt-6">
                            <h3 className="sr-only">Reviews</h3>
                            <div className="flex items-center">
                                <StarRating rating={product.rating} />
                                <p className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">{product.reviewCount} reviews</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="sr-only">Description</h3>
                            <div className="space-y-6 text-base text-gray-700">
                                <p>{product.description}</p>
                            </div>
                        </div>

                        {vendor && (
                            <div className="mt-6 border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-medium text-gray-900">Sold by</h3>
                                <div className="mt-2 flex items-center">
                                    <img src={vendor.logoUrl} alt={vendor.name} className="h-10 w-10 rounded-full" />
                                    <Link to={`/vendor/${vendor.id}`} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">{vendor.name}</Link>
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-10">
                            <div className="flex items-center space-x-4">
                                <label htmlFor="quantity" className="text-sm font-medium text-gray-900">Quantity</label>
                                <select id="quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10))} className="rounded-md border border-gray-300 py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                                    {[...Array(10).keys()].map(i => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                                </select>
                            </div>

                            <button onClick={handleAddToCart} type="submit" className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                Add to bag
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
