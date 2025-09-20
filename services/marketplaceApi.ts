import { PRODUCTS, VENDORS } from '../constants';
import type { Product, Vendor, Order, CartItem, ShippingAddress } from '../types';

// --- LocalStorage Initialization ---

const initializeDatabase = () => {
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(PRODUCTS));
    }
    if (!localStorage.getItem('vendors')) {
        localStorage.setItem('vendors', JSON.stringify(VENDORS));
    }
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
};

initializeDatabase();

// --- Helper Functions ---

const getStoredProducts = (): Product[] => {
    try {
        const products = localStorage.getItem('products');
        return products ? JSON.parse(products) : [];
    } catch (e) {
        console.error("Failed to parse products from localStorage", e);
        return [];
    }
};

const getStoredVendors = (): Vendor[] => {
    try {
        const vendors = localStorage.getItem('vendors');
        return vendors ? JSON.parse(vendors) : [];
    } catch (e) {
        console.error("Failed to parse vendors from localStorage", e);
        return [];
    }
};

const getStoredOrders = (): Order[] => {
    try {
        const orders = localStorage.getItem('orders');
        return orders ? JSON.parse(orders) : [];
    } catch (e) {
        console.error("Failed to parse orders from localStorage", e);
        return [];
    }
};

const saveProducts = (products: Product[]) => {
    localStorage.setItem('products', JSON.stringify(products));
};

const saveVendors = (vendors: Vendor[]) => {
    localStorage.setItem('vendors', JSON.stringify(vendors));
};

const saveOrders = (orders: Order[]) => {
    localStorage.setItem('orders', JSON.stringify(orders));
};


const simulateDelay = <T,>(data: T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(data);
        }, 300); // 300ms delay
    });
};

// --- Product API ---

export const getProducts = (): Promise<Product[]> => {
    return simulateDelay(getStoredProducts());
};

export const getProductById = (id: string): Promise<Product | undefined> => {
    const product = getStoredProducts().find(p => p.id === id);
    return simulateDelay(product);
};

export const createProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviewCount'>): Promise<Product> => {
    const products = getStoredProducts();
    const newProduct: Product = {
        ...productData,
        id: `p${Date.now()}`,
        rating: 0,
        reviewCount: 0,
    };
    products.push(newProduct);
    saveProducts(products);
    return simulateDelay(newProduct);
};

export const updateProduct = (productId: string, updates: Partial<Product>): Promise<Product | undefined> => {
    let products = getStoredProducts();
    let productToUpdate: Product | undefined;
    products = products.map(p => {
        if (p.id === productId) {
            productToUpdate = { ...p, ...updates };
            return productToUpdate;
        }
        return p;
    });
    if (productToUpdate) {
        saveProducts(products);
    }
    return simulateDelay(productToUpdate);
};

export const deleteProduct = (productId: string): Promise<boolean> => {
    let products = getStoredProducts();
    const initialLength = products.length;
    products = products.filter(p => p.id !== productId);
    if (products.length < initialLength) {
        saveProducts(products);
        return simulateDelay(true);
    }
    return simulateDelay(false);
};

export const getProductCategories = (): Promise<string[]> => {
    const products = getStoredProducts();
    const categories = [...new Set(products.map(p => p.category))].sort();
    return simulateDelay(categories);
};

// --- Vendor API ---

export const getVendors = (): Promise<Vendor[]> => {
    return simulateDelay(getStoredVendors());
};

export const getVendorById = (id: string): Promise<Vendor | undefined> => {
    const vendor = getStoredVendors().find(v => v.id === id);
    return simulateDelay(vendor);
};

export const createVendor = (vendorData: Omit<Vendor, 'id' | 'rating'>): Promise<Vendor> => {
    const vendors = getStoredVendors();
    const newVendor: Vendor = {
        ...vendorData,
        id: `v${Date.now()}`,
        rating: 0,
    };
    vendors.push(newVendor);
    saveVendors(vendors);
    return simulateDelay(newVendor);
};

export const updateVendor = (vendorId: string, updates: Partial<Vendor>): Promise<Vendor | undefined> => {
    let vendors = getStoredVendors();
    let vendorToUpdate: Vendor | undefined;
    vendors = vendors.map(v => {
        if (v.id === vendorId) {
            vendorToUpdate = { ...v, ...updates };
            return vendorToUpdate;
        }
        return v;
    });
    if (vendorToUpdate) {
        saveVendors(vendors);
    }
    return simulateDelay(vendorToUpdate);
};

export const deleteVendor = (vendorId: string): Promise<boolean> => {
    let vendors = getStoredVendors();
    const initialLength = vendors.length;
    vendors = vendors.filter(v => v.id !== vendorId);
    if (vendors.length < initialLength) {
        saveVendors(vendors);
        // Also delete products associated with this vendor
        let products = getStoredProducts();
        products = products.filter(p => p.vendorId !== vendorId);
        saveProducts(products);
        return simulateDelay(true);
    }
    return simulateDelay(false);
};

// --- Order API ---

export const getOrders = (): Promise<Order[]> => {
    const orders = getStoredOrders().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return simulateDelay(orders);
};

export const getOrderById = (id: string): Promise<Order | undefined> => {
    const order = getStoredOrders().find(o => o.id === id);
    return simulateDelay(order);
};

export const createOrder = (orderData: { items: CartItem[], total: number, shippingAddress: ShippingAddress }): Promise<Order> => {
    const orders = getStoredOrders();
    const newOrder: Order = {
        ...orderData,
        id: `ord_${Date.now()}`,
        date: new Date().toISOString(),
    };
    orders.push(newOrder);
    saveOrders(orders);
    return simulateDelay(newOrder);
}


// --- Combined/Search APIs ---

export const getProductsByVendorId = (vendorId: string): Promise<Product[]> => {
    const products = getStoredProducts().filter(p => p.vendorId === vendorId);
    return simulateDelay(products);
};

export const searchProducts = (query: string): Promise<Product[]> => {
    const lowercasedQuery = query.toLowerCase();
    if (!lowercasedQuery) {
        return simulateDelay([]);
    }
    const results = getStoredProducts().filter(product =>
        product.name.toLowerCase().includes(lowercasedQuery) ||
        product.description.toLowerCase().includes(lowercasedQuery) ||
        product.category.toLowerCase().includes(lowercasedQuery)
    );
    return simulateDelay(results);
};