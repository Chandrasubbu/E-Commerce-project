import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { createOrder } from '../services/marketplaceApi';
import type { ShippingAddress } from '../types';

const CheckoutPage: React.FC = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shippingDetails, setShippingDetails] = useState<ShippingAddress>({
        name: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });
    
    useEffect(() => {
        // Redirect if cart is empty
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const orderTotal = cartTotal + 5.00; // Including shipping
            const newOrder = await createOrder({
                items: cartItems,
                total: orderTotal,
                shippingAddress: shippingDetails
            });
            clearCart();
            navigate(`/order-confirmation/${newOrder.id}`);
        } catch (error) {
            console.error("Failed to create order:", error);
            setIsSubmitting(false);
            // Here you might want to show an error message to the user
        }
    };
    
    const orderTotal = cartTotal + 5.00; // Shipping cost

    return (
        <div className="bg-gray-50">
            <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                 <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Checkout</h1>

                 <form className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16" onSubmit={handleSubmitOrder}>
                    <section className="lg:col-span-7">
                        <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
                        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                             <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" name="name" id="name" required value={shippingDetails.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                <input type="text" name="address" id="address" required value={shippingDetails.address} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                             <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                <input type="text" name="city" id="city" required value={shippingDetails.city} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                                <input type="text" name="postalCode" id="postalCode" required value={shippingDetails.postalCode} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                             <div className="sm:col-span-2">
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                                <input type="text" name="country" id="country" required value={shippingDetails.country} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                        </div>
                    </section>
                    
                    {/* Order Summary */}
                    <section aria-labelledby="summary-heading" className="mt-16 bg-white rounded-lg shadow-md px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5">
                         <h2 id="summary-heading" className="text-lg font-medium text-gray-900">Order summary</h2>
                        <ul role="list" className="mt-6 divide-y divide-gray-200">
                           {cartItems.map(item => (
                               <li key={item.product.id} className="flex py-4">
                                   <div className="flex-shrink-0 w-20 h-20 border border-gray-200 rounded-md overflow-hidden">
                                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-center object-cover" />
                                   </div>
                                   <div className="ml-4 flex-1 flex flex-col">
                                       <div>
                                           <h3 className="text-sm text-gray-800">{item.product.name}</h3>
                                           <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                                       </div>
                                       <div className="flex-1 flex items-end justify-between text-sm">
                                           <p className="text-gray-800 font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                                       </div>
                                   </div>
                               </li>
                           ))}
                        </ul>
                         <dl className="mt-6 space-y-4 border-t border-gray-200 pt-6">
                            <div className="flex items-center justify-between">
                                <dt className="text-sm text-gray-600">Subtotal</dt>
                                <dd className="text-sm font-medium text-gray-900">${cartTotal.toFixed(2)}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-sm text-gray-600">Shipping</dt>
                                <dd className="text-sm font-medium text-gray-900">$5.00</dd>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                <dt className="text-base font-medium text-gray-900">Order total</dt>
                                <dd className="text-base font-medium text-gray-900">${orderTotal.toFixed(2)}</dd>
                            </div>
                        </dl>
                        <div className="mt-6">
                            <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed">
                                {isSubmitting ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </section>
                 </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
