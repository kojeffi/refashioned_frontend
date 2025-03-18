'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdStar } from 'react-icons/md';
import { XCircle } from 'lucide-react';

import LikeButton from '@/components/LikeButton';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import Input from '@/shared/Input/Input';
import InputNumber from '@/shared/InputNumber/InputNumber';

import ContactInfo from './ContactInfo';
import PaymentMethod from './PaymentMethod';
import ShippingAddress from './ShippingAddress';

interface ProductType {
  id: string;
  name: string;
  image_url: string;
  price: number;
  slug: string;
  rating: number;
  category: string;
}

interface CartItem {
  product: {
    slug: string;
    product_name: string;
    price: number;
    images: { image: string }[];
  };
  quantity: number;
}

interface CheckoutPageProps {
  searchParams: {
    cart?: string; // Query parameter for cart data
  };
}

// Notification Card Component
const NotificationCard = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  return (
    <div
      className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg transition-opacity duration-500 flex items-center gap-2 z-50
        ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
    >
      <span>{message}</span>
      <XCircle className="w-5 h-5 cursor-pointer" onClick={onClose} />
    </div>
  );
};

const CheckoutPage = ({ searchParams }: CheckoutPageProps) => {
  const [tabActive, setTabActive] = useState<'ContactInfo' | 'ShippingAddress' | 'PaymentMethod'>('ShippingAddress');
  const [cartData, setCartData] = useState<{ items: CartItem[]; totalPrice: number } | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Retrieve cart data from query parameters
  useEffect(() => {
    if (searchParams.cart) {
      const cart = JSON.parse(searchParams.cart);
      setCartData(cart);
    }
  }, [searchParams.cart]);

  // Retrieve authToken from localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleScrollToEl = (id: string) => {
    const element = document.getElementById(id);
    setTimeout(() => {
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  const handleConfirmOrder = async () => {
    if (!authToken) {
      showNotification('Please log in to confirm your order.', 'error');
      return;
    }

    if (!cartData) {
      showNotification('Your cart is empty.', 'error');
      return;
    }

    try {
      const response = await fetch('https://refashioned.onrender.com/api/orders/', {
        method: 'POST', // Changed from GET to POST
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          items: cartData.items,
          totalPrice: cartData.totalPrice,
        }),
      });

      if (response.ok) {
        const order = await response.json();
        showNotification('Order confirmed successfully!', 'success');
        window.location.href = `/profile?order_id=${order.id}`;
      } else {
        const errorData = await response.json();
        showNotification(`Failed to confirm order: ${errorData.message}`, 'error');
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      showNotification('An error occurred while confirming your order.', 'error');
    }
  };

  const renderProduct = (item: CartItem) => {
    const { product, quantity } = item;
    const imageUrl = product.images?.length
      ? `https://res.cloudinary.com/dnqsiqqu9/${product.images[0].image}`
      : '/fallback-image.jpg';

    return (
      <div key={product.slug} className="flex py-5 last:pb-0">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl md:h-40 md:w-40">
          <Image
            fill
            src={imageUrl}
            alt={product.product_name}
            className="h-full w-full object-contain object-center"
          />
          <Link className="absolute inset-0" href={`/products/${product.slug}`} />
        </div>

        <div className="ml-4 flex flex-1 flex-col justify-between">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="font-medium md:text-2xl ">
                  <Link href={`/products/${product.slug}`}>{product.product_name}</Link>
                </h3>
                <span className="font-medium md:text-xl">${product.price}</span>
              </div>
            </div>
          </div>
          <div className="flex w-full items-end justify-between text-sm">
            <div>
              <InputNumber defaultValue={quantity} disabled />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLeft = () => {
    return (
      <div className="space-y-8">
        <div id="ContactInfo" className="scroll-mt-24">
          {/* ContactInfo component */}
        </div>
        <div id="ShippingAddress" className="scroll-mt-24">
          <ShippingAddress
            isActive={tabActive === 'ShippingAddress'}
            onOpenActive={() => {
              setTabActive('ShippingAddress');
              handleScrollToEl('ShippingAddress');
            }}
            onCloseActive={() => {
              setTabActive('PaymentMethod');
              handleScrollToEl('PaymentMethod');
            }}
          />
        </div>

        <div id="PaymentMethod" className="scroll-mt-24">
          <PaymentMethod
            isActive={tabActive === 'PaymentMethod'}
            onOpenActive={() => {
              setTabActive('PaymentMethod');
              handleScrollToEl('PaymentMethod');
            }}
            onCloseActive={() => setTabActive('PaymentMethod')}
            authToken={authToken}
            totalPrice={cartData?.totalPrice || 0}
            onSuccess={(message) => showNotification(message, 'success')} // Pass the callback here
            onError={(message) => showNotification(message, 'error')} // Pass the callback here
          />
        </div>
      </div>
    );
  };

  return (
    <div className="nc-CheckoutPage">
      <main className="container py-16 lg:pb-28 lg:pt-20 ">
        <div className="mb-16">
          <h2 className="block text-2xl font-semibold sm:text-3xl lg:text-4xl ">Checkout</h2>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="flex-1">{renderLeft()}</div>

          <div className="my-10 shrink-0 border-t border-neutral-300 lg:mx-10 lg:my-0 lg:border-l lg:border-t-0 xl:lg:mx-14 2xl:mx-16 " />

          <div className="w-full lg:w-[36%] ">
            <h3 className="text-lg font-semibold">Order summary</h3>
            {cartData ? (
              <div className="mt-8 divide-y divide-neutral-300">
                {cartData.items.map((item) => renderProduct(item))}
              </div>
            ) : (
              <div className="mt-8">Loading cart...</div>
            )}

            <div className="mt-10 border-t border-neutral-300 pt-6 text-sm">
              <div>
                {/* Additional details */}
              </div>

              <div className="mt-4 flex justify-between pt-4 text-base font-semibold">
                <span>Total</span>
                <span>${cartData?.totalPrice || '0.00'}</span>
              </div>
            </div>
            <ButtonPrimary className="mt-8 w-full" onClick={handleConfirmOrder}>
              Confirm order
            </ButtonPrimary>
          </div>
        </div>
      </main>

      {/* Notification Card */}
      {notification && (
        <NotificationCard
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default CheckoutPage;