"use client";

import React, { useEffect, useState } from "react";
import Slider from "@/shared/Slider/Slider";
import ProductCard from "./ProductCard";

const BASE_API_URL = "https://refashioned.onrender.com/api/products/";

const ProductSlider = () => {
  const [shoes, setShoes] = useState([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch(BASE_API_URL);
        const data = await response.json();
        if (data.result_code === 200) {
          // ✅ Filter only products with category_name "deals"
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
    <div>
      {shoes.length > 0 ? (
        <Slider
          itemPerRow={4}
          data={shoes} // ✅ Render only "deals" category products
          renderItem={(item) =>
            item && <ProductCard showPrevPrice product={item} className="bg-white" />
          }
        />
      ) : (
        <p className="text-center text-gray-500">No deals available.</p>
      )}
    </div>
  );
};

export default ProductSlider;
