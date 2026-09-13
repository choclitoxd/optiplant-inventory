import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { ProductService } from '../services/api';

export const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    ProductService.getAll().then(setProducts).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Catálogo de Productos</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">SKU</th>
            <th className="py-2 px-4 border">Nombre</th>
            <th className="py-2 px-4 border">Precio Base</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="text-center">
              <td className="py-2 px-4 border">{p.sku}</td>
              <td className="py-2 px-4 border">{p.name}</td>
              <td className="py-2 px-4 border">${p.basePrice.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
