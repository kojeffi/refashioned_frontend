"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    profile_image: "",
    bio: "",
    shipping_address: "",
  });
  const [orderId, setOrderId] = useState(""); // For order tracking
  const [trackingDetails, setTrackingDetails] = useState(null); // For order tracking
  const [trackingError, setTrackingError] = useState(null); // For order tracking

  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setLoading(false);
      setError("Unauthorized. Please log in.");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("https://refashioned.onrender.com/api/profile/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setProfile(data.profile);
        setFormData({
          first_name: data.profile.user?.first_name || "",
          last_name: data.profile.user?.last_name || "",
          email: data.profile.user?.email || "",
          phone_number: data.profile.phone_number || "",
          profile_image: data.profile.profile_image
            ? `https://res.cloudinary.com/dnqsiqqu9/${data.profile.profile_image}`
            : "/images/avatar.png",
          bio: data.profile.bio || "",
          shipping_address: data.profile.shipping_address || "",
        });
      } catch (err) {
        setError(err.message);
        localStorage.removeItem("authToken");
        router.push("/login");
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch("https://refashioned.onrender.com/api/orders/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.data || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
    fetchOrders();
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData({ ...formData, profile_image: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "profile_image" || imageFile) {
        formDataToSend.append(key, key === "profile_image" ? imageFile : value);
      }
    });

    try {
      const res = await fetch("https://refashioned.onrender.com/api/profile/", {
        method: "PUT",
        headers: { Authorization: `Bearer ${authToken}` },
        body: formDataToSend,
      });

      if (!res.ok) throw new Error("Failed to update profile");
      const updatedProfile = await res.json();
      setProfile(updatedProfile.profile);
      setError(null);
      alert("Profile updated successfully!");
    } catch (err) {
      setError("Error updating profile");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your profile?")) return;
    const authToken = localStorage.getItem("authToken");

    try {
      await fetch("https://refashioned.onrender.com/api/profile/", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      localStorage.removeItem("authToken");
      router.push("/login");
    } catch (err) {
      setError("Error deleting profile");
    }
  };

  const handleTrackOrder = async () => {
    if (!orderId) {
      setTrackingError("Please enter an order ID.");
      return;
    }

    const authToken = localStorage.getItem("authToken");

    try {
      const res = await fetch(`https://refashioned.onrender.com/api/orders/tracking/${orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch tracking details");

      const data = await res.json();
      setTrackingDetails(data.data);
      setTrackingError(null);
    } catch (err) {
      setTrackingError(err.message);
      setTrackingDetails(null);
    }
  };

  const handleDownloadOrderHistory = async () => {
    const authToken = localStorage.getItem("authToken");

    try {
      const res = await fetch("https://refashioned.onrender.com/api/orders/download/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to download order history");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "order_history.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError("Error downloading order history");
    }
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Profile & Order History</h1>
        {profile && (
          <div className="text-center mb-6">
            <Image
              src={formData.profile_image}
              alt="Profile Picture"
              width={140}
              height={140}
              className="rounded-full align-middle shadow-md border-4 border-gray-300 object-cover"
            />
            <h2 className="text-xl font-semibold mt-2">{profile.user?.first_name} {profile.user?.last_name}</h2>
            <p className="text-gray-600">{profile.user?.email}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['first_name', 'last_name', 'email', 'phone_number', 'shipping_address'].map((field) => (
              <div key={field}>
                <label className="text-gray-700 font-semibold capitalize">{field.replace('_', ' ')}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`Enter ${field.replace('_', ' ')}`}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="text-gray-700 font-semibold">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
            />
          </div>
          <div>
            <label className="text-gray-700 font-semibold">Profile Image</label>
            <input
              type="file"
              name="profile_image"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
            />
          </div>
          <div className="flex justify-between mt-6">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition shadow-md">
              Update Profile
            </button>
            <button type="button" onClick={handleDelete} className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition shadow-md">
              Delete Profile
            </button>
          </div>
        </form>

        {/* Order Tracking Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Track Your Order</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
            />
            <button
              onClick={handleTrackOrder}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              Track
            </button>
          </div>
          {trackingError && <p className="text-red-500 mt-2">{trackingError}</p>}
          {trackingDetails && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold">Order ID: {trackingDetails.order_id}</h3>
              <p>Status: {trackingDetails.status}</p>
              <p>Date: {new Date(trackingDetails.order_date).toLocaleDateString()}</p>
              <p>Shipping Address: {trackingDetails.shipping_address}</p>
            </div>
          )}
        </div>

        {/* Download Order History Button */}
        <div className="mt-6">
          <button
            onClick={handleDownloadOrderHistory}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition shadow-md"
          >
            Download Order History
          </button>
        </div>

        {/* Order History Section */}
        <h2 className="text-2xl font-semibold text-gray-700 mt-6">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-4 mt-4">
            {orders.map((order) => (
              <div key={order.order_id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Order ID: {order.order_id}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                  <div>
                    <p>Date: {new Date(order.order_date).toLocaleDateString()}</p>
                    <p>Payment Status: {order.payment_status}</p>
                    <p>Payment Mode: {order.payment_mode}</p>
                  </div>
                  <div>
                    <p>Shipping Address: {order.shipping_address}</p>
                    <p>Order Total: ${order.order_total_price}</p>
                    <p>Grand Total: ${order.grand_total}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700">Items:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => {
                      const imageUrl = item.product_images?.[0]?.image_url || "/fallback-image.jpg";
                      return (
                        <div key={index} className="flex items-center gap-4 border-t pt-2">
                          <Image
                            src={imageUrl}
                            alt={item.product.product_name}
                            width={50}
                            height={50}
                            className="rounded"
                            onError={(e) => {
                              e.target.src = "/fallback-image.jpg";
                            }}
                          />
                          <div>
                            <p className="font-semibold">{item.product.product_name}</p>
                            <p className="text-sm text-gray-600">Size: {item.size_variant.size_name} | Qty: {item.quantity}</p>
                            <p className="text-sm text-gray-600">Price: ${item.price}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}