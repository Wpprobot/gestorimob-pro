import { createClient } from '@/lib/supabase-server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
  const { data: products } = await supabase.from('products').select('*');

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      
      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-[1440px] px-4 md:px-10 py-6">
          <div 
            className="rounded-2xl overflow-hidden relative min-h-[500px] flex flex-col justify-center items-start px-8 md:px-16 bg-cover bg-center"
            style={{ backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAdX82oGt3oMlaP3FZU6ujuAaoRuhiWCLHp23baAFtLLekiFDae6mkHwZajl_lIDrZnrG4jwj8PLwrAXaFDg1fCTsurziyqZ361D5naWMw_AtW9ZPmFJ1rbhQ7ABd733315QXQlSgPhfJ87K7fxEtPqmx6v_vsQGkO1pekbPMWkWcxvd9zFC9SJOMe775pUUGwGoR75YAsBq9SvleumpDIMOYXfm5VZ7bEAovBA5Bdnwi1w0OI3T6YuI-kIuS-d8vhfG99X_GooBTZH")' }}
          >
            <div className="flex flex-col gap-4 text-left max-w-2xl relative z-10 animate-fade-in-up">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-wider w-fit">
                Nova Coleção
              </span>
              <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-[-0.033em]">
                Luxo com Propósito
              </h1>
              <h2 className="text-gray-200 text-base md:text-lg font-medium leading-relaxed max-w-lg">
                Curadoria exclusiva de peças únicas de grandes marcas. Renove seu estilo com consciência e autenticidade.
              </h2>
              <div className="pt-4 flex gap-4">
                <button className="flex items-center justify-center rounded-lg h-12 px-8 bg-primary text-white text-base font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                  Ver Novidades
                </button>
                <button className="flex items-center justify-center rounded-lg h-12 px-8 bg-white text-[#181113] text-base font-bold hover:bg-gray-100 transition-colors">
                  Vender Peça
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="w-full max-w-[1440px] px-4 md:px-10 py-4 sticky top-[72px] z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-[#e6e0e2] dark:border-[#3a2a30]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
              <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#2a1b20] border border-[#e6e0e2] dark:border-[#3a2a30] pl-4 pr-3 hover:border-primary transition-colors group">
                <span className="text-[#181113] dark:text-gray-200 text-sm font-medium">Filtrar por</span>
                <span className="material-symbols-outlined text-gray-500 text-lg">tune</span>
              </button>
              <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1"></div>
              {['Categoria', 'Tamanho', 'Marca', 'Preço'].map((filter) => (
                <button key={filter} className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#2a1b20] border border-[#e6e0e2] dark:border-[#3a2a30] pl-4 pr-3 hover:border-primary transition-colors">
                  <span className="text-[#181113] dark:text-gray-200 text-sm font-medium">{filter}</span>
                  <span className="material-symbols-outlined text-gray-400 text-lg">keyboard_arrow_down</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-sm text-gray-500 dark:text-gray-400">{products?.length || 0} produtos</span>
              <button className="flex items-center gap-1 text-sm font-bold text-[#181113] dark:text-white ml-2">
                Relevância <span className="material-symbols-outlined text-lg">sort</span>
              </button>
            </div>
          </div>
        </section>

        {/* Headline */}
        <section className="w-full max-w-[1440px] px-4 md:px-10 pt-8 pb-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-[#181113] dark:text-white text-3xl font-bold leading-tight">Destaques da Semana</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Peças selecionadas que acabaram de chegar.</p>
            </div>
            <a href="#" className="text-primary font-bold text-sm hover:underline hidden sm:block">Ver todos</a>
          </div>
        </section>

        {/* Product Grid */}
        <section className="w-full max-w-[1440px] px-4 md:px-10 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <button className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg border border-[#e6e0e2] dark:border-[#3a2a30] hover:border-primary text-[#181113] dark:text-white font-bold transition-all hover:shadow-md">
              Carregar Mais Produtos
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
