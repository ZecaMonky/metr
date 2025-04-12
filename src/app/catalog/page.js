"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Product from "../components/product";

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();

  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("cart")) || [];
    }
    return [];
  });

  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("favorites")) || [];
    }
    return [];
  });

  const [categoryId, setCategoryId] = useState(null);
  const [subcategoryId, setSubcategoryId] = useState(null);

  useEffect(() => {
    const initialSearch = searchParams.get("search") || "";
    const initialCategoryId = searchParams.get("categoryId");
    const initialSubcategoryId = searchParams.get("subcategoryId");

    setSearchQuery(initialSearch);
    setCategoryId(initialCategoryId);
    setSubcategoryId(initialSubcategoryId);

    const fetchProducts = async () => {
      let url = `/api/products?search=${initialSearch}`;
    
      if (initialCategoryId) {
        url += `&categoryId=${initialCategoryId}`;
      }
    
      if (initialSubcategoryId) {
        url += `&subcategoryId=${initialSubcategoryId}`;
      }
    
      const res = await fetch(url);
      const data = await res.json();
    
      if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        console.error("Ошибка: Ожидался массив продуктов, но получен:", data);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [cart, favorites]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      if (prevCart.some((item) => item.id === product.id)) return prevCart;
      return [...prevCart, product];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      return prevCart.filter((item) => item.id !== productId);
    });
  };

  const addToFavorites = (product) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((item) => item.id === product.id)) {
        return prevFavorites.filter((item) => item.id !== product.id);
      } else {
        return [...prevFavorites, product];
      }
    });
  };

  const removeFromFavorites = (product) => {
    setFavorites((prevFavorites) => {
      return prevFavorites.filter((item) => item.id !== product.id);
    });
  };

  return (
    <div>
      <div className="container mx-auto w-full mt-5 px-4 sm:px-0 sm:mt-10">
        <h1 className="text-2xl font-bold mb-4">Каталог</h1>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {filteredProducts.map((product) => (
            <Product
              key={product.id}
              product={product}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              addToFavorites={addToFavorites}
              removeFromFavorites={removeFromFavorites}
              isInCart={cart.some((item) => item.id === product.id)}
              isFavorite={favorites.some((item) => item.id === product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
