'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdStar } from 'react-icons/md';

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

const CheckoutPage = ({ searchParams }: CheckoutPageProps) => {
  const [tabActive, setTabActive] = useState<'ContactInfo' | 'ShippingAddress' | 'PaymentMethod'>('ShippingAddress');
  const [cartData, setCartData] = useState<{ items: CartItem[]; totalPrice: number } | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

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

  const handleScrollToEl = (id: string) => {
    const element = document.getElementById(id);
    setTimeout(() => {
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
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
            totalPrice={cartData?.totalPrice || 0} // Pass totalPrice to PaymentMethod
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
                <div className="text-sm">Discount code</div>
                <div className="mt-1.5 flex">
                  <Input
                    rounded="rounded-lg"
                    sizeClass="h-12 px-4 py-3"
                    className="flex-1 border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                  />
                  <button
                    type="button"
                    className="ml-3 flex w-24 items-center justify-center rounded-2xl border border-neutral-300 bg-gray px-4 text-sm font-medium transition-colors hover:bg-neutral-100"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="mt-4 flex justify-between pt-4 text-base font-semibold">
                <span>Total</span>
                <span>${cartData?.totalPrice || '0.00'}</span>
              </div>
            </div>
            <ButtonPrimary className="mt-8 w-full">Confirm order</ButtonPrimary>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;