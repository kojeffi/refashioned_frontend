"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import Link from "next/link";
import ButtonPrimary from '@/shared/Button/ButtonPrimary';

const BASE_API_URL = "https://refashioned.onrender.com/api/products/";

const SectionHeader = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(BASE_API_URL);
        const data = await response.json();

        if (data.result_code === 200) {
          const filteredBanners = data.data.filter(
            (product) =>
              product.category?.category_name?.toLowerCase() === "banner"
          );

          setBanners(filteredBanners);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  return (
    <section id="billboard" className="relative overflow-hidden  px-16">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={{
          nextEl: ".button-next",
          prevEl: ".button-prev",
        }}
        className="swiper main-swiper rounded-2xl shadow-xl"
      >
        {loading ? (
          <p className="text-center text-gray-500">Loading banners...</p>
        ) : banners.length > 0 ? (
          banners.map((product) => {
            const imageUrl =
              product.product_images.length > 0 &&
              product.product_images[0]?.image_url
                ? product.product_images[0].image_url.replace("http://", "https://")
                : "/default-banner.jpg";

            return (
              <SwiperSlide key={product.uid}>
                <div className="relative w-full h-[400px]">
                  {/* Background Image Covering Whole Slider */}
                  <Image
                    src={imageUrl}
                    alt={product.product_name}
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0"
                    priority
                  />
                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white text-center">
                    <h2 className="text-4xl font-bold mb-4">{product.product_name}</h2>

                    {/* Shop Now Button */}
                    <Link href={`/product/${product.slug}`}>
                      <button className="bg-red-600 text-white px-6 py-3 text-lg font-semibold rounded-full shadow-lg hover:bg-red-700 transition">
                        Shop Now
                      </button>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No banners available.</p>
        )}
      </Swiper>
    </section>
  );
};

export default SectionHeader;
