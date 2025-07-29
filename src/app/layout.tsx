import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Head from 'next/head';
// import { usePathname } from 'next/navigation'; // KALDIRILDI

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Emlakçı | Aydın, Kuşadası, Didim ve Çevresi Emlak İlanları',
  description: 'Aydın, Kuşadası, Didim, Bodrum ve çevresinde satılık ve kiralık emlak ilanları. Öğrenciye uygun, lüks, uygun fiyatlı evler ve daha fazlası.',
  keywords: 'emlak, aydın, kuşadası, didim, bodrum, söke, muğla, satılık, kiralık, öğrenci evi, villa, daire',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <Head>
        <title>Aydın Emlak | Satılık Kiralık Daire Villa | emlakci.com</title>
        <meta name="description" content="Aydın, Kuşadası, Didim, Bodrum, Muğla, Söke ve Ege bölgesinde satılık ve kiralık daire, villa, lüks konut, öğrenciye uygun ev ilanları. Emlak ofislerinden güncel portföyler." />
        <meta name="keywords" content="aydın emlak, kuşadası emlak, didim emlak, bodrum emlak, muğla emlak, satılık daire, kiralık daire, villa, lüks emlak, öğrenciye uygun ev, emlak ofisi, emlak ilanı, gayrimenkul, ev ilanı, aydın satılık daire, kuşadası kiralık ev, didim satılık villa, bodrum satılık daire, muğla kiralık daire, söke satılık ev, aydın emlakçıları, aydın emlak sitesi, ege emlak, ege satılık ev, ege kiralık ev, aydın gayrimenkul, aydın konut, aydın villa, aydın residence, aydın müstakil ev, aydın öğrenci evi, aydın lüks daire, aydın site içi daire, aydın eşyalı daire, aydın krediye uygun daire, aydın sahibinden daire, aydın emlak ofisi, aydın emlak danışmanı, aydın emlak portföyü, aydın emlak ilanları, aydın emlak blogu, aydın emlak haberleri, aydın emlak sektörü, aydın emlak yatırımı, aydın emlak fiyatları, aydın emlak piyasası, aydın emlak kampanya, aydın emlak fırsatları, aydın emlak projeleri, aydın emlak kampanyaları, aydın emlak güncel, aydın emlak yeni, aydın emlak popüler, aydın emlak önerilen, aydın emlak öne çıkan, aydın emlak vitrin, aydın emlak müşteri yorumu, aydın emlak danışmanları, aydın emlak istatistikleri, aydın emlak iletişim, aydın emlak telefon, aydın emlak whatsapp, aydın emlak instagram, aydın emlak facebook, aydın emlak sosyal medya, aydın emlak iletişim bilgileri, aydın emlak ofisleri, aydın emlak firmaları, aydın emlak şirketleri, aydın emlak ajansları, aydın emlak acenteleri, aydın emlak danışmanlık, aydın emlak hizmetleri, aydın emlak çözümleri, aydın emlak desteği, aydın emlak müşteri hizmetleri, aydın emlak müşteri memnuniyeti, aydın emlak müşteri desteği, aydın emlak müşteri ilişkileri, aydın emlak müşteri deneyimi, aydın emlak müşteri yorumları, aydın emlak müşteri referansları, aydın emlak müşteri tavsiyeleri, aydın emlak müşteri önerileri, aydın emlak müşteri şikayetleri, aydın emlak müşteri memnuniyet anketi, aydın emlak müşteri memnuniyet oranı, aydın emlak müşteri memnuniyet puanı, aydın emlak müşteri memnuniyet raporu, aydın emlak müşteri memnuniyet değerlendirmesi, aydın emlak müşteri memnuniyet analizi, aydın emlak müşteri memnuniyet araştırması, aydın emlak müşteri memnuniyet ölçümü, aydın emlak müşteri memnuniyet endeksi, aydın emlak müşteri memnuniyet göstergesi, aydın emlak müşteri memnuniyet kriterleri, aydın emlak müşteri memnuniyet faktörleri, aydın emlak müşteri memnuniyet nedenleri, aydın emlak müşteri memnuniyet sonuçları, aydın emlak müşteri memnuniyet verileri, aydın emlak müşteri memnuniyet istatistikleri" />
        <meta property="og:title" content="Aydın Emlak | Satılık Kiralık Daire Villa | emlakci.com" />
        <meta property="og:description" content="Aydın ve Ege bölgesinde satılık, kiralık, lüks ve öğrenciye uygun emlak ilanları. Emlak ofislerinden güncel portföyler." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kiracemlak.com/" />
        <meta property="og:image" content="https://emlakci.com/og-image.jpg" />
        <link rel="canonical" href="https://kiracemlak.com/" />
        <link rel="alternate" hrefLang="tr" href="https://kiracemlak.com/" />
        <meta name="robots" content="index, follow" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body className={inter.className}>
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 shadow transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            {/* Sol: Logo */}
            <a href="/" className="text-3xl font-extrabold text-blue-700 tracking-tight drop-shadow-lg hover:text-blue-800 transition-colors">
              kiracemlak.com
            </a>
            {/* Orta: Geri butonu */}
            <div id="sticky-back-btn" className="hidden md:block flex-1 text-center"></div>
            {/* Sağ: Telefon ve WhatsApp */}
            <div className="flex gap-4 items-center">
              <div className="flex flex-col text-right">
                <span className="font-bold text-blue-900 text-base leading-tight">Ofis: 0526 512 86 29</span>
                <span className="font-bold text-blue-900 text-base leading-tight">Cep: 0532 624 83 90</span>
              </div>
              <a href="https://wa.me/905326248390" target="_blank" rel="noopener" className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 hover:bg-green-100 text-green-700 font-bold border border-green-200 shadow-sm transition-all text-base whitespace-nowrap">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </header>
        {children}
        <script dangerouslySetInnerHTML={{__html:`
          (function(){
            function updateBackBtn(){
              var btn = document.getElementById('sticky-back-btn');
              if(!btn) return;
              if(window.location.pathname !== '/'){
                btn.innerHTML = '<button onclick="window.history.back()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold shadow transition-all flex items-center gap-2"><span style=\'font-size:1.2em\'>&larr;</span> Geri</button>';
              }else{
                btn.innerHTML = '';
              }
            }
            window.addEventListener('popstate', updateBackBtn);
            window.addEventListener('DOMContentLoaded', updateBackBtn);
            window.addEventListener('pushstate', updateBackBtn);
            window.addEventListener('replacestate', updateBackBtn);
            setTimeout(updateBackBtn, 100);
          })();
        `}} />
      </body>
    </html>
  )
}
