"use client";

import Link from 'next/link';
import Slider_banners from './components/slider';
import CategoryList from './components/categoryList';
import "./globals.css";

function App() {

  return (
    <div className="container mx-auto">

      <Slider_banners />

      <div className="mt-12">
        <CategoryList />
      </div>

      {/* <div className="flex justify-center gap-4 mt-6">
        <Link href="/catalog">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Каталог</button>
        </Link>
        <Link href="/favorites">
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Избранное</button>
        </Link>
        <Link href="/cart">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Корзина</button>
        </Link>
        <Link href="/admin">
          <button className="bg-gray-800 text-white px-4 py-2 rounded-lg">Админ-панель</button>
        </Link>
        <a href="/profile" className="text-blue-600 hover:underline">Профиль</a>
      </div> */}

    </div>
  );
}

export default App;
