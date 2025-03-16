"use client";

import React, { useEffect, useState } from "react";
import Slider from "@/shared/Slider/Slider";
import Image from "next/image";
import Link from "next/link";

const BASE_API_URL = "https://refashioned.onrender.com/api/products/";

const ProductSlider = () => {
  const [shoes, setShoes] = useState([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch(BASE_API_URL);
        const data = await response.json();
        if (data.result_code === 200) {
          // ✅ Filter only products with category_name "shoes"
          const shoesData = data.data.filter(
            (product) => product.category.category_name.toLowerCase() === "shoes"
          );
          setShoes(shoesData);
        }
      } catch (error) {
        console.error("Error fetching deals:", error);
      }
    };

    fetchDeals();
  }, []);

  return (
    <div className="container mx-auto">
      {shoes.length > 0 ? (
        <Slider
          itemPerRow={4}
          data={shoes}
          renderItem={(item) =>
            item && (
              <Link href={`/product/${item.slug}`} key={item.uid} passHref>
                <div className="relative w-full h-[350px] rounded-lg overflow-hidden shadow-lg cursor-pointer group">
                  {/* Product Image */}
                  <Image
                    src={item.product_images?.[0]?.image_url.replace("http://", "https://") || "/placeholder.jpg"}
                    alt={item.product_name}
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                    priority
                  />

                  {/* Price Tag */}
                  <div className="absolute bottom-3 left-3 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                    ${item.price}
                  </div>
                </div>
              </Link>
            )
          }
        />
      ) : (
        <p className="text-center text-gray-500">No deals available.</p>
      )}
    </div>
  );
};

export default ProductSlider;
