import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVendorById, createVendor, updateVendor } from '../services/marketplaceApi';
import type { Vendor } from '../types';

const VendorFormPage: React.FC = () => {
    const { vendorId } = useParams<{ vendorId: string }>();
    const navigate = useNavigate();
    const isEditing = Boolean(vendorId);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logoUrl: '',
        coverImageUrl: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isEditing) {
            setLoading(false);
            return;
        }

        const fetchVendor = async () => {
            if (vendorId) {
                try {
                    const vendorData = await getVendorById(vendorId);
                    if (vendorData) {
                        setFormData({
                            name: vendorData.name,
                            description: vendorData.description,
                            logoUrl: vendorData.logoUrl,
                            coverImageUrl: vendorData.coverImageUrl,
                        });
                    }
                } catch (error) {
                    console.error("Failed to load vendor data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchVendor();
    }, [vendorId, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (isEditing && vendorId) {
                await updateVendor(vendorId, formData);
            } else {
                await createVendor(formData as Omit<Vendor, 'id' | 'rating'>);
            }
            navigate('/admin');
        } catch (error) {
            console.error("Failed to save vendor:", error);
        }
    };

    if (loading) {
        return <div>Loading form...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
                {isEditing ? 'Edit Vendor' : 'Create New Vendor'}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow rounded-lg">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Vendor Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">Logo URL</label>
                    <input type="text" name="logoUrl" id="logoUrl" value={formData.logoUrl} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="coverImageUrl" className="block text-sm font-medium text-gray-700">Cover Image URL</label>
                    <input type="text" name="coverImageUrl" id="coverImageUrl" value={formData.coverImageUrl} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                 <div className="flex justify-end space-x-4">
                     <button type="button" onClick={() => navigate('/admin')} className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                        {isEditing ? 'Save Changes' : 'Create Vendor'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VendorFormPage;