import { FaEnvelope } from "react-icons/fa";

export default function SubscribeWidget() {
    return (
        <div className="relative w-full border border-black dark:border-white mb-12 bg-white dark:bg-win11-card rounded-sm overflow-hidden">

            {/* MANŞET TARZI ETİKET */}
            <div className="absolute top-0 left-0 bg-white dark:bg-win11-card border-b border-r border-black dark:border-white px-4 py-2 z-10 flex items-center gap-2">
                <span className="text-base text-black dark:text-white"><FaEnvelope /></span>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-black dark:text-white">BÜLTEN</span>
            </div>

            {/* İÇERİK */}
            <div className="p-6 pt-12 flex flex-col gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Yeni yazılar, düşünceler ve güncellemelerden haberdar olmak için e-posta listesine katıl.
                </p>

                <form className="flex flex-col gap-3">
                    <input
                        type="email"
                        placeholder="E-posta adresin"
                        className="w-full border border-gray-300 dark:border-white p-2 text-xs text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors bg-gray-50 dark:bg-zinc-800 rounded-sm"
                    />
                    <button
                        type="button"
                        className="w-full bg-black dark:bg-white text-white dark:text-black py-2 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors rounded-sm"
                    >
                        Abone Ol
                    </button>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">Spam yok, sadece içerik.</p>
                </form>
            </div>
        </div>
    );
}
