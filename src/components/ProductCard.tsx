import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import React from "react";

import type { ProductType } from "@/data/types";
import LikeButton from "./LikeButton";

interface ProductCardProps {
  product: ProductType;
  className?: string;
  showPrevPrice?: boolean;
}

const BASE_MEDIA_URL = "https://refashioned.onrender.com/media/";

const ProductCard: FC<ProductCardProps> = ({ product, className, showPrevPrice = false }) => {
  // Get first product image or use a placeholder
  const productImage = product.product_images?.length > 0 
  ? product.product_images[0].image_url 
  : "/images/placeholder.png"; // ✅ Use a fallback image


  return (
    <div className={`transitionEffect relative rounded-2xl p-3 shadow-md ${className}`}>
      <div className="h-[250px] w-full overflow-hidden rounded-2xl lg:h-[220px] 2xl:h-[300px]">
        {product.newest_product && ( // ✅ Changed from justIn
          <div className="absolute left-6 top-0 rounded-b-lg bg-primary px-3 py-2 text-sm uppercase text-white shadow-md">
            New Arrival!
          </div>
        )}
        <LikeButton className="absolute right-2 top-2" />
        <Link className="h-[250px] w-full lg:h-[220px]" href={`/products/${product.slug}`}>
          <Image
            src={productImage} // ✅ Corrected image URL
            alt={`${product.product_name} cover photo`}
            className="h-full w-full object-cover object-bottom"
            width={300}
            height={300}
            priority
            unoptimized // ✅ Temporary fix for local development
          />
        </Link>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{product.product_name}</h3>
          {/* {showPrevPrice && (
            <p className="text-neutral-500 text-sm line-through">${product.previousPrice}</p>
          )} */}
        </div>

        <div className="flex items-center justify-between">
         <p className="text-sm text-neutral-500">{product.category?.category_name || "Unknown Category"}</p> 
          <p className="text-lg font-medium text-primary">${product.price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
