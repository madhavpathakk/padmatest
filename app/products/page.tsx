'use client';
import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
// removed admin duplicate removal imports
import { Product } from '@/models/product';

// Admin duplicate removal removed per request

const ProductsPage = () => {

  // Static product list from folders
  const ambaJeeImages = [
    'WhatsApp Image 2025-09-15 at 16.05.50.jpeg',
    'WhatsApp Image 2025-09-15 at 16.05.58.jpeg',
    'WhatsApp Image 2025-09-15 at 16.08.04.jpeg',
    'WhatsApp Image 2025-09-15 at 16.12.51.jpeg',
    'WhatsApp Image 2025-09-15 at 19.34.31.jpeg',
    'WhatsApp Image 2025-09-15 at 19.35.10.jpeg',
    'WhatsApp Image 2025-09-15 at 19.38.38.jpeg',
    'WhatsApp Image 2025-09-15 at 19.50.46.jpeg',
    'WhatsApp Image 2025-09-15 at 19.55.20.jpeg',
    'WhatsApp Image 2025-09-15 at 19.59.36.jpeg',
  ];
  const urjaWachiImages = [
    'WhatsApp Image 2025-09-17 at 19.00.41.jpeg',
    'WhatsApp Image 2025-09-17 at 19.36.44.jpeg',
    'WhatsApp Image 2025-09-17 at 19.43.46.jpeg',
    'WhatsApp Image 2025-09-18 at 18.28.32.jpeg',
    'WhatsApp Image 2025-09-18 at 18.33.02.jpeg',
    'WhatsApp Image 2025-09-18 at 18.37.51.jpeg',
    'WhatsApp Image 2025-09-18 at 18.50.31.jpeg',
    'WhatsApp Image 2025-09-18 at 18.55.27.jpeg',
  ];
  const staticProducts = [
    ...ambaJeeImages.map((img, i) => ({
      id: `amba-jee-${i+1}`,
      name: `Amba Jee Kurti ${i+1}`,
      brand: 'Amba Jee Singe Kurti',
      image: `/brands/amba jee singe kurti/${img}`,
      price: 999,
      originalPrice: 1299,
      sizes: ['M', 'L'],
      category: 'Kurti',
      color: 'Multi',
    })),
    ...urjaWachiImages.map((img, i) => ({
      id: `urja-wachi-${i+1}`,
      name: `Urja Wachi Cardi ${i+1}`,
      brand: 'Urja Wachi Cardi',
      image: `/brands/urja wachi cardi/${img}`,
      price: 1099,
      originalPrice: 1499,
      sizes: ['L', 'XL'],
      category: 'Cardigan',
      color: 'Multi',
    })),
  ];

  // Use products from AppContext when available (restore full product set & filters).
  // Fallback to the small static list while state.products is not yet loaded on first render.
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [filters, setFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    colors: [] as string[],
    sizes: [] as string[],
    priceRange: { min: 0, max: 10000 },
    discount: [] as string[]
  });
  const { state } = useApp();

  // productsArr should use AppContext products when available (restore full product set & filters)
  const productsArr = (state.products && state.products.length > 0) ? state.products : staticProducts;
  // Use fixed category list to avoid mismatches and keep desired order
  const categories = ['Top', 'All Products', 'Lower', 'Cardigan', 'Cordset', 'Kurti', 'Tracksuit'];
  // Fixed filter lists (order matters for UI)
  const brands = ['Lasoon', 'Moody shoody tops', 'Amba Jee', 'Urja & Wacchi', 'Soulwin', 'Sweet Touch', 'Sweet Sister'];
  const colors = ['Blue', 'Navy', 'Red', 'White', 'Beige', 'Gray', 'Black', 'Multi'];
  const sizes = ['Free Size', 'M', 'L', 'XL', '2XL', '3XL', '4XL', 'Box (6 pcs)'];

  const normalize = (s: string) => String(s || '').trim().toLowerCase();

  const canonicalizeCategoryLocal = (raw?: string) => {
    const n = String(raw || '').trim().toLowerCase();
    if (!n) return 'All Products';
    if (n.includes('kurti')) return 'Kurti';
    if (n.includes('tracksuit') || n.includes('track suit') || n.includes('track-suit')) return 'Tracksuit';
    if (n.includes('cardigan')) return 'Cardigan';
    if (n.includes('cord') || n.includes('co ord') || n.includes('co-ord') || n.includes('co ordset') || n.includes('co ord set')) return 'Cordset';
    if (n.includes('lower') || n.includes('pant') || n.includes('bottom') || n.includes('loweres') ) return 'Lower';
    if (n.includes('top')) return 'Top';
    if (n.includes('all')) return 'All Products';
    // fallback: try to deduce from name if raw looked like a name
    return raw || 'All Products';
  };

  const handleFilterChange = (type: string, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [type]: checked ? [...(prev[type as keyof typeof prev] as string[]), value] : (prev[type as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      colors: [],
      sizes: [],
      priceRange: { min: 0, max: 10000 },
      discount: []
    });
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...productsArr];

  if (filters.categories.length > 0) filtered = filtered.filter(p => {
    const prodCat = canonicalizeCategoryLocal(p.category || p.name);
    return filters.categories.some(fc => normalize(fc) === normalize(prodCat));
  });
  if (filters.brands.length > 0) filtered = filtered.filter(p => filters.brands.some(fb => normalize(fb) === normalize(p.brand || '')));
  if (filters.colors.length > 0) filtered = filtered.filter(p => filters.colors.some(fc => normalize(fc) === normalize(p.color || '')));
  if (filters.sizes.length > 0) filtered = filtered.filter(p => (p.sizes || []).some(s => filters.sizes.includes(s)));
    filtered = filtered.filter(p => p.price >= (filters.priceRange.min || 0) && p.price <= (filters.priceRange.max || 10000));

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a,b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a,b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a,b) => a.name.localeCompare(b.name));
        break;
      default:
        // popularity/manual/newest - keep as is
        break;
    }

    return filtered;
  }, [productsArr, filters, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
  <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 bg-white rounded-lg shadow-sm p-6 h-fit`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="outline" size="sm" onClick={clearAllFilters}>CLEAR ALL</Button>
              </div>
              <div className="lg:hidden">
                <Button variant="ghost" onClick={() => setShowFilters(false)} aria-label="Close filters" className="p-2">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Collapsible defaultOpen>
              <div className="flex items-center justify-between w-full py-3 border-b">
                <span className="font-medium">Categories</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="py-3 space-y-3">
                {categories.map(c => (
                  <div key={c} className="flex items-center space-x-2">
                    <Checkbox id={String(c || '')} checked={filters.categories.includes(String(c || ''))} onCheckedChange={(checked) => handleFilterChange('categories', String(c || ''), checked as boolean)} />
                    <label htmlFor={String(c || '')} className="text-sm cursor-pointer">{c}</label>
                  </div>
                ))}
              </div>
            </Collapsible>

            <Collapsible defaultOpen>
              <div className="flex items-center justify-between w-full py-3 border-b">
                <span className="font-medium">Brands</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="py-3 space-y-3">
                {brands.map(b => (
                  <div key={b} className="flex items-center space-x-2">
                    <Checkbox id={String(b || '')} checked={filters.brands.includes(String(b || ''))} onCheckedChange={(checked) => handleFilterChange('brands', String(b || ''), checked as boolean)} />
                    <label htmlFor={String(b || '')} className="text-sm cursor-pointer">{b}</label>
                  </div>
                ))}
              </div>
            </Collapsible>

            <Collapsible defaultOpen>
              <div className="flex items-center justify-between w-full py-3 border-b">
                <span className="font-medium">Colors</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="py-3 space-y-3">
                {colors.map(col => (
                  <div key={col} className="flex items-center space-x-2">
                    <Checkbox id={String(col || '')} checked={filters.colors.includes(String(col || ''))} onCheckedChange={(checked) => handleFilterChange('colors', String(col || ''), checked as boolean)} />
                    <label htmlFor={String(col || '')} className="text-sm cursor-pointer">{col}</label>
                  </div>
                ))}
              </div>
            </Collapsible>

            <Collapsible>
              <div className="flex items-center justify-between w-full py-3 border-b">
                <span className="font-medium">Sizes</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="py-3 space-y-3">
                {sizes.map(s => (
                  <div key={s} className="flex items-center space-x-2">
                    <Checkbox id={s} checked={filters.sizes.includes(s)} onCheckedChange={(checked) => handleFilterChange('sizes', s, checked as boolean)} />
                    <label htmlFor={s} className="text-sm cursor-pointer">{s}</label>
                  </div>
                ))}
              </div>
            </Collapsible>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                {/* AdminDuplicateRemoval component removed */}
                <span className="text-gray-600">Showing {filteredAndSortedProducts.length} of {state.products.length} products</span>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 sm:w-48">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                <Button onClick={clearAllFilters} className="mt-4">Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;