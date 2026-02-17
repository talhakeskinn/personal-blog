import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pt-72">

      {/* --- ÜST BİLGİ KARTI --- */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
        {/* Profil Resmi Alanı (Resmin yoksa placeholder çıkar) */}
        <div className="w-40 h-40 relative rounded-full overflow-hidden border-4 border-white shadow-xl shrink-0">
          {/* Buraya kendi resminin URL'ini koyabilirsin veya Sanity'den çekebiliriz */}
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl">
            👨‍💻
          </div>
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Talha Keskin</h1>
          <p className="text-blue-600 font-medium text-lg mb-4">Yazar</p>
          <p className="text-gray-600 leading-relaxed max-w-xl">
            Merhaba, ben Talha. Akademik kariyer hedefleyen, Python ve .NET teknolojileriyle ilgilenen bir geliştiriciyim.
            Özellikle Görüntü İşleme (OCR), Modüler Monolitik Mimariler ve Modern Web Teknolojileri üzerine çalışıyorum.
          </p>
        </div>
      </div>

      {/* --- İKİ KOLONLU YAP (YETENEKLER & DENEYİM) --- */}
      <div className="grid md:grid-cols-2 gap-12">

        {/* SOL: YETENEKLER */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">🛠</span>
            Teknik Yetenekler
          </h2>

          <div className="space-y-4">
            {/* Yetenek 1 */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-700">Python & AI (OpenCV, Tesseract)</span>
                <span className="text-gray-500">90%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>

            {/* Yetenek 2 */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-700">.NET Core & Entity Framework</span>
                <span className="text-gray-500">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            {/* Yetenek 3 */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-700">React Native & Expo</span>
                <span className="text-gray-500">70%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ: PROJELER / DENEYİM */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-orange-100 text-orange-600 p-2 rounded-lg mr-3">🚀</span>
            Projeler & Çalışmalar
          </h2>

          <ul className="space-y-6 border-l-2 border-gray-100 ml-3 pl-6 relative">

            {/* Proje 1 */}
            <li className="relative">
              <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm"></span>
              <h3 className="font-bold text-gray-900">PDKS (Personel Takip Sistemi)</h3>
              <p className="text-sm text-gray-500 mb-1">.NET Core, Modular Monolith</p>
              <p className="text-gray-600 text-sm">
                Gelişmiş personel devam kontrol sistemi mimarisi üzerine çalışmalar.
              </p>
            </li>

            {/* Proje 2 */}
            <li className="relative">
              <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-gray-400 border-4 border-white shadow-sm"></span>
              <h3 className="font-bold text-gray-900">Endüstriyel Veri Okuma</h3>
              <p className="text-sm text-gray-500 mb-1">Python, OpenCV</p>
              <p className="text-gray-600 text-sm">
                Dijital flow metrelerden kamera ile gerçek zamanlı veri okuyup veritabanına işleyen sistem.
              </p>
            </li>

          </ul>
        </div>
      </div>

    </div>
  );
}
