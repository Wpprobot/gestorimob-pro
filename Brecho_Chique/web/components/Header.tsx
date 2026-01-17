'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e6e0e2] dark:border-b-[#3a2a30] px-10 py-4 bg-white dark:bg-[#1a0b10] sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined !text-4xl">checkroom</span>
          <h2 className="text-[#181113] dark:text-white text-2xl font-extrabold leading-tight tracking-[-0.015em]">
            Chic Thrift
          </h2>
        </div>
        <div className="hidden lg:flex items-center gap-8">
          <Link href="#" className="text-[#181113] dark:text-gray-200 text-sm font-bold hover:text-primary transition-colors leading-normal">
            Novidades
          </Link>
          <Link href="#" className="text-[#181113] dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors leading-normal">
            Roupas
          </Link>
          <Link href="#" className="text-[#181113] dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors leading-normal">
            Acessórios
          </Link>
          <Link href="#" className="text-[#181113] dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors leading-normal">
            Vender
          </Link>
          <Link href="#" className="text-[#181113] dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors leading-normal">
            Contato
          </Link>
        </div>
      </div>
      <div className="flex flex-1 justify-end gap-6 items-center">
        <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-full h-full border border-[#e6e0e2] dark:border-[#3a2a30] bg-white dark:bg-[#2a1b20] focus-within:border-primary">
            <div className="text-[#89616f] flex border-none items-center justify-center pl-4 rounded-l-full border-r-0">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <input
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-[#181113] dark:text-white focus:outline-none focus:ring-0 border-none bg-transparent h-full placeholder:text-[#89616f] px-3 rounded-l-none border-l-0 text-sm font-normal leading-normal"
              placeholder="Buscar peças..."
            />
          </div>
        </label>
        <div className="flex gap-3">
          <button className="flex items-center justify-center rounded-full size-10 bg-white dark:bg-[#2a1b20] border border-[#e6e0e2] dark:border-[#3a2a30] text-[#181113] dark:text-white hover:bg-gray-50 dark:hover:bg-[#3a2a30] transition-colors relative group">
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              2
            </span>
          </button>
          <button className="flex items-center justify-center rounded-full size-10 bg-white dark:bg-[#2a1b20] border border-[#e6e0e2] dark:border-[#3a2a30] text-[#181113] dark:text-white hover:bg-gray-50 dark:hover:bg-[#3a2a30] transition-colors">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
          <button className="lg:hidden flex items-center justify-center rounded-full size-10 bg-white dark:bg-[#2a1b20] border border-[#e6e0e2] dark:border-[#3a2a30] text-[#181113] dark:text-white">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
