import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import type { CartItem } from '../types';

const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();
    
    return (
        <li className="flex py-6">
            <div className="flex-shrink-0">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 rounded-md object-cover object-center sm:w-32 sm:h-32" />
            </div>

            <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                        <div className="flex justify-between">
                            <h3 className="text-sm">
                                <Link to={`/product/${item.product.id}`} className="font-medium text-gray-700 hover:text-gray-800">{item.product.name}</Link>
                            </h3>
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900">${item.product.price.toFixed(2)}</p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9">
                        <label htmlFor={`quantity-${item.product.id}`} className="sr-only">Quantity</label>
                        <select
                            id={`quantity-${item.product.id}`}
                            name={`quantity-${item.product.id}`}
                            className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                        >
                            {[...Array(10).keys()].map(i => <option key={i+1} value={i+1}>{i+1}</option>)}
                        </select>

                        <div className="absolute top-0 right-0">
                            <button type="button" className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500" onClick={() => removeFromCart(item.product.id)}>
                                <span className="sr-only">Remove</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};

const CartPage: React.FC = () => {
    const { cartItems, cartTotal } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-20">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h2 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h2>
                <p className="mt-1 text-sm text-gray-500">Looks like you haven't added anything to your cart yet.</p>
                <div className="mt-6">
                    <Link to="/" className="inline-block text-center bg-indigo-600 border border-transparent rounded-md py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white">
            <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>
                <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
                    <section aria-labelledby="cart-heading" className="lg:col-span-7">
                        <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>
                        <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
                            {cartItems.map((item) => (
                                <CartItemRow key={item.product.id} item={item} />
                            ))}
                        </ul>
                    </section>

                    <section aria-labelledby="summary-heading" className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5">
                        <h2 id="summary-heading" className="text-lg font-medium text-gray-900">Order summary</h2>
                        <dl className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <dt className="text-sm text-gray-600">Subtotal</dt>
                                <dd className="text-sm font-medium text-gray-900">${cartTotal.toFixed(2)}</dd>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                <dt className="flex items-center text-sm text-gray-600">
                                    <span>Shipping estimate</span>
                                </dt>
                                <dd className="text-sm font-medium text-gray-900">$5.00</dd>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                <dt className="text-base font-medium text-gray-900">Order total</dt>
                                <dd className="text-base font-medium text-gray-900">${(cartTotal + 5.00).toFixed(2)}</dd>
                            </div>
                        </dl>

                        <div className="mt-6">
                            <Link to="/checkout" className="w-full block text-center bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
                                Checkout
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CartPage;