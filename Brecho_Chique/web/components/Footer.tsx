import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#1a0b10] border-t border-[#e6e0e2] dark:border-[#3a2a30] pt-16 pb-8">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 text-primary mb-4">
              <span className="material-symbols-outlined !text-3xl">checkroom</span>
              <h2 className="text-[#181113] dark:text-white text-xl font-extrabold">Chic Thrift</h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              Redefinindo o consumo de moda com peças curadas, sustentáveis e cheias de estilo. O luxo que cabe no seu bolso e ajuda o planeta.
            </p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2a1b20] flex items-center justify-center text-[#181113] dark:text-white hover:bg-primary hover:text-white transition-colors" href="#">
                <span className="material-symbols-outlined text-lg">public</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2a1b20] flex items-center justify-center text-[#181113] dark:text-white hover:bg-primary hover:text-white transition-colors" href="#">
                <span className="material-symbols-outlined text-lg">photo_camera</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2a1b20] flex items-center justify-center text-[#181113] dark:text-white hover:bg-primary hover:text-white transition-colors" href="#">
                <span className="material-symbols-outlined text-lg">alternate_email</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-[#181113] dark:text-white font-bold text-lg mb-6">Comprar</h3>
            <ul className="flex flex-col gap-3">
              <li><a className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm" href="#">Novidades</a></li>
              <li><a className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm" href="#">Roupas</a></li>
              <li><a className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm" href="#">Acessórios</a></li>
              <li><a className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm" href="#">Marcas de Luxo</a></li>
              <li><a className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm" href="#">Promoções</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#181113] dark:text-white font-bold text-lg mb-6">Ajuda</h3>
            <ul className="flex flex-col gap-3">
              <li><a className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm" href="#">Como Vender</a></li>
              <li><a className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm" href="#">Envio e Entregas</a></li>
              <li><a className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm" href="#">Trocas e Devoluções</a></li>
              <li><a className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm" href="#">Guia de Medidas</a></li>
              <li><a className="text-gray-500 dark:text-gray-400 hover:text-primary text-sm" href="#">Fale Conosco</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#181113] dark:text-white font-bold text-lg mb-6">Newsletter</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Receba novidades e ofertas exclusivas em primeira mão.</p>
            <form className="flex flex-col gap-3">
              <input className="w-full px-4 py-3 rounded-lg bg-background-light dark:bg-[#2a1b20] border border-transparent focus:border-primary focus:ring-0 text-sm outline-none transition-all" placeholder="Seu e-mail" type="email"/>
              <button className="w-full bg-[#181113] dark:bg-white text-white dark:text-[#181113] font-bold py-3 rounded-lg hover:opacity-90 transition-opacity" type="button">Inscrever-se</button>
            </form>
          </div>
        </div>
        <div className="border-t border-[#e6e0e2] dark:border-[#3a2a30] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">© 2024 Chic Thrift. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <a className="text-gray-400 hover:text-primary text-xs" href="#">Termos de Uso</a>
            <a className="text-gray-400 hover:text-primary text-xs" href="#">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
