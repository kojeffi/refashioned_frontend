import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import Link from "next/link";

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
    <section id="billboard" className="relative overflow-hidden px-6 lg:px-16">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="swiper main-swiper rounded-3xl shadow-xl"
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
              <SwiperSlide key={product.uid} id={`product-${product.uid}`}>
                <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
                  {/* Background Image */}
                  <Image
                    src={imageUrl}
                    alt={product.product_name}
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0 rounded-3xl"
                    priority
                  />

                  {/* Lighter Overlay (Gradient) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent rounded-3xl"></div>

                  {/* Text Content - Now More Visible */}
                  <div className="absolute inset-0 flex flex-col items-start justify-center text-red-700 text-left p-10">
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">
                      {product.product_name}
                    </h2>
                    <p className="mt-2 text-sm md:text-lg text-white/90">
                      Discover our latest collection now!
                    </p>
                    <Link href={`/product/${product.slug}`} className="mt-6">
                      <button className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 text-lg font-semibold rounded-full shadow-xl transition-all hover:scale-105 hover:from-red-600 hover:to-red-800">
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
