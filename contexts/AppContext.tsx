'use client';
import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface User {
  id: string;
  uid?: string; // Firebase UID for Firestore integration
  name: string;
  email?: string;
  phone: string;
  gst: string;
  address: string;
  isRegistered: boolean;
  discount: number;
  displayName?: string;
  phoneNumber?: string;
}

import { Product } from '@/models/product';

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  gst: string;
  isDefault: boolean;
}

interface AppState {
  user: User | null;
  cart: CartItem[];
  addresses: Address[];
  products: Product[];
  brands: any[];
  wishlist: Product[];
  showRegistrationModal: boolean;
  isAdminLoggedIn: boolean;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_TO_CART'; payload: { product: Product; size: string; quantity?: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_ADDRESS'; payload: Address }
  | { type: 'SET_ADDRESSES'; payload: Address[] }
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'TOGGLE_REGISTRATION_MODAL'; payload?: boolean }
  | { type: 'SET_ADMIN_LOGIN'; payload: boolean }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<AppState> };

const initialState: AppState = {
  user: null,
  cart: [],
  addresses: [],
  products: [],
  brands: [
    { id: 'urja-wacchi', name: 'Urja & WACCHI', seasons: ['Summer', 'Winter'], image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400' },
    { id: 'lasoon', name: 'Lasoon', seasons: ['Winter'], image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400' },
    { id: 'radhika', name: 'Radhika', seasons: ['Winter'], image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400' },
    { id: 'jsur', name: 'Jsur', seasons: ['Winter'], image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400' },
    { id: 'avangard', name: 'Avangard', seasons: ['Winter', 'Summer'], image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
    { id: 'b-52', name: 'B-52', seasons: ['Winter'], image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=400' },
    { id: 'oakberry', name: 'Oakberry', seasons: ['Winter'], image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400' },
    { id: 'domex-club', name: 'Domex Club', seasons: ['Winter'], image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400' },
    { id: 'e-zinna', name: 'E Zinna', seasons: ['Winter'], image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400' },
    { id: 'belly-11', name: 'Belly-11', seasons: ['Winter'], image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400' },
    { id: 'miss-eney', name: 'Miss Eney', seasons: ['Winter'], image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400' },
    { id: 'princy', name: 'Princy', seasons: ['Winter'], image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400' },
    { id: 'pampara', name: 'Pampara', seasons: ['Winter'], image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400' },
    { id: '5-rivers', name: '5 Rivers', seasons: ['Winter'], image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400' },
    { id: 'yushiika', name: 'Yushiika', seasons: ['Summer', 'Winter'], image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400' },
    { id: 'amba-jee', name: 'Amba Jee', seasons: ['Winter'], image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400' },
    { id: 'anika', name: 'Anika', seasons: ['Winter'], image: 'https://images.unsplash.com/photo-1583743089695-4b816a340f82?w=400' },
    { id: 'soulwin', name: 'Soulwin', seasons: ['Winter'], image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400' },
    { id: 'cute-souls', name: 'Cute Souls', seasons: ['Winter'], image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400' },
    { id: 'yuvika-fashion', name: 'Yuvika Fashion', seasons: ['Winter'], image: 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=400' },
    { id: 'lady-zone', name: 'Lady Zone', seasons: ['Winter'], image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400' },
    { id: 'sweet-sister', name: 'Sweet Sister', seasons: ['Winter'], image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400' },
  { id: 'sweet-touch', name: 'Sweet Touch', seasons: ['Winter'], image: '/brands/sweettouch.png' },
  ],
  wishlist: [],
  showRegistrationModal: false,
  isAdminLoggedIn: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      if (state.wishlist.find(item => item.id === action.payload.id)) {
        return state;
      }
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, wishlist: state.wishlist.filter(item => item.id !== action.payload) };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_TO_CART': {
      const { product, size, quantity = 1 } = action.payload;
      const existingItem = state.cart.find(item => item.id === product.id && item.selectedSize === size);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === product.id && item.selectedSize === size
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...product, quantity, selectedSize: size }]
      };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => `${item.id}-${item.selectedSize}` !== action.payload) };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          `${item.id}-${item.selectedSize}` === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'ADD_ADDRESS':
      return { ...state, addresses: [...state.addresses, action.payload] };
    case 'SET_ADDRESSES':
      return { ...state, addresses: action.payload };
    case 'TOGGLE_REGISTRATION_MODAL':
      return { ...state, showRegistrationModal: action.payload ?? !state.showRegistrationModal };
    case 'SET_ADMIN_LOGIN':
      return { ...state, isAdminLoggedIn: action.payload };
    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    // Load data from localStorage
    const savedUser = localStorage.getItem('padmaisha_user');
    const savedCart = localStorage.getItem('padmaisha_cart');
    const savedAddresses = localStorage.getItem('padmaisha_addresses');
    const savedAdmin = localStorage.getItem('padmaisha_admin');
    const savedWishlist = localStorage.getItem('padmaisha_wishlist');

  const loadedData: Partial<AppState> = {};

    if (savedUser) {
      loadedData.user = JSON.parse(savedUser);
    }
    if (savedCart) {
      loadedData.cart = JSON.parse(savedCart);
    }
    if (savedAddresses) {
      loadedData.addresses = JSON.parse(savedAddresses);
    }
    if (savedAdmin) {
      loadedData.isAdminLoggedIn = JSON.parse(savedAdmin);
    }
    // Set products (client-side only)
    const generatedProducts = generateMockProducts();
    loadedData.products = generatedProducts;

    // Reconcile wishlist saved in localStorage with current generated products to ensure names/prices are up-to-date
    if (savedWishlist) {
      try {
        const parsed: Product[] = JSON.parse(savedWishlist);
        const reconciled = parsed.map((savedItem) => {
          const match = generatedProducts.find(p => p.id === savedItem.id);
          // If we have an up-to-date product, prefer it (preserve any user-specific fields if needed)
          return match ? { ...match } : savedItem;
        });
        loadedData.wishlist = reconciled;
      } catch (e) {
        loadedData.wishlist = JSON.parse(savedWishlist);
      }
    }

    dispatch({ type: 'LOAD_FROM_STORAGE', payload: loadedData });

    // Show registration modal after 2 seconds on every reload
    setTimeout(() => {
      dispatch({ type: 'TOGGLE_REGISTRATION_MODAL', payload: true });
    }, 2000);
  }, []);

  // --- Firebase Auth State Sync ---
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    let unsubscribe: (() => void) | undefined;
    (async () => {
      try {
        const { auth } = await import('../components/firebase/firebaseConfig');
        const { onAuthStateChanged } = await import('firebase/auth');
        unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            // Map Firebase user to AppContext User type (fill with defaults if needed)
            const userObj = {
              id: user.uid, // legacy code, keep for compatibility
              uid: user.uid, // always set Firebase UID
              name: user.displayName || user.email || 'User',
              email: user.email || '',
              phone: user.phoneNumber || '',
              gst: '',
              address: '',
              isRegistered: true,
              discount: 0,
              displayName: user.displayName || '',
              phoneNumber: user.phoneNumber || '',
            };
              dispatch({ type: 'SET_USER', payload: userObj });
          } else {
            // Set to guest user (or null if you want to force login)
              dispatch({ type: 'SET_USER', payload: null });
          }
        });
      } catch (e) {
        // fail silently
      }
    })();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Save to localStorage whenever state changes
    if (state.user) {
      localStorage.setItem('padmaisha_user', JSON.stringify(state.user));
    }
    localStorage.setItem('padmaisha_cart', JSON.stringify(state.cart));
    localStorage.setItem('padmaisha_addresses', JSON.stringify(state.addresses));
    localStorage.setItem('padmaisha_admin', JSON.stringify(state.isAdminLoggedIn));
    localStorage.setItem('padmaisha_wishlist', JSON.stringify(state.wishlist));
  }, [state.user, state.cart, state.addresses, state.isAdminLoggedIn, state.wishlist]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return {
    state: context.state,
    dispatch: context.dispatch,
    user: context.state.user, // Added user property for easier access
  };
};

const generateMockProducts = (): Product[] => {
  // Add Sweet Touch products from public/brands/sweettocuhproducts
  const sweetTouchProductImages = [
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.35.51.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.36.09.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.36.26.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.37.29.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.37.42.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.38.02.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.38.35.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.39.01.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.39.38.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.39.52.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.40.04.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.40.17.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.40.32.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.40.45.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.40.59.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.41.12.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.41.28.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.41.46.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.42.13.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.42.28.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.43.24.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 18.43.37.jpeg',
    '/brands/sweettocuhproducts/WhatsApp Image 2025-10-06 at 19.06.09.jpeg',
  ];

  const sweetTouchProducts: Product[] = sweetTouchProductImages.map((img, idx) => ({
    id: `sweet-touch-product-${idx+1}`,
    name: `Sweet Touch Product ${idx+1}`,
    price: 1099 + idx * 30,
    originalPrice: 1399 + idx * 30,
    image: img,
    brand: 'Sweet Touch',
    category: 'All Products',
    color: 'Multi',
    sizes: ['M', 'L', 'XL', 'XXL'],
    description: 'Premium quality product from Sweet Touch. Perfect for retailers looking for high-quality fashion pieces.',
    season: 'Winter',
  }));
  // Add Soulwin Top products from public/brands/soulwintop
  const soulwinTopImages = [
    '/brands/soulwintop/WhatsApp Image 2025-09-12 at 15.21.14.jpeg',
    '/brands/soulwintop/WhatsApp Image 2025-09-12 at 15.22.18.jpeg',
    '/brands/soulwintop/WhatsApp Image 2025-09-12 at 15.22.19.jpeg',
    '/brands/soulwintop/WhatsApp Image 2025-09-12 at 15.22.20 (1).jpeg',
    '/brands/soulwintop/WhatsApp Image 2025-09-12 at 15.22.20.jpeg',
    '/brands/soulwintop/WhatsApp Image 2025-09-12 at 15.22.21.jpeg',
  ];

  const soulwinTopProducts: Product[] = soulwinTopImages.map((img, idx) => ({
    id: `soulwin-top-${idx+1}`,
    name: `Soulwin Top ${idx+1}`,
    price: 1199 + idx * 40,
    originalPrice: 1499 + idx * 40,
    image: img,
    brand: 'Soulwin',
    category: 'Top',
    color: 'Multi',
    sizes: ['M', 'L', 'XL', 'XXL'],
    description: 'Premium quality Top from Soulwin. Perfect for retailers looking for high-quality fashion pieces.',
    season: 'Winter',
  }));
  // Add Soulwin Cardigan products from public/brands/soulwincardig
  const soulwinCardiganImages = [
    '/brands/soulwincardig/WhatsApp Image 2025-09-12 at 15.20.21.jpeg',
    '/brands/soulwincardig/WhatsApp Image 2025-09-12 at 15.20.22 (1).jpeg',
    '/brands/soulwincardig/WhatsApp Image 2025-09-12 at 15.20.22.jpeg',
  ];

  const soulwinCardiganProducts: Product[] = soulwinCardiganImages.map((img, idx) => ({
    id: `soulwin-cardigan-${idx+1}`,
    name: `Soulwin Cardigan ${idx+1}`,
    price: 1399 + idx * 60,
    originalPrice: 1699 + idx * 60,
    image: img,
    brand: 'Soulwin',
    category: 'Cardigan',
    color: 'Multi',
    sizes: ['M', 'L', 'XL', 'XXL'],
    description: 'Premium quality Cardigan from Soulwin. Perfect for retailers looking for high-quality fashion pieces.',
    season: 'Winter',
  }));
  // Only show these categories
  const categories = ['All Products', 'Cordset', 'Cardigan', 'Kurti', 'Top', 'Lower'];
  const colors = ['Black', 'White', 'Navy', 'Gray', 'Beige', 'Red', 'Blue'];
  const sizes = ['Free Size', 'M', 'L', 'XL', 'XXL', '3XL'];
  const brands = [
    'Urja & Wacchi', 'Lasoon', 'Amba Jee', 'Soulwin', 'Yuvika Fashion', 'Sweet Sister'
  ];

    // Add Amba Jee Kurti products from public/brands/ambajeekurti
    const ambaJeeKurtiImages = [
      '/brands/ambajeekurti/WhatsApp Image 2025-09-15 at 16.03.38.jpeg',
      '/brands/ambajeekurti/WhatsApp Image 2025-09-15 at 16.03.49.jpeg',
      '/brands/ambajeekurti/WhatsApp Image 2025-09-15 at 16.04.31.jpeg',
      '/brands/ambajeekurti/WhatsApp Image 2025-09-15 at 16.04.41.jpeg',
      '/brands/ambajeekurti/WhatsApp Image 2025-09-15 at 16.05.04.jpeg',
      '/brands/ambajeekurti/WhatsApp Image 2025-09-15 at 19.35.10.jpeg',
    ];

    const ambaJeeKurtiProducts: Product[] = ambaJeeKurtiImages.map((img, idx) => ({
      id: `amba-jee-kurti-${idx+1}`,
      name: `Amba Jee Kurti ${idx+1}`,
      price: 1299 + idx * 50,
      originalPrice: 1599 + idx * 50,
      image: img,
      brand: 'Amba Jee',
      category: 'Kurti',
      color: 'Multi',
      sizes: ['M', 'L', 'XL', 'XXL'],
      description: 'Premium quality Kurti from Amba Jee. Perfect for retailers looking for high-quality fashion pieces.',
      season: 'Winter',
    }));

  // Use actual images from public/product-images
  const actualImages = [
    '/product-images/WhatsApp Image 2025-09-16 at 15.32.58.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 15.34.39.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 15.35.34.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 15.36.15.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 15.37.01.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 15.38.55.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 18.37.02.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 18.47.23.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 18.52.53.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 18.58.50.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 19.03.07.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 19.07.53.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 19.15.54.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 19.20.48.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 19.24.52.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 19.29.04.jpeg',
    '/product-images/WhatsApp Image 2025-09-25 at 18.31.21.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 10.48.12.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 11.00.28.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 11.05.27.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 11.12.54.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 11.15.54.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 11.18.29.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 11.24.05.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 11.26.23.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 11.36.51.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 11.40.45.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 11.44.20.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 12.10.45.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 12.20.16.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 12.25.52.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 12.27.49.jpeg',
  ];

  const products: Product[] = [];
  const usedIds = new Set<string>();
  brands.forEach((brand, brandIndex) => {
    for (let i = 0; i < 12; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const originalPrice = Math.floor(Math.random() * 2000) + 1000;
      const discount = Math.floor(Math.random() * 40) + 10;
      const price = Math.floor(originalPrice * (1 - discount / 100));
      const slug = brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      let id = `${slug}-${i + 1}`;
      // Ensure unique key
      while (usedIds.has(id)) {
        id = `${slug}-${i + 1}-${Math.random().toString(36).substring(2, 8)}`;
      }
      usedIds.add(id);
      products.push({
        id,
  name: `${brand} ${category} - ${color}`,
  // mark that this name was autogenerated so we can recompute after canonicalization
  ...( { __autoName: true } as any ),
        price,
        originalPrice,
        image: actualImages[(brandIndex * 12 + i) % actualImages.length],
        brand,
        category,
        color,
        sizes: sizes.slice(Math.floor(Math.random() * 3), Math.floor(Math.random() * 3) + 4),
        description: `Premium quality ${category.toLowerCase()} from ${brand}. Perfect for retailers looking for high-quality fashion pieces.`,
        season: Math.random() > 0.5 ? 'Winter' : 'Summer'
      });
    }
  });

  // Add Amba Jee Kurti products to the products array
  products.push(...ambaJeeKurtiProducts);
  // Also include additional brand folders (amba jee singe kurti & urja wachi cardi)
  const ambaJeeSingeImages = [
    '/brands/amba jee singe kurti/WhatsApp Image 2025-09-15 at 16.05.50.jpeg',
    '/brands/amba jee singe kurti/WhatsApp Image 2025-09-15 at 16.05.58.jpeg',
    '/brands/amba jee singe kurti/WhatsApp Image 2025-09-15 at 16.08.04.jpeg',
    '/brands/amba jee singe kurti/WhatsApp Image 2025-09-15 at 16.12.51.jpeg',
    '/brands/amba jee singe kurti/WhatsApp Image 2025-09-15 at 19.34.31.jpeg',
    '/brands/amba jee singe kurti/WhatsApp Image 2025-09-15 at 19.35.10.jpeg',
    '/brands/amba jee singe kurti/WhatsApp Image 2025-09-15 at 19.38.38.jpeg',
    '/brands/amba jee singe kurti/WhatsApp Image 2025-09-15 at 19.50.46.jpeg',
    '/brands/amba jee singe kurti/WhatsApp Image 2025-09-15 at 19.55.20.jpeg',
    '/brands/amba jee singe kurti/WhatsApp Image 2025-09-15 at 19.59.36.jpeg',
  ];
  const ambaSingeProducts = ambaJeeSingeImages.map((img, idx) => ({
    id: `amba-jee-singe-${idx+1}`,
    name: `Amba Jee Singe Kurti ${idx+1}`,
    price: 999 + idx * 10,
    originalPrice: 1299 + idx * 10,
    image: img,
    brand: 'Amba Jee Singe Kurti',
    category: 'Kurti',
    color: 'Multi',
    sizes: ['M','L'],
    description: 'Imported from brands folder.'
  }));
  products.push(...ambaSingeProducts);

  const urjaWachiImages = [
    '/brands/urja wachi cardi/WhatsApp Image 2025-09-17 at 19.00.41.jpeg',
    '/brands/urja wachi cardi/WhatsApp Image 2025-09-17 at 19.36.44.jpeg',
    '/brands/urja wachi cardi/WhatsApp Image 2025-09-17 at 19.43.46.jpeg',
    '/brands/urja wachi cardi/WhatsApp Image 2025-09-18 at 18.28.32.jpeg',
    '/brands/urja wachi cardi/WhatsApp Image 2025-09-18 at 18.33.02.jpeg',
    '/brands/urja wachi cardi/WhatsApp Image 2025-09-18 at 18.37.51.jpeg',
    '/brands/urja wachi cardi/WhatsApp Image 2025-09-18 at 18.50.31.jpeg',
    '/brands/urja wachi cardi/WhatsApp Image 2025-09-18 at 18.55.27.jpeg',
  ];
  const urjaWachiProducts = urjaWachiImages.map((img, idx) => ({
    id: `urja-wachi-cardi-${idx+1}`,
    name: `Urja Wachi Cardi ${idx+1}`,
    price: 1099 + idx * 20,
    originalPrice: 1399 + idx * 20,
    image: img,
    brand: 'Urja Wachi Cardi',
    category: 'Cardigan',
    color: 'Multi',
    sizes: ['L','XL'],
    description: 'Imported from brands folder.'
  }));
  products.push(...urjaWachiProducts);
  products.push(...soulwinCardiganProducts);
  products.push(...soulwinTopProducts);
  products.push(...sweetTouchProducts);

  // Add Sweet Sister products from public/brands/sweetsister2 (user attachment)
  const sweetsister2Images = [
    '/brands/sweetsister2/123.jpeg',
    '/brands/sweetsister2/WhatsApp Image 2025-10-22 at 13.58.10.jpeg',
    '/brands/sweetsister2/WhatsApp Image 2025-10-22 at 13.58.11.jpeg',
    '/brands/sweetsister2/WhatsApp Image 2025-10-22 at 13.58.12.jpeg',
    '/brands/sweetsister2/WhatsApp Image 2025-10-22 at 13.58.13.jpeg',
  ];
  const sweetsister2Products: Product[] = sweetsister2Images.map((img, idx) => ({
    id: `sweetsister2-${idx+1}`,
    // User requested these be labeled Product 1..Product 5 so you can fill details later
  name: `Product ${idx+1}`,
  price: 0,
  originalPrice: 0,
  image: img,
  brand: 'Sweet Sister',
  category: 'All Products',
  color: 'Multi',
  sizes: ['Free Size'],
  description: 'Details to be filled by user.',
  season: 'Winter',
  }));
  products.push(...sweetsister2Products);

  // --- Apply manual updates provided by user (keep image order)
  // Mapping: 1-based product index -> details
  const manualUpdates: Record<number, Partial<Product> & { sizesText?: string, note?:string}> = {
    1: { name: 'Ladies Mehndi Green Woolen Co Ord Set', price: 1690, sizes: ['Free Size'] },
    2: { name: 'Ladies Blue Woolen Co Ord Set', price: 1640, sizes: ['Free Size'] },
    3: { name: 'Ladies Black Woolen Co Ord Set', price: 1690, sizes: ['Free Size'] },
    4: { name: 'Ladies Dark Grey Woolen Co Ord Set', price: 1690, sizes: ['Free Size'] },
    5: { name: 'Ladies Rich Black Cotton Co Ord Set', price: 1690, sizes: ['Free Size'] },
    6: { name: 'Ladies Wine Woolen Co Ord Set', price: 1690, sizes: ['Free Size'] },
    7: { name: 'Ladies Woolen Ash Grey Top', price: 1010, sizes: ['Free Size'] },
    8: { name: 'Ladies Woolen True Black Top', price: 1010, sizes: ['Free Size'] },
    9: { name: 'Ladies Woolen Parrot Green Top', price: 900, sizes: ['Free Size'] },
    10: { name: 'Ladies Woolen Brown Top', price: 674, sizes: ['Free Size'] },
    11: { name: 'Ladies Woolen Lavender Top', price: 900, sizes: ['Free Size'] },
    12: { name: 'Ladies Woolen Sea Blue Top', price: 900, sizes: ['Free Size'] },
    13: { name: 'Ladies Woolen Neon Top', price: 900, sizes: ['Free Size'] },
    14: { name: 'Ladies Woolen Smoke Grey Top', price: 900, sizes: ['Free Size'] },
    15: { name: 'Ladies Woolen Light Grey Top', price: 1010, sizes: ['Free Size'] },
    16: { name: 'Ladies Woolen Rich Black Top', price: 445, sizes: ['Free Size'] },
    17: { name: 'Ladies Woolen Black Top', price: 570, sizes: ['Free Size'] },
    18: { name: 'Ladies Woolen Pastel Peach Top', price: 770, sizes: ['Free Size'] },
    19: { name: 'Ladies Woolen Camel Top', price: 700, sizes: ['Free Size'] },
    20: { name: 'Ladies Woolen Beige Top', price: 790, sizes: ['Free Size'] },
    21: { name: 'Ladies Woolen Cloud Grey Top', price: 830, sizes: ['Free Size'] },
    22: { name: 'Ladies Woolen Red Top', price: 608, sizes: ['Free Size'] },
    23: { name: 'Ladies Woolen True White Top', price: 800, sizes: ['Free Size'] },
    24: { name: 'Ladies Woolen Peach Top', price: 700, sizes: ['Free Size'] },
    25: { name: 'Ladies Woolen Mustard Top', price: 770, sizes: ['Free Size'] },
    26: { name: 'Ladies Woolen Blue Top', price: 700, sizes: ['Free Size'] },
    27: { name: 'Ladies Woolen Yellow Top', price: 700, sizes: ['Free Size'] },
    28: { name: 'Ladies Woolen Top', price: 680, sizes: ['Free Size'] },
    29: { name: 'Ladies Woolen Pista Green Top', price: 770, sizes: ['Free Size'] },
    31: { name: 'Ladies Woolen Purple Top', price: 700, sizes: ['Free Size'] },
    32: { name: 'Ladies Woolen Cool Grey Top', price: 770, sizes: ['Free Size'] },
    // 33-72 marked as duplicates to delete (handled later)
    73: { name: 'Ladies Woolen Purple Kurti Pant Set', price: 855, sizes: ['XL','2XL','3XL'], note: 'set' },
    74: { name: 'Ladies Woolen Brown Kurti Pant Set', price: 855, sizes: ['XL','2XL','3XL'], note: 'set' },
    75: { name: 'Ladies Woolen Green Kurti Pant Set', price: 855, sizes: ['XL','2XL','3XL'], note: 'set' },
    76: { name: 'Ladies Woolen Blue Kurti Pant Set', price: 855, sizes: ['XL','2XL','3XL'], note: 'set' },
    77: { name: 'Ladies Woolen Brown Kurti Pant Set', price: 855, sizes: ['XL','2XL','3XL'], note: 'set' },
    78: { name: 'Ladies Woolen Black Kurti', price: 430, sizes: ['L','XL','2XL','3XL'] },
    // 79 & 80 duplicates - will delete
    81: { name: 'Ladies Woolen Orange Kurti Pant Set', price: 855, sizes: ['XL','2XL','3XL','4XL'], note: 'set' },
    82: { name: 'Ladies Woolen Maroon Kurti Pant Set', price: 855, sizes: ['XL','2XL','3XL','4XL'], note: 'set' },
    83: { name: 'Ladies Woolen Brown Kurti', price: 430, sizes: ['L','XL','2XL','3XL'] },
    84: { name: 'Ladies Woolen Black Kurti', price: 430, sizes: ['L','XL','2XL','3XL'] },
    85: { name: 'Ladies Woolen Sky Blue Kurti', price: 430, sizes: ['L','XL','2XL','3XL'] },
    86: { name: 'Ladies Woolen Baby Pink Kurti', price: 430, sizes: ['L','XL','2XL','3XL'] },
    87: { name: 'Ladies Woolen Royal Blue Kurti', price: 430, sizes: ['L','XL','2XL','3XL'] },
    88: { name: 'Ladies Woolen Mustard Kurti', price: 430, sizes: ['L','XL','2XL','3XL'] },
    89: { name: 'Ladies Beige Cotton Co Ord Set', price: 1960, sizes: ['L','XL','2XL','3XL'] },
    90: { name: 'Ladies Green Woolen Cardigan', price: 1150, sizes: ['L','XL','2XL','3XL'] },
    91: { name: 'Ladies Black Woolen Cardigan', price: 1200, sizes: ['L','XL','2XL','3XL'] },
    92: { name: 'Ladies Cream Woolen Cardigan', price: 1200, sizes: ['L','XL','2XL','3XL'] },
    93: { name: 'Ladies Grey Woolen Cardigan', price: 1200, sizes: ['L','XL','2XL','3XL'] },
    94: { name: 'Ladies Rich Black Woolen Cardigan', price: 1150, sizes: ['L','XL','2XL','3XL'] },
    95: { name: 'Ladies Brown Woolen Cardigan', price: 635, sizes: ['L','XL','2XL','3XL'] },
    96: { name: 'Ladies Beige Woolen Cardigan', price: 1220, sizes: ['L','XL','2XL','3XL'] },
    97: { name: 'Ladies Soulwin Brown Woolen Cardigan', price: 460, sizes: ['Box (6 pcs)'], note: 'MOQ 1 box (6 pcs)' },
    98: { name: 'Ladies Soulwin Sea Green Woolen Cardigan', price: 460, sizes: ['Box (6 pcs)'], note: 'MOQ 1 box (6 pcs)' },
    99: { name: 'Ladies Soulwin Red Woolen Cardigan', price: 460, sizes: ['Box (6 pcs)'], note: 'MOQ 1 box (6 pcs)' },
    100: { name: 'Ladies Soulwin Phone Woolen Cardigan', price: 1130, sizes: ['Box (6 pcs)'], note: 'MOQ 1 box (6 pcs)' },
    101: { name: 'Ladies Soulwin Green Woolen Cardigan', price: 1130, sizes: ['Box (6 pcs)'], note: 'MOQ 1 box (6 pcs)' },
    102: { name: 'Ladies Soulwin Brown Woolen Top', price: 600, sizes: ['Box (6 pcs)'], note: 'MOQ 1 box (6 pcs)' },
    103: { name: 'Ladies Soulwin Brown Woolen Top (dup)', price: 600, sizes: ['Box (6 pcs)'], note: 'duplicate keep first' },
    104: { name: 'Ladies Soulwin Brown&White Woolen Top', price: 600, sizes: ['Box (6 pcs)'], note: 'MOQ 1 box (6 pcs)' },
    105: { name: 'Ladies Soulwin White Woolen Top', price: 600, sizes: ['Box (6 pcs)'], note: 'MOQ 1 box (6 pcs)' },
    106: { name: 'Ladies Sweet Touch Green Woolen Long Kurti', price: 650, sizes: ['L','XL','2XL'], note: 'MOQ 1 box (4 pcs)' },
    107: { name: 'Ladies Sweet Touch Green Woolen Night Suit', price: 680, sizes: ['L','XL','2XL'], note: 'MOQ 1 box (4 pcs)' },
    108: { name: 'Ladies Sweet Touch Pink Woolen Cord Set', price: 1020, sizes: ['L','XL','2XL'], note: 'MOQ 1 box (3 pcs)' },
    109: { name: 'Ladies Woolen Maroon Long Top', price: 310, sizes: ['L','XL','2XL'], note: 'MOQ 1 box (12 pcs)' },
    110: { name: 'Ladies Woolen Gray Long Top', price: 310, sizes: ['L','XL','2XL'], note: 'MOQ 1 box (12 pcs)' },
    111: { name: 'Ladies Woolen Pink Long Top', price: 310, sizes: ['L','XL','2XL'], note: 'MOQ 1 box (12 pcs)' },
    112: { name: 'Ladies Sea Green Cotton Co Ord Set', price: 775, sizes: ['L','XL','2XL'], note: 'MOQ 1 box (3 pcs)' },
    113: { name: 'Ladies Woolen Dark Blue Kurti', price: 650, sizes: ['L','XL','2XL'], note: 'MOQ 1 box (3 pcs)' },
    114: { name: 'Ladies Woolen Maroon Tracksuit', price: 1200, sizes: ['L','XL','2XL'], note: 'MOQ 1 box (3 pcs)' },
    115: { name: 'Ladies Woolen Blue Tracksuit', price: 1200, sizes: ['L','XL','2XL'], note: 'MOQ 1 box (3 pcs)' },
    116: { name: 'Ladies Woolen Black Tracksuit', price: 1200, sizes: ['L','XL','2XL'], note: 'MOQ 1 box (3 pcs)' },
    117: { name: 'Ladies Purple Cotton Co Ord Set', price: 845, sizes: ['L','XL','2XL'], note: 'MOQ 1 box (3 pcs)' },
    118: { name: 'Ladies Tuscan Beige Cotton Co Ord Set', price: 845, sizes: ['L','XL','2XL'], note: 'MOQ 1 box (3 pcs)' },
    119: { name: 'Ladies Woolen Navy Blue Long Top', price: 310, sizes: ['L','XL','2XL'], note: 'MOQ 1 box (3 pcs)' },
    120: { name: 'Ladies Woolen Blue Long Top', price: 310, sizes: ['L','XL','2XL'], note: 'MOQ 1 box (3 pcs)' },
    121: { name: 'Ladies Woolen Black Long Top', price: 310, sizes: ['L','XL','2XL'], note: 'MOQ 1 box (3 pcs)' },
    122: { name: 'Ladies Woolen Dark Blue Lower', price: 420, sizes: ['Box (6 pcs)'], note: 'MOQ 1 box (6 pcs)' },
    123: { name: 'Ladies Woolen Green Lower', price: 420, sizes: ['Box (6 pcs)'], note: 'MOQ 1 box (6 pcs)' },
    124: { name: 'Ladies Woolen Grey Lower', price: 420, sizes: ['Box (6 pcs)'], note: 'MOQ 1 box (6 pcs)' },
    125: { name: 'Ladies Woolen Black Lower', price: 585, sizes: ['Box (6 pcs)'], note: 'MOQ 1 box (6 pcs)' },
    126: { name: 'Ladies Woolen Black Lower (dup)', price: 585, sizes: ['Box (6 pcs)'], note: 'duplicate' },
    127: { name: 'Ladies Woolen Sea Blue Lowers', price: 585, sizes: ['Box (6 pcs)'], note: 'MOQ 1 box (6 pcs)' },
    128: { name: 'Ladies Woolen Tawny Brown Kurti', price: 650, sizes: ['L','XL','2XL'], note: 'MOQ 1 box (3 pcs)' },
  };

  // Apply updates to products by original index (1-based)
  for (let idx = 0; idx < products.length; idx++) {
    const oneBased = idx + 1;
    const upd = manualUpdates[oneBased];
    if (upd) {
  // mark product as manually updated so we don't overwrite name later
  (products[idx] as any).__autoName = false;
      if (upd.name) products[idx].name = upd.name;
      if (typeof upd.price === 'number') {
        products[idx].price = upd.price;
        // keep originalPrice slightly higher if not provided
        products[idx].originalPrice = Math.max(products[idx].originalPrice || products[idx].price, Math.round(upd.price * 1.2));
      }
      if (upd.sizes) products[idx].sizes = upd.sizes as any;
      if (upd.note) products[idx].description = (products[idx].description || '') + ' | ' + upd.note;
    }
  }

  // Assign brands according to user-provided ranges (based on original product numbers)
  const brandRanges: { start: number; end: number; brand: string }[] = [
    { start: 1, end: 17, brand: 'Lasoon' },
    { start: 18, end: 32, brand: 'Moody shoody tops' },
    { start: 73, end: 88, brand: 'Amba Jee' },
    { start: 89, end: 96, brand: 'Urja & Wacchi' },
    { start: 97, end: 105, brand: 'Soulwin' },
    { start: 106, end: 128, brand: 'Sweet Touch' },
  ];

  for (const range of brandRanges) {
    for (let i = range.start; i <= range.end; i++) {
      const idx = i - 1; // zero-based
      if (idx >= 0 && idx < products.length) {
        products[idx].brand = range.brand;
      }
    }
  }

  // Remove duplicates: Products 33..72 and 79..80 (1-based). Keep first occurrence; delete later ones.
  const toDeleteSet = new Set<number>();
  for (let i = 33; i <= 72; i++) toDeleteSet.add(i);
  toDeleteSet.add(79);
  toDeleteSet.add(80);

  // Build new array keeping items not in toDeleteSet
  const finalProducts: Product[] = [];
  for (let i = 0; i < products.length; i++) {
    const oneBased = i + 1;
    if (toDeleteSet.has(oneBased)) continue; // drop duplicates
    finalProducts.push(products[i]);
  }

  // Normalize / canonicalize category names so the UI filters match product categories reliably
  const canonicalizeCategory = (raw?: string) => {
    const n = String(raw || '').trim().toLowerCase();
    if (!n) return 'All Products';
    if (n.includes('kurti')) return 'Kurti';
  if (n.includes('tracksuit') || n.includes('track suit') || n.includes('track-suit')) return 'Tracksuit';
    if (n.includes('cardigan')) return 'Cardigan';
    if (n.includes('cord') || n.includes('co ord') || n.includes('co-ord') || n.includes('co ordset') || n.includes('co ord set')) return 'Cordset';
    if (n.includes('lower') || n.includes('pant') || n.includes('bottom') || n.includes('loweres') ) return 'Lower';
    if (n.includes('top')) return 'Top';
    if (n.includes('all')) return 'All Products';
    return raw || 'All Products';
  };

  finalProducts.forEach(p => {
    try {
      p.category = canonicalizeCategory(p.category);
    } catch (e) {
      // ignore
    }
  });

  // Canonicalize brand, color and sizes to match UI filter lists
  const canonicalizeBrand = (raw?: string) => {
    const n = String(raw || '').trim().toLowerCase();
    if (!n) return '';
    if (n.includes('lasoon') || n.includes('lasoon')) return 'Lasoon';
    if (n.includes('yushi') || n.includes('yushi') || n.includes('yush') || n.includes('yushiika') ) return 'Moody shoody tops';
    if (n.includes('amba') || n.includes('amba jee')) return 'Amba Jee';
    if (n.includes('urja') || n.includes('wacchi') || n.includes('urja & wacchi') || n.includes('urja wachi')) return 'Urja & Wacchi';
  if (n.includes('soulwin') || n.includes('soul')) return 'Soulwin';
  if (n.includes('sweet sister') || n.includes('sweet-sister') || n.includes('sweetsister')) return 'Sweet Sister';
  if (n.includes('sweet') || n.includes('sweettouch') || n.includes('sweet touch')) return 'Sweet Touch';
    // Fallback: capitalize words
    return String(raw || '');
  };

  const canonicalizeColor = (raw?: string) => {
    const n = String(raw || '').trim().toLowerCase();
    if (!n) return 'Multi';
    if (n.includes('blue')) return 'Blue';
    if (n.includes('navy')) return 'Navy';
    if (n.includes('red')) return 'Red';
    if (n.includes('white')) return 'White';
    if (n.includes('beige')) return 'Beige';
    if (n.includes('gray') || n.includes('grey')) return 'Gray';
    if (n.includes('black')) return 'Black';
    return 'Multi';
  };

  const canonicalizeSizesArray = (arr?: any[]) => {
    if (!Array.isArray(arr)) return [];
    return arr.map(s => {
      const t = String(s || '').trim().toLowerCase();
      if (!t) return '';
      if (t === 'free size' || t === 'free') return 'Free Size';
      if (t === 'm') return 'M';
      if (t === 'l') return 'L';
      if (t === 'xl') return 'XL';
      if (t === 'xxl' || t === '2xl') return '2XL';
      if (t === '3xl' || t === 'xxxl') return '3XL';
      if (t === '4xl') return '4XL';
      if (t.includes('box') || t.includes('moq')) return 'Box (6 pcs)';
      // fallback: uppercase
      return String(s).toUpperCase();
    }).filter(Boolean);
  };

  finalProducts.forEach(p => {
    try {
      p.brand = canonicalizeBrand(p.brand);
      p.color = canonicalizeColor(p.color);
      p.sizes = canonicalizeSizesArray(p.sizes);
    } catch (e) {
      // ignore
    }
  });

  // Recompute autogenerated product names after canonicalization to keep name/category consistent
  finalProducts.forEach(p => {
    try {
      if ((p as any).__autoName) {
        const brandPart = String(p.brand || '').trim();
        const catPart = String(p.category || '').trim();
        const colorPart = String(p.color || '').trim();
        p.name = `${brandPart} ${catPart} - ${colorPart}`.trim();
      }
    } catch (e) {}
  });

  // Now return the cleaned product list (image order preserved)
  // Update first five Sweet Sister products with user-provided details (preserve image order)
  const sweetSisterDetails = [
    { name: 'Ladies Sweet Sister Woolen Plazo', price: 745, sizes: ['L','XL','2XL'], note: 'MOQ: 3 piece in one box' },
    { name: 'Ladies Sweet Sister Woolen Cord Set', price: 1285, sizes: ['L','XL','2XL'], note: 'MOQ: 3 piece in one box' },
    { name: 'Ladies Sweet Sister Woolen Cord Set', price: 1285, sizes: ['L','XL','2XL'], note: 'MOQ: 3 piece in one box' },
    { name: 'Ladies Sweet Sister Woolen Plazo', price: 745, sizes: ['L','XL','2XL'], note: 'MOQ: 3 piece in one box' },
    { name: 'Ladies Sweet Sister Woolen Plazo', price: 745, sizes: ['L','XL','2XL'], note: 'MOQ: 3 piece in one box' },
  ];

  let updatedCount = 0;
  for (let i = 0; i < finalProducts.length && updatedCount < sweetSisterDetails.length; i++) {
    const p = finalProducts[i];
    if (String(p.brand || '').toLowerCase() === 'sweet sister') {
      const det = sweetSisterDetails[updatedCount];
      p.name = det.name;
      p.price = det.price;
      p.originalPrice = Math.max(p.originalPrice || det.price, Math.round(det.price * 1.2));
      p.sizes = det.sizes as any;
      p.description = (p.description || '') + ' | ' + det.note;
      updatedCount++;
    }
  }

  return finalProducts;
};