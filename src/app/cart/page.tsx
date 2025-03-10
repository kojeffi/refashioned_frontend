'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ Import correctly for App Router
import { AiOutlineDelete } from "react-icons/ai";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import InputNumber from "@/shared/InputNumber/InputNumber";

const API_URL = "https://refashioned.onrender.com/api/cart/";
const API_ADD_TO_CART = "https://refashioned.onrender.com/api/cart/add/";
const API_REMOVE_FROM_CART = "https://refashioned.onrender.com/api/api/cart/remove/";
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dnqsiqqu9/";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [updatingQuantities, setUpdatingQuantities] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You need to be logged in to view your cart.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      let data = await response.json();
      setCart(data.data);
      setQuantities(
        data.data.cart_items.reduce((acc, item) => {
          acc[item.product.slug] = item.quantity;
          return acc;
        }, {})
      );
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Failed to fetch cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (slug, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingQuantities((prev) => ({ ...prev, [slug]: true }));
    setQuantities((prev) => ({ ...prev, [slug]: newQuantity }));

    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${API_ADD_TO_CART}${slug}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      setTimeout(() => {
        fetchCart();
      }, 500);
    } catch (error) {
      console.error("Error updating quantity:", error);
      setQuantities((prev) => ({ ...prev, [slug]: prev[slug] }));
    } finally {
      setUpdatingQuantities((prev) => ({ ...prev, [slug]: false }));
    }
  };

  const handleRemoveItem = async (slug) => {
    const token = localStorage.getItem("authToken");
    try {
      await fetch(`${API_REMOVE_FROM_CART}${slug}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const totalCartPrice = cart?.cart_items?.reduce((total, item) => {
    return total + item.product.price * (quantities[item.product.slug] || item.quantity);
  }, 0) || 0;

  const handleProceedToCheckout = () => {
    if (!cart || !cart.cart_items) {
      console.error("Cart is empty or not loaded.");
      return;
    }

    const cartData = {
      items: cart.cart_items,
      totalPrice: totalCartPrice,
    };

    // Use URLSearchParams to encode the query parameters
    const queryParams = new URLSearchParams({
      cart: JSON.stringify(cartData), // Pass the query as a string
    });

    // Construct the URL with query parameters
    const url = `/checkout?${queryParams.toString()}`;

    // Use router.push with the constructed URL
    router.push(url);
  };

  return (
    <div className="nc-CartPage">
      <main className="container py-16 lg:pb-28 lg:pt-20">
        <h2 className="text-2xl font-medium sm:text-3xl lg:text-4xl">Shopping Cart</h2>

        {loading ? (
          <p>Loading cart...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : cart?.cart_items?.length > 0 ? (
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-3/5">
              {cart.cart_items.map((item) => {
                const product = item.product;
                const imageUrl = product.images?.length
                  ? `${CLOUDINARY_BASE_URL}${product.images[0].image}`
                  : "/fallback-image.jpg";
                const quantity = quantities[product.slug] || item.quantity;
                const totalItemPrice = product.price * quantity;
                return (
                  <div key={product.slug} className="flex py-5 last:pb-0 border-b">
                    <div className="relative h-24 w-24 md:h-40 md:w-40">
                      <Image src={imageUrl} alt={product.product_name} width={160} height={160} className="rounded-lg object-cover shadow-lg" unoptimized />
                      <Link className="absolute inset-0" href={`/products/${product.slug}`} />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col justify-between">
                      <h3 className="font-medium md:text-xl">
                        <Link href={`/products/${product.slug}`}>{product.product_name}</Link>
                      </h3>
                      <p className="text-sm text-gray-500">Price: ${product.price}</p>
                      <div className="flex items-center justify-between">
                        <InputNumber
                          defaultValue={quantity}
                          onChange={(newQuantity) => handleQuantityChange(product.slug, newQuantity)}
                          disabled={updatingQuantities[product.slug]}
                        />
                        <span className="text-lg font-semibold">Total: ${totalItemPrice}</span>
                        <AiOutlineDelete className="text-2xl cursor-pointer text-red-500" onClick={() => handleRemoveItem(product.slug)} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex-1 p-5 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-semibold">Order Summary</h3>
              <div className="my-4 border-t pt-4">
                <div className="flex justify-between text-lg">
                  <span>Total Price:</span>
                  <span>${totalCartPrice}</span>
                </div>
              </div>
              <ButtonPrimary onClick={handleProceedToCheckout} className="w-full mt-4">
                Proceed to Checkout
              </ButtonPrimary>
            </div>
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </main>
    </div>
  );
};

export default CartPage;