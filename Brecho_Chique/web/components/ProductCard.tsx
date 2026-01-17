'use client';

interface ProductProps {
  id: string;
  title: string;
  price: number;
  original_price: number | null;
  brand: string;
  size: string;
  images: string[];
  status: string;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;
    
  // Simple check for "NOVO" tag if status implies (or we can add a field later)
  // For now, let's replicate the structure.
  
  return (
    <div className="group flex flex-col gap-3 relative">
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 dark:bg-[#2a1b20]">
        
        {/* Badges */}
        {discount > 0 && (
           <div className="absolute top-3 left-3 bg-primary/90 text-white px-2 py-1 rounded text-xs font-bold z-20">-{discount}%</div>
        )}
        
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-black/60 hover:bg-white hover:text-primary transition-colors z-20 text-[#181113] dark:text-white">
          <span className="material-symbols-outlined text-[20px]">favorite</span>
        </button>

        <div className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110" 
             style={{ backgroundImage: `url("${product.images[0]}")` }}>
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center pb-6 bg-gradient-to-t from-black/50 to-transparent">
          <button className="w-full bg-white text-[#181113] hover:bg-primary hover:text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors">
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            Adicionar
          </button>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide">{product.brand}</p>
            <h3 className="text-[#181113] dark:text-white text-base font-semibold leading-tight mt-1 truncate">{product.title}</h3>
          </div>
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            {product.size}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-primary text-lg font-bold">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </p>
          {product.original_price && (
            <p className="text-gray-400 text-sm line-through decoration-1">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.original_price)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
