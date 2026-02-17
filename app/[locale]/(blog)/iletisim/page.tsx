
export default function ContactPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 pt-72">
            <h1 className="text-4xl font-serif text-black mb-8 text-center">İletişim</h1>
            <p className="text-center text-gray-500 max-w-2xl mx-auto mb-16">
                Projeleriniz, sorularınız veya sadece merhaba demek için aşağıdaki formu kullanabilir veya sosyal medya hesaplarımdan bana ulaşabilirsiniz.
            </p>

            <div className="grid md:grid-cols-2 gap-16">

                {/* İletişim Bilgileri */}
                <div>
                    <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Bağlantıda Kalalım</h2>
                    <p className="text-gray-600 leading-relaxed mb-8">
                        Yeni teknolojiler, iş birlikleri ve freelance projeler hakkında konuşmaktan her zaman keyif alırım. E-posta yoluyla en hızlı şekilde dönüş yaparım.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <span className="text-xl">📧</span>
                            <div>
                                <h3 className="font-bold text-gray-900">E-Posta</h3>
                                <a href="mailto:iletisim@talhakeskin.com" className="text-blue-600 hover:underline">
                                    iletisim@talhakeskin.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <span className="text-xl">📍</span>
                            <div>
                                <h3 className="font-bold text-gray-900">Konum</h3>
                                <p className="text-gray-600">İstanbul, Türkiye</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <span className="text-xl">🌐</span>
                            <div>
                                <h3 className="font-bold text-gray-900">Sosyal Medya</h3>
                                <div className="flex gap-4 mt-2">
                                    <a href="#" className="text-gray-400 hover:text-black transition-colors">Twitter</a>
                                    <a href="#" className="text-gray-400 hover:text-black transition-colors">LinkedIn</a>
                                    <a href="#" className="text-gray-400 hover:text-black transition-colors">GitHub</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* İletişim Formu */}
                <div className="bg-gray-50 p-8 border border-gray-100">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                Adınız Soyadınız
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                placeholder="Adınız"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                E-Posta Adresiniz
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                placeholder="ornek@domain.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                Mesajınız
                            </label>
                            <textarea
                                id="message"
                                rows={5}
                                className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                                placeholder="Mesajınızı buraya yazın..."
                            ></textarea>
                        </div>

                        <button
                            type="button"
                            className="w-full bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                        >
                            Gönder
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
