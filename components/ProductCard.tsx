
import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import StarRating from './StarRating';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <Link to={`/product/${product.id}`} className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow duration-300 hover:shadow-xl">
            <div className="aspect-w-3 aspect-h-3 bg-gray-200 sm:aspect-none h-60">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-center sm:h-full sm:w-full transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="flex flex-1 flex-col space-y-2 p-4">
                <h3 className="text-base font-medium text-gray-900">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                <div className="flex flex-1 flex-col justify-end">
                    <div className="flex items-center justify-between">
                         <StarRating rating={product.rating} />
                         <p className="text-sm text-gray-500">{product.reviewCount} reviews</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mt-2">${product.price.toFixed(2)}</p>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
