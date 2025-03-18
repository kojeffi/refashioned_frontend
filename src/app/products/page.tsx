"use client";

import React, { useEffect, useState } from "react";
import { LuFilter } from "react-icons/lu";
import { MdOutlineFilterList } from "react-icons/md";
import { FiHeart, FiShoppingCart, FiEye } from "react-icons/fi";

import ButtonSecondary from "@/shared/Button/ButtonSecondary";

const API_URL = "https://refashioned.onrender.com/api/products/";
const ADD_TO_CART_API = "https://refashioned.onrender.com/api/cart/add/";
const WISHLIST_API = "https://refashioned.onrender.com/api/wishlist/";
const VIEW_PRODUCT_API = "https://refashioned.onrender.com/api/products/";

const Page = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter and sort states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Extract unique categories for the filter dropdown
  const categories = [...new Set(products.map((product) => product.category.category_name))];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (response.ok) {
          setProducts(data.data);
          setFilteredProducts(data.data); // Initialize filteredProducts with all products
        } else {
          console.error("Error fetching products");
        }
      } catch (error) {
        console.error("Network error while fetching products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (uid) => {
    try {
      const response = await fetch(`${ADD_TO_CART_API}${uid}/`, { method: "POST" });
      if (response.ok) {
        console.log("Added to cart");
      } else {
        console.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      const response = await fetch(`${WISHLIST_API}${productId}/`, { method: "POST" });
      if (response.ok) {
        console.log("Added to wishlist");
      } else {
        console.error("Failed to add to wishlist");
      }
    } catch (error) {
      console.error("Error adding to wishlist", error);
    }
  };

  const handleViewProduct = (slug) => {
    window.location.href = `${VIEW_PRODUCT_API}${slug}/`;
  };

  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // Apply price filter
    if (minPrice || maxPrice) {
      filtered = filtered.filter((product) => {
        const price = product.price;
        return (
          (!minPrice || price >= parseFloat(minPrice)) &&
          (!maxPrice || price <= parseFloat(maxPrice))
        );
      });
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category.category_name === selectedCategory
      );
    }

    // Apply sorting
    if (sortBy === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name_asc") {
      filtered.sort((a, b) => a.product_name.localeCompare(b.product_name));
    } else if (sortBy === "name_desc") {
      filtered.sort((a, b) => b.product_name.localeCompare(a.product_name));
    } else if (sortBy === "popularity") {
      filtered.sort((a, b) => b.popularity - a.popularity);
    }

    setFilteredProducts(filtered);
  };

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategory("");
    setSortBy("");
    setFilteredProducts(products); // Reset to all products
  };

  // Group products by category
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const categoryName = product.category.category_name;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {});

  return (
    <div className="">
      <div className="container relative flex flex-col lg:flex-row" id="body">
        <div className="mb-10 shrink-0 border-t lg:mx-4 lg:mb-0 lg:border-t-0" />
        <div className="relative flex-1">
          <div className="mb-3 items-center gap-5 space-y-5 bg-white py-10 flex overflow-x-auto whitespace-nowrap px-4">
            {/* Price Filter */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="p-2 border rounded"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Sort By</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A-Z</option>
              <option value="name_desc">Name: Z-A</option>
              <option value="popularity">Popularity</option>
            </select>

            {/* Apply Button */}
            <ButtonSecondary onClick={applyFiltersAndSort}>Apply</ButtonSecondary>

            {/* Reset Button */}
            <ButtonSecondary onClick={resetFilters}>Reset</ButtonSecondary>
          </div>

          {loading ? (
            <p className="text-center">Loading products...</p>
          ) : (
            Object.entries(groupedProducts).map(([categoryName, products]) => (
              <div key={categoryName} className="mb-10">
                <h2 className="mb-5 text-2xl font-semibold">{categoryName}</h2>
                <div className="grid flex-1 gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
                  {products.map((product) => (
                    <div key={product.uid} className="border rounded-lg shadow-lg overflow-hidden bg-white relative">
                      <img
                        src={product.product_images?.[0]?.image_url || "/fallback-image.jpg"}
                        alt={product.product_name}
                        className="w-full h-72 object-cover"
                      />
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <button className="bg-white p-2 rounded-full shadow hover:bg-gray-200" onClick={() => handleAddToWishlist(product.id)}>
                          <FiHeart className="text-red-500" />
                        </button>
                        <a href={`/products/${product.slug}`}>
                          <button className="bg-white p-2 rounded-full shadow hover:bg-gray-200">
                            <FiEye className="text-gray-600" />
                          </button>
                        </a>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold">{product.product_name}</h3>
                        <p className="text-gray-600 mb-2">${product.price}</p>
                        <button className="flex items-center gap-2 w-full text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-800" onClick={() => handleAddToCart(product.uid)}>
                          <FiShoppingCart /> Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};


export default Page;