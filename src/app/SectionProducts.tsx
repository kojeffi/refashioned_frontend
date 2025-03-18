"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Heading from "@/shared/Heading/Heading";
import { ShoppingCart, Eye, Heart, XCircle } from "lucide-react";

const API_URL = "https://refashioned.onrender.com/api/products/";
const RECOMMENDATIONS_URL = "https://refashioned.onrender.com/api/recommendations/";
const WISHLIST_URL = "https://refashioned.onrender.com/api/wishlist/";
const CART_BASE_URL = "https://refashioned.onrender.com/api/cart/add/";


const NotificationCard = ({ message, type, onClose }) => {
  return (
    <div
      className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg transition-opacity duration-500 flex items-center gap-2 z-50
        ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
    >
      <span>{message}</span>
      <XCircle className="w-5 h-5 cursor-pointer" onClick={onClose} />
    </div>
  );
};

const SectionProducts = () => {
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (response.ok) {
          setProducts(data.data);
        } else {
          showNotification("Error fetching products", "error");
        }
      } catch (error) {
        showNotification("Network error while fetching products", "error");
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(RECOMMENDATIONS_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setRecommendations(data.data);
        } else {
          console.error("Error fetching recommendations:", data);
        }
      } catch (error) {
        console.error("Network error while fetching recommendations:", error);
      }
    };

    fetchProducts();
    fetchRecommendations();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        showNotification("Please log in to add items to wishlist", "error");
        return;
      }

      const response = await fetch(WISHLIST_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: productId }),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification("Added to wishlist", "success");
      } else {
        showNotification(data.message || "Failed to add to wishlist", "error");
      }
    } catch (error) {
      showNotification("Network error while adding to wishlist", "error");
    }
  };

 
  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        showNotification("Please log in to add items to cart", "error");
        return;
      }
  
      const response = await fetch(`${CART_BASE_URL}${productId}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // No need to send product_id in the body
      });
  
      const data = await response.json();
  
      if (response.ok) {
        showNotification("Added to cart", "success");
      } else {
        showNotification(data.message || "Failed to add to cart", "error");
      }
    } catch (error) {
      showNotification("Network error while adding to cart", "error");
    }
  };

  const jewelleryProducts = products.filter(
    (product) => product.category.category_name === "Jewellery"
  );

  return (
    <div className="container mt-1 pt-3">
      {notification && (
        <NotificationCard {...notification} onClose={() => setNotification(null)} />
      )}

      {recommendations && recommendations.length > 0 && (
        <div>
          <Heading isCenter isMain desc="Recommended just for you">
            Product Recommendations
          </Heading>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {recommendations.map((product) => (
              <div
                key={product.slug}
                className="rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col bg-white"
              >
                <div className="w-full h-60 flex justify-center items-center overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={`https://res.cloudinary.com/dnqsiqqu9/${product.images[0]?.image}`}
                    alt={product.product_name}
                  />
                </div>
                <div className="p-4 flex flex-col items-center">
                  <a
                    href={`/products/${product.slug}`}
                    className="font-semibold block text-center"
                  >
                    {product.product_name}
                  </a>
                  <div className="text-lg font-bold mt-1">${product.price}.00</div>
                  <div className="mt-3 flex gap-3">
                    <button
                      className="p-2 rounded-lg transition-all duration-200 hover:bg-red-100 hover:scale-110"
                      onClick={() => handleAddToWishlist(product.uid)}
                    >
                      <Heart className="w-5 h-5 text-red-500 hover:opacity-80" />
                    </button>

                    <button
                      className="p-2 rounded-lg transition-all duration-200 hover:bg-blue-100 hover:scale-110"
                      onClick={() => router.push(`/products/${product.slug}`)}
                    >
                      <Eye className="w-5 h-5 text-blue-500 hover:opacity-80" />
                    </button>

                    <button
                      className="p-2 rounded-lg transition-all duration-200 hover:bg-green-100 hover:scale-110"
                      onClick={() => handleAddToCart(product.uid)}
                    >
                      <ShoppingCart className="w-5 h-5 text-green-500 hover:opacity-80" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Heading isCenter isMain desc="Browse our exclusive products">
        Jewellery Shop
      </Heading>
      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {jewelleryProducts.map((product) => (
            <div
              key={product.uid}
              className="rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col bg-white"
            >
              <div className="w-full h-60 flex justify-center items-center overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={product.product_images?.[0]?.image_url || "/fallback-image.jpg"}
                  alt={product.product_name}
                />
              </div>
              <div className="p-4 flex flex-col items-center">
                <a
                  href={`/products/${product.slug}`}
                  className="font-semibold block text-center"
                >
                  {product.product_name}
                </a>
                <div className="text-lg font-bold mt-1">${product.price}.00</div>
                <div className="mt-3 flex gap-3">
                  <button
                    className="p-2 rounded-lg transition-all duration-200 hover:bg-red-100 hover:scale-110"
                    onClick={() => handleAddToWishlist(product.uid)}
                  >
                    <Heart className="w-5 h-5 text-red-500 hover:opacity-80" />
                  </button>

                  <button
                    className="p-2 rounded-lg transition-all duration-200 hover:bg-blue-100 hover:scale-110"
                    onClick={() => router.push(`/products/${product.slug}`)}
                  >
                    <Eye className="w-5 h-5 text-blue-500 hover:opacity-80" />
                  </button>

                  <button
                    className="p-2 rounded-lg transition-all duration-200 hover:bg-green-100 hover:scale-110"
                    onClick={() => handleAddToCart(product.uid)}
                  >
                    <ShoppingCart className="w-5 h-5 text-green-500 hover:opacity-80" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionProducts;