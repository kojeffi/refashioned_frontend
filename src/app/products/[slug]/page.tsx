"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

const API_URL = "https://refashioned.onrender.com/api/products/";
const CART_API = "https://refashioned.onrender.com/api/cart/add/";
const WISHLIST_API = "https://refashioned.onrender.com/api/wishlist/add/";
const REVIEWS_API = "https://refashioned.onrender.com/api/reviews/";
const RELATED_API = "https://refashioned.onrender.com/api/products/related/"; // Updated endpoint

const SingleProductPage = () => {
  const params = useParams();
  const { slug } = params;

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        if (!slug) throw new Error("Invalid product slug");

        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Please login first.");

        const res = await fetch(`${API_URL}${slug}/`, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        const data = await res.json();
        if (data.result_code !== 200) throw new Error(data.message);

        setProduct(data.data);
        setSelectedImage(data.data.product_images?.[0]?.image_url || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug]);

  useEffect(() => {
    if (product) {
      // Fetch reviews
      fetch(`${REVIEWS_API}${product.uid}/`)
        .then((res) => res.json())
        .then((data) => setReviews(data.reviews || []));

      // Fetch related products based on category
      fetch(`${RELATED_API}?category_name=${product.category.category_name}`) // Use category_name
        .then((res) => res.json())
        .then((data) => {
          if (data.products) {
            setRelatedProducts(data.products);
          } else {
            setRelatedProducts([]); // Fallback if no products are returned
          }
        })
        .catch((err) => {
          console.error("Failed to fetch related products:", err);
          setRelatedProducts([]); // Fallback in case of an error
        });
    }
  }, [product]);

  const handleAddToWishlist = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Please login first.");

      const res = await fetch(WISHLIST_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: product.uid }),
      });

      if (!res.ok) throw new Error("Failed to add to wishlist.");
      setMessage("Added to Wishlist!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Please login first.");

      const res = await fetch(CART_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: product.uid, quantity, size: selectedSize }),
      });

      if (!res.ok) throw new Error("Failed to add to cart.");
      setMessage("Added to Cart!");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-10">Loading product...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      {message && <div className="text-center text-green-600">{message}</div>}

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image Gallery */}
        <div className="flex flex-col items-center">
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt={product.product_name}
              width={500}
              height={500}
              className="rounded-lg shadow-lg"
            />
          ) : (
            <div className="bg-gray-200 w-[500px] h-[500px] flex items-center justify-center rounded-lg">
              No Image Available
            </div>
          )}

          {/* Thumbnail Images */}
          <div className="flex mt-4">
            {product.product_images?.map((img, index) => (
              <Image
                key={index}
                src={img.image_url}
                alt="Thumbnail"
                width={80}
                height={80}
                className="border p-1 cursor-pointer mx-1"
                onClick={() => setSelectedImage(img.image_url)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold">{product.product_name}</h1>
          <p className="text-gray-500">{product.category.category_name}</p>

          {/* Rating */}
          <div className="flex items-center mt-2">
            <span className="text-yellow-500">
              {"★".repeat(Math.round(product.get_rating))}
              {"☆".repeat(5 - Math.round(product.get_rating))}
            </span>
            <p className="ml-2 text-gray-600">{Array.isArray(product?.reviews) ? product.reviews.length : 0} reviews</p>
          </div>

          {/* Price */}
          <p className="text-xl font-semibold mt-3">${product.price}.00</p>

          {/* Color Variants */}
          {product.color_variant?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Colors:</h4>
              <div className="flex gap-2 mt-2">
                {product.color_variant.map((color) => (
                  <span
                    key={color.uid}
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: color.hex_code }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Variants */}
          {product.size_variant?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Select Size:</h4>
              <div className="flex gap-2 mt-2">
                {product.size_variant.map((size) => (
                  <button
                    key={size.uid}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size.size_name ? "bg-blue-600 text-white" : "bg-gray-100"
                    }`}
                    onClick={() => setSelectedSize(size.size_name)}
                  >
                    {size.size_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mt-4 flex items-center gap-2">
            <button className="px-3 py-1 border" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              -
            </button>
            <input type="text" value={quantity} readOnly className="w-12 text-center border" />
            <button className="px-3 py-1 border" onClick={() => setQuantity(quantity + 1)}>
              +
            </button>
          </div>

          {/* Wishlist & Cart Buttons */}
          <div className="mt-6 flex gap-3">
            <button onClick={handleAddToWishlist} className="px-4 py-2 border rounded-md hover:bg-gray-200">
              ❤️ Add to Wishlist
            </button>
            <button onClick={handleAddToCart} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Product Reviews */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold">Product Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="border p-4 mt-2 rounded-md">
              <p className="font-semibold">{review.user}</p>
              <p className="text-gray-600">{review.comment}</p>
              <p className="text-yellow-500">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      {/* Related Products */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((item) => (
              <div key={item.uid} className="border p-4 rounded-md">
                <Image src={item.image_url} alt={item.product_name} width={200} height={200} className="rounded-md" />
                <h3 className="mt-2 font-semibold">{item.product_name}</h3>
                <p className="text-gray-500">₹{item.price}.00</p>
              </div>
            ))
          ) : (
            <p>No related products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;