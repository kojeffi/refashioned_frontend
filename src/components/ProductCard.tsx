"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://refashioned.onrender.com/api/products/');
        const data = await response.json();
        setProducts(data.data); // Set the fetched products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Handle "Add to Cart" button click
  const handleAddToCart = async (productId) => {
    try {
      const response = await fetch(`https://refashioned.onrender.com/api/cart/add/${productId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if needed (e.g., token)
        },
        body: JSON.stringify({ product_id: productId }),
      });

      if (response.ok) {
        alert('Product added to cart!');
      } else {
        alert('Failed to add product to cart.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Handle "Add to Wishlist" button click
  const handleAddToWishlist = async (productId) => {
    try {
      const response = await fetch('https://refashioned.onrender.com/api/wishlist/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if needed (e.g., token)
        },
        body: JSON.stringify({ product_id: productId }),
      });

      if (response.ok) {
        alert('Product added to wishlist!');
      } else {
        alert('Failed to add product to wishlist.');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  return (
    <div className="container p-4">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.uid} className="transitionEffect relative rounded-2xl p-3 shadow-md">
           <div key={product.uid} className="transitionEffect relative rounded-2xl p-3 shadow-md">
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl">
            {product.newest_product && (
              <div className="absolute left-4 top-0 rounded-b-lg bg-primary px-3 py-2 text-sm uppercase text-white shadow-md">
                New Arrival!
              </div>
            )}
            <button
              onClick={() => handleAddToWishlist(product.uid)}
              className="absolute right-2 top-2 p-2 rounded-full bg-white shadow-md"
            >
              🤍
            </button>
            <Link href={`/products/${product.slug}`}>
              <Image
                src={product.product_images?.length > 0 ? product.product_images[0].image_url : '/images/placeholder.png'}
                alt={`${product.product_name} cover photo`}
                className="w-full h-full object-contain"
                layout="fill"
                priority
              />
            </Link>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{product.product_name}</h3>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">{product.category?.category_name || "Unknown Category"}</p>
              <p className="text-lg font-medium text-primary">${product.price}</p>
            </div>
            <div className="flex justify-between mt-3">
              <button
                onClick={() => handleAddToCart(product.uid)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Add to Cart
              </button>
              <Link href={`/products/${product.slug}`}>
                <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600">
                  View
                </button>
              </Link>
            </div>
          </div>
        </div>     
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;