import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getVendors, createProduct, updateProduct } from '../services/marketplaceApi';
import type { Vendor, Product } from '../types';

const ProductFormPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const isEditing = Boolean(productId);

    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        gallery: '', // comma-separated
        vendorId: '',
        category: '',
    });
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const vendorsData = await getVendors();
                setVendors(vendorsData);
                if (vendorsData.length > 0 && !isEditing) {
                    setFormData(prev => ({ ...prev, vendorId: vendorsData[0].id }));
                }

                if (isEditing && productId) {
                    const productData = await getProductById(productId);
                    if (productData) {
                        setFormData({
                            name: productData.name,
                            description: productData.description,
                            price: productData.price,
                            imageUrl: productData.imageUrl,
                            gallery: productData.gallery.join(', '),
                            vendorId: productData.vendorId,
                            category: productData.category,
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to load form data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [productId, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const productPayload = {
            ...formData,
            gallery: formData.gallery.split(',').map(url => url.trim()).filter(url => url),
        };

        try {
            if (isEditing && productId) {
                await updateProduct(productId, productPayload);
            } else {
                 await createProduct(productPayload as Omit<Product, 'id' | 'rating' | 'reviewCount'>);
            }
            navigate('/admin');
        } catch (error) {
            console.error("Failed to save product:", error);
        }
    };

    if (loading) {
        return <div>Loading form...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
                {isEditing ? 'Edit Product' : 'Create New Product'}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow rounded-lg">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                    <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Main Image URL</label>
                    <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="gallery" className="block text-sm font-medium text-gray-700">Gallery Image URLs (comma-separated)</label>
                    <textarea name="gallery" id="gallery" value={formData.gallery} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="vendorId" className="block text-sm font-medium text-gray-700">Vendor</label>
                    <select id="vendorId" name="vendorId" value={formData.vendorId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                        <option value="" disabled>Select a vendor</option>
                        {vendors.map(vendor => (
                            <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end space-x-4">
                     <button type="button" onClick={() => navigate('/admin')} className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                        {isEditing ? 'Save Changes' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductFormPage;