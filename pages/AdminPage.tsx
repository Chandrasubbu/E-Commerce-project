import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getVendors, deleteProduct, deleteVendor, getOrders } from '../services/marketplaceApi';
import type { Product, Vendor, Order } from '../types';

const AdminPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [productSearch, setProductSearch] = useState('');
    const [vendorSearch, setVendorSearch] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [productsData, vendorsData, ordersData] = await Promise.all([
                getProducts(), 
                getVendors(),
                getOrders()
            ]);
            setProducts(productsData);
            setVendors(vendorsData);
            setOrders(ordersData);
        } catch (error) {
            console.error("Failed to fetch admin data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(productId);
            fetchData(); // Refresh data
        }
    };

    const handleDeleteVendor = async (vendorId: string) => {
        if (window.confirm('Are you sure you want to delete this vendor? This will also delete all their products.')) {
            await deleteVendor(vendorId);
            fetchData(); // Refresh data
        }
    };
    
    const filteredProducts = useMemo(() => {
        if (!productSearch) return products;
        return products.filter(p => 
            p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
            p.category.toLowerCase().includes(productSearch.toLowerCase())
        );
    }, [products, productSearch]);

    const filteredVendors = useMemo(() => {
        if (!vendorSearch) return vendors;
        return vendors.filter(v => v.name.toLowerCase().includes(vendorSearch.toLowerCase()));
    }, [vendors, vendorSearch]);

    const dashboardStats = useMemo(() => {
        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
        const averagePrice = products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0;
        return {
            totalProducts: products.length,
            totalVendors: vendors.length,
            totalOrders: orders.length,
            totalSales: totalSales,
            averagePrice: averagePrice,
        }
    }, [products, vendors, orders]);


    if (loading) {
        return <div className="text-center py-10">Loading Admin Dashboard...</div>;
    }

    const StatCard: React.FC<{ title: string; value: string | number; icon: JSX.Element }> = ({ title, value, icon }) => (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        {icon}
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                            <dd className="text-3xl font-semibold text-gray-900">{value}</dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );

    const TabButton: React.FC<{ title: string; tabName: string; }> = ({ title, tabName }) => (
         <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === tabName ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
        >
            {title}
        </button>
    );

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <TabButton title="Dashboard" tabName="dashboard" />
                    <TabButton title="Products" tabName="products" />
                    <TabButton title="Vendors" tabName="vendors" />
                    <TabButton title="Sales" tabName="sales" />
                </nav>
            </div>

            {/* Dashboard Content */}
            {activeTab === 'dashboard' && (
                 <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Marketplace Overview</h2>
                     <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard title="Total Sales" value={`$${dashboardStats.totalSales.toFixed(2)}`} icon={<svg className="h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} />
                        <StatCard title="Total Orders" value={dashboardStats.totalOrders} icon={<svg className="h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>} />
                        <StatCard title="Total Products" value={dashboardStats.totalProducts} icon={<svg className="h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>} />
                        <StatCard title="Total Vendors" value={dashboardStats.totalVendors} icon={<svg className="h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                    </div>
                </section>
            )}
            
            {/* Products Section */}
            {activeTab === 'products' && (
                <section>
                    <div className="sm:flex sm:justify-between sm:items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
                        <div className="mt-4 sm:mt-0 sm:flex sm:space-x-4">
                             <input type="text" placeholder="Search products..." value={productSearch} onChange={e => setProductSearch(e.target.value)} className="block w-full sm:w-64 border-gray-300 rounded-md shadow-sm" />
                            <Link to="/admin/product/new" className="mt-2 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                                Add New Product
                            </Link>
                        </div>
                    </div>
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.map(product => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap"><img src={product.imageUrl} alt={product.name} className="h-10 w-10 rounded-md object-cover" /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendors.find(v => v.id === product.vendorId)?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                            <Link to={`/admin/product/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                                            <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* Vendors Section */}
            {activeTab === 'vendors' && (
                <section>
                    <div className="sm:flex sm:justify-between sm:items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Vendors</h2>
                        <div className="mt-4 sm:mt-0 sm:flex sm:space-x-4">
                            <input type="text" placeholder="Search vendors..." value={vendorSearch} onChange={e => setVendorSearch(e.target.value)} className="block w-full sm:w-64 border-gray-300 rounded-md shadow-sm" />
                            <Link to="/admin/vendor/new" className="mt-2 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                                Add New Vendor
                            </Link>
                        </div>
                    </div>
                     <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredVendors.map(vendor => (
                                    <tr key={vendor.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vendor.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.rating.toFixed(1)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                            <Link to={`/admin/vendor/edit/${vendor.id}`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                                            <button onClick={() => handleDeleteVendor(vendor.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

             {/* Sales Section */}
            {activeTab === 'sales' && (
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Sales & Orders</h2>
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.shippingAddress.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${order.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    );
};

export default AdminPage;