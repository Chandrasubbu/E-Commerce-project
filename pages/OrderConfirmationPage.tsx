import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/marketplaceApi';
import type { Order } from '../types';

const OrderConfirmationPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setLoading(false);
                return;
            };
            try {
                const orderData = await getOrderById(orderId);
                setOrder(orderData || null);
            } catch (error) {
                console.error("Failed to fetch order", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return <div className="text-center py-20">Loading your order confirmation...</div>;
    }

    if (!order) {
        return <div className="text-center py-20">Order not found.</div>;
    }
    
    const { shippingAddress: shipTo, items, total } = order;

    return (
        <div className="bg-white">
            <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                <div className="max-w-xl">
                    <p className="text-sm font-medium text-indigo-600">Thank you!</p>
                    <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Your order is confirmed</h1>
                    <p className="mt-2 text-base text-gray-500">We've sent a confirmation email to your address (simulated). Your order ID is <span className="font-medium text-gray-900">{order.id}</span>.</p>
                </div>

                <section aria-labelledby="order-heading" className="mt-10 border-t border-gray-200">
                    <h2 id="order-heading" className="sr-only">Your order</h2>
                    <ul role="list" className="divide-y divide-gray-200">
                        {items.map(item => (
                            <li key={item.product.id} className="flex py-6">
                               <div className="flex-shrink-0 w-20 h-20 border border-gray-200 rounded-md overflow-hidden">
                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-center object-cover" />
                               </div>
                               <div className="ml-4 flex-1 flex flex-col">
                                   <div>
                                       <h3 className="text-sm font-medium text-gray-800">{item.product.name}</h3>
                                       <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                                   </div>
                                   <div className="flex-1 flex items-end justify-between text-sm">
                                       <p className="text-gray-800 font-medium">${(item.product.price).toFixed(2)}</p>
                                   </div>
                               </div>
                            </li>
                        ))}
                    </ul>
                </section>
                
                <section aria-labelledby="summary-heading" className="mt-10">
                     <dl className="mt-6 space-y-4 border-t border-gray-200 pt-6">
                        <div className="flex items-center justify-between">
                            <dt className="text-sm text-gray-600">Subtotal</dt>
                            <dd className="text-sm font-medium text-gray-900">${(total - 5).toFixed(2)}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                            <dt className="text-sm text-gray-600">Shipping</dt>
                            <dd className="text-sm font-medium text-gray-900">$5.00</dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                            <dt className="text-base font-medium text-gray-900">Order total</dt>
                            <dd className="text-base font-medium text-gray-900">${total.toFixed(2)}</dd>
                        </div>
                    </dl>
                </section>

                <section className="mt-10 border-t border-gray-200 pt-6">
                     <h3 className="text-lg font-medium text-gray-900">Shipping to</h3>
                     <address className="mt-4 not-italic text-gray-600">
                         <span className="block">{shipTo.name}</span>
                         <span className="block">{shipTo.address}</span>
                         <span className="block">{shipTo.city}, {shipTo.postalCode}</span>
                         <span className="block">{shipTo.country}</span>
                     </address>
                </section>

                <div className="mt-16 border-t border-gray-200 py-6 text-right">
                    <Link to="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Continue Shopping<span aria-hidden="true"> &rarr;</span></Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
