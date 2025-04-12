"use client";

import Image from "next/image";
import React from "react";
import { FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";

const Product = ({
  product,
  addToCart,
  removeFromCart,
  addToFavorites,
  isInCart,
  isFavorite,
  mode = "default",
  removeFromFavorites,
}) => {
  const handleAddToCart = () => !isInCart && addToCart(product);

  const handleRemoveFromCart = () => {
    if (isInCart) {
      removeFromCart(product.id);
    }
  };

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(product);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <div className=" flex flex-col w-full">
      <div className="relative w-full aspect-square overflow-hidden rounded-xs">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover"
          loading="eager"
        />
        
        <button
          className="absolute top-2 right-2 z-10 p-1 bg-white/50 rounded-xs shadow-md"
          onClick={handleFavoriteClick}
        >
          {isFavorite ? (
            <FaHeart className="text-pink-600" size={18} />
          ) : (
            <FaRegHeart className="text-gray-600 hover:text-pink-600" size={18} />
          )}
        </button>
      </div>
      
      <h2 className="text-md font-normal line-clamp-2 mt-2">{product.name}</h2>
      <p className="text-xl font-semibold">{product.price} ₽</p>
      <p className="text-sm font-bold text-gray-600">Артикул {product.sku}</p>


      <div className="flex gap-2 mt-auto">
        {mode !== "favorites" ? (
          <>
            <button
              className={`flex-grow px-4 py-2 rounded-xs text-white text-sm ${isInCart ? "bg-green-600" : "bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-xl"}`}
              onClick={handleAddToCart}
              disabled={isInCart}
            >
              {isInCart ? "В корзине" : "Добавить в корзину"}
            </button>
          </>
        ) : (
          <button
            className={`w-full px-4 py-2 rounded-xs text-white ${isInCart ? "bg-green-600" : "bg-blue-500 text-white hover:bg-blue-600"} text-sm`}
            onClick={handleAddToCart}
            disabled={isInCart}
          >
            {isInCart ? "В корзине" : "Добавить в корзину"}
          </button>
        )}

        {isInCart && (
          <div className="flex items-center">
            <button
              onClick={handleRemoveFromCart}
              className="text-gray-400 hover:text-red-600 flex items-center"
            >
              <FaTrash size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
