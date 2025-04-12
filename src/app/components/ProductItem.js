'use client';

import ImageUploadForm from './ImageUploadForm';

export default function ProductItem({ product }) {
  const handleDelete = async () => {
    if (confirm('Удалить этот товар?')) {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        window.location.reload();
      } else {
        alert('Ошибка при удалении товара');
      }
    }
  };

  return (
    <li className="border-1 border-gray-200 p-4 rounded-xl shadow-md hover:shadow-lg">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-48 h-48 object-cover rounded-lg border"
          />
        )}
        <div className="flex-1 space-y-2">
          <div className="text-lg font-semibold">{product.name}</div>
          <div className="text-sm text-gray-500">₽{product.price.toLocaleString('ru-RU')}</div>

          <ImageUploadForm productId={product.id} />
          <button
            onClick={handleDelete}
            className="inline-block text-red-600 text-sm hover:text-red-800 transition-colors"
          >
            🗑 Удалить товар
          </button>
        </div>
      </div>
    </li>
  );
}
