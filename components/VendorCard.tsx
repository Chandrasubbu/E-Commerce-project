
import React from 'react';
import { Link } from 'react-router-dom';
import type { Vendor } from '../types';
import StarRating from './StarRating';

interface VendorCardProps {
    vendor: Vendor;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
    return (
        <Link to={`/vendor/${vendor.id}`} className="group relative flex flex-col items-center text-center overflow-hidden rounded-lg border border-gray-200 bg-white p-6 transition-shadow duration-300 hover:shadow-lg">
            <img className="w-24 h-24 rounded-full object-cover" src={vendor.logoUrl} alt={`${vendor.name} logo`} />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
                <span aria-hidden="true" className="absolute inset-0" />
                {vendor.name}
            </h3>
            <div className="mt-1">
                <StarRating rating={vendor.rating} />
            </div>
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{vendor.description}</p>
        </Link>
    );
};

export default VendorCard;
