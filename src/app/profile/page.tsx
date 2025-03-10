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
              className="rounded-full shadow-md border-4 border-gray-300 object-cover"
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
          <div className="flex justify-between mt-6">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition shadow-md">
              Update Profile
            </button>
            <button type="button" onClick={handleDelete} className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition shadow-md">
              Delete Profile
            </button>
          </div>
        </form>

        <h2 className="text-2xl font-semibold text-gray-700 mt-6">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-4 mt-4">
            {orders.map((order) => (
              <div key={order.order_id} className="border p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold">Order ID: {order.order_id}</h3>
                <p className="text-gray-600">Date: {new Date(order.order_date).toLocaleDateString()}</p>
                <p className="text-gray-600">Status: {order.status}</p>
                <p className="text-gray-600">Total: ${order.grand_total}</p>
                <div className="mt-3 space-y-2">
                {order.items.map((item, index) => {
                  const imageUrl = item.product_images?.[0]?.image_url || "/fallback-image.jpg";
                  console.log("Image URL:", imageUrl); // Debugging line

                  return (
                    <div key={index} className="flex items-center gap-4 border-t pt-2">
                      <Image
                        src={imageUrl}
                        alt={item.product.product_name}
                        width={50}
                        height={50}
                        className="rounded"
                        onError={(e) => {
                          e.target.src = "/fallback-image.jpg"; // Fallback in case of error
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}