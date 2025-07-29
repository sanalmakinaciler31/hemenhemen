"use client";

import React, { useEffect, useState, useRef } from "react";
import { FaMapMarkerAlt, FaHome, FaMoneyBillWave, FaSearch, FaHeart, FaShareAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Ilan {
  id: number;
  baslik: string;
  aciklama: string;
  fiyat: number;
  konum: string;
  odaSayisi: number;
  metrekare: number;
  tip: string;
  fotograflar: string[];
  binaYasi: number;
  esyali: boolean;
  siteIci: boolean;
  aidat: number;
  depozito: number;
  ilanTarihi: string;
  ilanDurumu: string;
  harita: string;
  cephe: string;
  kullanimDurumu: string;
  tapuDurumu: string;
  krediyeUygun: boolean;
  kimden: string;
  banyoSayisi: number;
  balkon: boolean;
  ilanNo: number;
  kat?: string;
  kategori?: string; // Yeni eklenen alan
  oneCikar?: boolean; // Yeni eklenen alan
  oneCikarmaTarihi?: string; // Yeni eklenen alan
}

// 1. Animasyon için yardımcı hook
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return [ref, inView] as const;
}

export default function Home() {
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [arama, setArama] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchIlanlar();
  }, []);

  const fetchIlanlar = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/ilanlar");
      if (!response.ok) throw new Error("İlanlar yüklenemedi");
      const data = await response.json();
      setIlanlar(data);
      setError("");
    } catch (err) {
      setError("İlanlar yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Vitrin ilanları: öne çıkarılmışları tarihe göre sırala
  const vitrinIlanlar = ilanlar.filter(i => i.oneCikar).sort((a, b) => (b.oneCikarmaTarihi || "").localeCompare(a.oneCikarmaTarihi || "")).slice(0, 6);

  // İstatistikler
  const toplamIlan = ilanlar.length;
  const toplamSatilik = ilanlar.filter(i => i.tip === "Satılık").length;
  const toplamKiralik = ilanlar.filter(i => i.tip === "Kiralık").length;

  const KATEGORI_KUTULARI = [
    { label: "Satılık Daire", icon: <FaHome />, color: "bg-blue-100 text-blue-700" },
    { label: "Kiralık Daire", icon: <FaHome />, color: "bg-green-100 text-green-700" },
    { label: "Villa", icon: <FaHome />, color: "bg-orange-100 text-orange-700" },
    { label: "Residence", icon: <FaHome />, color: "bg-purple-100 text-purple-700" },
    { label: "Müstakil Ev", icon: <FaHome />, color: "bg-yellow-100 text-yellow-700" },
    { label: "Öğrenciye Uygun", icon: <FaHome />, color: "bg-pink-100 text-pink-700" },
    { label: "Lüks", icon: <FaHome />, color: "bg-gray-100 text-gray-700" },
    { label: "Eşyalı", icon: <FaHome />, color: "bg-blue-50 text-blue-600" },
    { label: "Site İçi", icon: <FaHome />, color: "bg-green-50 text-green-600" },
  ];
  const BOLGELER = ["Aydın", "Kuşadası", "Didim", "Bodrum", "Muğla", "Söke"];

  const visibleCount = 3;
  const ilanlarCount = ilanlar.length;
  const [sliderIndex, setSliderIndex] = useState(visibleCount); // Ortada başlasın
  const [isTransitioning, setIsTransitioning] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Ghost kartlar eklenmiş dizi (başta ve sonda)
  const getLoopedIlanlar = () => {
    if (ilanlarCount === 0) return [];
    const arr = [
      ...ilanlar.slice(-visibleCount),
      ...ilanlar,
      ...ilanlar.slice(0, visibleCount)
    ];
    return arr;
  };
  const loopedIlanlar = getLoopedIlanlar();
  const totalSlides = ilanlarCount + 2 * visibleCount;

  const handleLeft = () => {
    if (isTransitioning || ilanlarCount === 0) return;
    setIsTransitioning(true);
    setSliderIndex((prev) => prev - 1);
  };
  const handleRight = () => {
    if (isTransitioning || ilanlarCount === 0) return;
    setIsTransitioning(true);
    setSliderIndex((prev) => prev + 1);
  };
  // Animasyon bitince sonsuz döngü için index'i sıçrat
  useEffect(() => {
    if (!isTransitioning) return;
    const handle = setTimeout(() => {
      setIsTransitioning(false);
      if (sliderIndex === 0) {
        setSliderIndex(ilanlarCount);
      } else if (sliderIndex === ilanlarCount + visibleCount) {
        setSliderIndex(visibleCount);
      }
    }, 400); // animasyon süresiyle aynı olmalı
    return () => clearTimeout(handle);
  }, [sliderIndex, isTransitioning, ilanlarCount]);

  // SSS sekmeleri ve soruları
  const SSS_TABS = [
    { key: 'genel', label: 'Genel' },
    { key: 'finans', label: 'Finansman ve Ödeme' },
    { key: 'ekspertiz', label: 'Ekspertiz ve Kontrol' },
    { key: 'satis', label: 'Satış' },
    { key: 'sonrasi', label: 'Satış Sonrası' },
    { key: 'takas', label: 'Takas' },
  ];
  // SSS_QUESTIONS'ın tipini belirginleştir
  const SSS_QUESTIONS: Record<string, { q: string; a: string }[]> = {
    genel: [
      { q: 'Sitede ilan ekleyebilir miyim?', a: 'Şu anda ilan ekleme işlemleri sadece yetkili emlak ofisleri tarafından yapılmaktadır. Tüm ilanlar profesyonel olarak yönetilmektedir.' },
      { q: 'Emlakçı sitesinde hangi bölgelerde ilan bulabilirim?', a: 'Aydın, Kuşadası, Didim, Bodrum, Muğla, Söke ve çevresindeki tüm ilanlara ulaşabilirsiniz.' },
      { q: 'Satılık ve kiralık ilanlar arasında nasıl filtreleme yapabilirim?', a: 'İlanlar sayfasında gelişmiş filtreleri kullanabilirsiniz.' },
      { q: 'Emlak danışmanları ile nasıl iletişime geçebilirim?', a: 'İlan detayında veya istatistik kutusunda iletişim butonlarını kullanabilirsiniz.' },
    ],
    finans: [
      { q: 'Krediye uygun ilanlar nasıl bulunur?', a: 'Filtrelerde "Krediye Uygun" seçeneğini işaretleyebilirsiniz.' },
      { q: 'Aidat ve depozito bilgileri nerede?', a: 'İlan detayında tüm finansal bilgiler yer alır.' },
    ],
    ekspertiz: [
      { q: 'İlanlardaki bilgiler güvenilir mi?', a: 'Tüm ilanlar emlak ofisimiz tarafından kontrol edilmektedir.' },
    ],
    satis: [
      { q: 'Satın alma süreci nasıl ilerliyor?', a: 'İlan sahibiyle iletişime geçip, tapu işlemlerini başlatabilirsiniz.' },
    ],
    sonrasi: [
      { q: 'Satış sonrası destek veriyor musunuz?', a: 'Evet, ofisimiz satış sonrası da destek sağlar.' },
    ],
    takas: [
      { q: 'Takas ile ev alabilir miyim?', a: 'Bazı ilanlarda takas seçeneği mevcuttur, detay için ilan sahibine ulaşın.' },
    ],
  };
  const [sssTab, setSssTab] = useState('genel');
  const [sssOpen, setSssOpen] = useState<number|null>(0);

  // Blog yazıları dummy
  const BLOGS = [
    {
      id: 1,
      baslik: "Ev Alırken Dikkat Edilmesi Gereken 10 Önemli Nokta",
      ozet: "Emlak alımında kritik faktörler ve uzman tavsiyeleri ile doğru karar verme rehberi.",
      resim: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
      tarih: "15 Aralık 2024",
      kategori: "Satın Alma Rehberi",
      okumaSuresi: "5 dk"
    },
    {
      id: 2,
      baslik: "Kuşadası'nda Yatırımlık Daire Seçerken Nelere Dikkat Etmeli?",
      ozet: "Kuşadası'nın en değerli bölgeleri ve yatırım potansiyeli yüksek emlak seçenekleri.",
      resim: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop",
      tarih: "12 Aralık 2024",
      kategori: "Yatırım Rehberi",
      okumaSuresi: "7 dk"
    },
    {
      id: 3,
      baslik: "Kira Sözleşmesi Yaparken Bilmeniz Gereken Her Şey",
      ozet: "Kira sözleşmesi hazırlarken dikkat edilmesi gereken yasal detaylar ve pratik öneriler.",
      resim: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop",
      tarih: "10 Aralık 2024",
      kategori: "Kiralama Rehberi",
      okumaSuresi: "6 dk"
    },
    {
      id: 4,
      baslik: "Bodrum'da Villa Kiralama: Sezonluk vs Uzun Dönem",
      ozet: "Bodrum'da villa kiralama seçenekleri ve hangi dönemde ne tür avantajlar sunulduğu.",
      resim: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop",
      tarih: "8 Aralık 2024",
      kategori: "Lüks Emlak",
      okumaSuresi: "8 dk"
    },
    {
      id: 5,
      baslik: "Tapu İşlemleri ve Masrafları: Detaylı Rehber",
      ozet: "Tapu devir işlemleri, gerekli belgeler ve masraf kalemleri hakkında kapsamlı bilgi.",
      resim: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
      tarih: "5 Aralık 2024",
      kategori: "Yasal Rehber",
      okumaSuresi: "10 dk"
    },
    {
      id: 6,
      baslik: "Aydın'da En Çok Tercih Edilen Mahalleler ve Özellikleri",
      ozet: "Aydın'ın en popüler mahalleleri, yaşam standartları ve emlak değerleri analizi.",
      resim: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop",
      tarih: "3 Aralık 2024",
      kategori: "Bölge Analizi",
      okumaSuresi: "9 dk"
    }
  ];

  // 2. Animasyon CSS'i ekle (globals.css'ye de eklenmeli):
  // .animate-fade-in-up { opacity:0; transform:translateY(40px); transition:all 0.7s cubic-bezier(.4,0,.2,1); }
  // .animate-fade-in-up.in-view { opacity:1; transform:translateY(0); }

  // 3. Ana bölümlerde kullan:
  const [bolgelerRef, bolgelerInView] = useInView();
  const [sssRef, sssInView] = useInView();
  const [blogRef, blogInView] = useInView();
  const [danismanRef, danismanInView] = useInView();
  const [istatistikRef, istatistikInView] = useInView();

  const [blogLimit, setBlogLimit] = useState(3);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 font-sans">
      {/* SEO Başlık ve Açıklama */}
      <section className="sr-only">
        <h1>Emlakçı | Aydın, Kuşadası, Didim ve Çevresi Emlak İlanları</h1>
        <p>Aydın, Kuşadası, Didim, Bodrum ve çevresinde satılık ve kiralık emlak ilanları. Öğrenciye uygun, lüks, uygun fiyatlı evler ve daha fazlası.</p>
      </section>

      {/* 1. Hero alanı: büyük arka plan fotoğrafı, önde arama barı ve sekmeler */}
      <div className="relative w-full h-[420px] flex items-center justify-center mb-10">
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80" alt="Aydın Emlak" className="absolute inset-0 w-full h-full object-cover brightness-75" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-white/10 to-orange-900/60" />
        <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg text-center mb-2">Aydın ve Ege'de Satılık & Kiralık Emlak</h1>
          <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center">
            <input
              type="text"
              value={arama}
              onChange={e => setArama(e.target.value)}
              placeholder="İlan No, başlık, konum veya anahtar kelime..."
              className="flex-1 p-5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg shadow-sm bg-white/90 placeholder-gray-500 text-gray-900"
            />
            <button
              onClick={() => router.push(`/ilanlar?arama=${encodeURIComponent(arama)}`)}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow"
            >
              Ara
            </button>
          </div>
        </div>
      </div>

      {/* Arama çubuğunun hemen altına yatay kaydırmalı portföy sliderı ekliyorum, satılık/kiralık portföyleri kaldırıyorum. */}
      <div className="max-w-7xl mx-auto px-2 md:px-4 mt-[-2rem] mb-10 z-20 relative">
        <h2 className="text-2xl font-extrabold text-blue-800 mb-6 tracking-tight">Size Özel Evler</h2>
        <div className="relative">
          {/* Sol Fade ve Ok */}
          <div className="absolute left-0 top-0 h-full w-24 z-20 pointer-events-none select-none" style={{background: 'linear-gradient(90deg, rgba(255,255,255,0.95) 70%, rgba(255,255,255,0))'}} />
          <button onClick={handleLeft} className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white shadow-lg rounded-full p-3 text-2xl text-blue-700 border border-blue-100 transition-all active:scale-90" style={{pointerEvents:'auto'}} aria-label="Sola Kaydır">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L10 14L18 22" /></svg>
          </button>
          {/* Sağ Fade ve Ok */}
          <div className="absolute right-0 top-0 h-full w-24 z-20 pointer-events-none select-none" style={{background: 'linear-gradient(270deg, rgba(255,255,255,0.95) 70%, rgba(255,255,255,0))'}} />
          <button onClick={handleRight} className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white shadow-lg rounded-full p-3 text-2xl text-blue-700 border border-blue-100 transition-all active:scale-90" style={{pointerEvents:'auto'}} aria-label="Sağa Kaydır">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3"><path d="M10 6L18 14L10 22" /></svg>
          </button>
          {/* Slider */}
          <div className="overflow-hidden pb-4">
            <div
              ref={trackRef}
              className="flex gap-6"
              style={{
                width: `${340 * totalSlides + 24 * (totalSlides - 1)}px`,
                transform: `translateX(-${sliderIndex * (340 + 24)}px)` ,
                transition: isTransitioning ? 'transform 0.4s cubic-bezier(.7,0,.3,1)' : 'none',
              }}
              onTransitionEnd={() => {
                setIsTransitioning(false);
                if (sliderIndex === 0) {
                  setSliderIndex(ilanlarCount);
                } else if (sliderIndex === ilanlarCount + visibleCount) {
                  setSliderIndex(visibleCount);
                }
              }}
            >
              {loopedIlanlar.map((ilan, idx) => (
                <div key={idx + '-' + ilan.id} data-slider-card className="min-w-[340px] max-w-[340px] bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden group hover:shadow-2xl transition-all relative hover:-translate-y-1 duration-200 snap-center">
                  <div className="relative h-56 w-full">
                    <img src={ilan.fotograflar[0] || '/uploads/placeholder.jpg'} alt={ilan.baslik} className="object-cover w-full h-full" onError={e => { (e.target as HTMLImageElement).src = '/uploads/placeholder.jpg'; }} />
                    <button className="absolute top-3 right-3 bg-white/80 rounded-full p-2 shadow text-gray-500 hover:bg-gray-100"><FaHeart /></button>
                    <button className="absolute top-3 right-12 bg-white/80 rounded-full p-2 shadow text-gray-500 hover:bg-gray-100"><FaShareAlt /></button>
                  </div>
                  <div className="flex-1 flex flex-col justify-between p-6 gap-2">
                    <div className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{ilan.baslik}</div>
                    <div className="text-gray-500 text-sm mb-2 line-clamp-2">{ilan.aciklama}</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">{ilan.binaYasi} Yaş</span>
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">{ilan.odaSayisi}+1</span>
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">{ilan.metrekare} m²</span>
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">{ilan.tip}</span>
                    </div>
                    <div className="text-2xl font-extrabold text-blue-700 mb-2">{ilan.fiyat.toLocaleString()} TL</div>
                    <button onClick={() => router.push(`/ilan/${ilan.id}`)} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-base shadow mt-2">Detay</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bölgeye göre kutular */}
      <div ref={bolgelerRef} className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-12 px-2 md:px-4 animate-fade-in-up${bolgelerInView ? ' in-view' : ''}`}>
        {BOLGELER.map(bolge => {
          const bolgeIlan = ilanlar.filter(i => i.konum.includes(bolge)).slice(0, 3);
          if (bolgeIlan.length === 0) return null;
          return (
            <div key={bolge} className="bg-white rounded-lg shadow border border-gray-200 p-7 flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <FaMapMarkerAlt className="text-orange-500 text-2xl" />
                <h2 className="text-2xl font-bold text-blue-700">{bolge}</h2>
              </div>
              <div className="space-y-4">
                {bolgeIlan.map(ilan => (
                  <div key={ilan.id} className="flex gap-4 items-center border-b border-gray-100 pb-4 last:border-b-0">
                    <img src={ilan.fotograflar[0] || '/uploads/placeholder.jpg'} alt={ilan.baslik} className="w-24 h-20 object-cover rounded border border-gray-200" onError={e => { (e.target as HTMLImageElement).src = '/uploads/placeholder.jpg'; }} />
                    <div className="flex-1">
                      <div className="font-bold text-gray-800 text-base line-clamp-1">{ilan.baslik}</div>
                      <div className="text-xs text-gray-500">{ilan.odaSayisi}+1 | {ilan.metrekare} m²</div>
                      <div className="text-xs text-blue-700 font-bold">{ilan.fiyat.toLocaleString()} TL</div>
                    </div>
                    <button onClick={() => router.push(`/ilan/${ilan.id}`)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-bold text-xs">Detay</button>
                  </div>
                ))}
              </div>
              <button onClick={() => router.push(`/ilanlar?adres=${encodeURIComponent(bolge)}`)} className="w-full mt-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded font-bold py-2">Tüm {bolge} İlanlarını Gör</button>
            </div>
          );
        })}
      </div>

    
      {/* SSS ve Blog Yazıları */}
      <div ref={sssRef} className={`max-w-7xl mx-auto px-2 md:px-4 pb-12 animate-fade-in-up${sssInView ? ' in-view' : ''}`}>
        {/* Sıkça Sorulan Sorular */}
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Sıkça Sorulan Sorular</h2>
        <div className="flex gap-2 mb-6 flex-wrap">
          {SSS_TABS.map(tab => (
            <button key={tab.key} onClick={()=>{setSssTab(tab.key);setSssOpen(0);}} className={`px-5 py-2 rounded-full font-semibold border transition-all ${sssTab===tab.key?"bg-green-200 text-black border-green-400":"bg-white text-black border-gray-200 hover:bg-gray-100"}`}>{tab.label}</button>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-10">
          {SSS_QUESTIONS[sssTab].map((item: {q: string; a: string}, i: number) => (
            <div key={i} className="mb-2">
              <button onClick={()=>setSssOpen(sssOpen===i?null:i)} className="flex items-center w-full text-lg font-semibold text-left gap-2 py-2 text-gray-900">
                <span className="text-2xl">{sssOpen===i?"–":"+"}</span>
                {item.q}
              </button>
              {sssOpen===i && <div className="bg-gray-50 rounded p-4 text-gray-800 text-base mt-1 mb-2">{item.a}</div>}
            </div>
          ))}
        </div>
        {/* Blog Yazıları */}
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Blog Yazıları</h2>
        <div className="flex gap-6 flex-wrap mb-10">
          {BLOGS.slice(0, blogLimit).map((b,i)=>(
            <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-200 max-w-xs min-w-[320px] flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <img src={b.resim} alt={b.baslik} className="h-48 w-full object-cover" />
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">{b.kategori}</span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 text-gray-700 px-2 py-1 rounded text-xs font-medium">{b.okumaSuresi}</span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs text-gray-500 mb-2">{b.tarih}</div>
                <div className="font-bold text-lg mb-3 text-gray-900 line-clamp-2">{b.baslik}</div>
                <div className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">{b.ozet}</div>
                <a href={`/blog/${b.id}`} className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm">
                  Devamını Oku
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
          {blogLimit < BLOGS.length && (
            <div className="flex items-center">
              <button onClick={()=>setBlogLimit(BLOGS.length)} className="px-6 py-3 rounded-full border border-black text-black font-semibold hover:bg-gray-100 transition">Tümünü Göster</button>
            </div>
          )}
        </div>
      </div>

      {/* Danışmanlar ve istatistik kutuları modernleştirildi, iletişim butonları istatistiğe taşındı */}
      <div ref={danismanRef} className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 pb-6 px-2 md:px-4 animate-fade-in-up${danismanInView ? ' in-view' : ''}`}>
        <div className="bg-gradient-to-br from-blue-50 via-white to-orange-50 rounded-2xl shadow border border-gray-200 p-8 flex flex-col gap-6 items-center">
          <h3 className="font-bold text-blue-800 text-xl mb-2">Danışmanlarımız</h3>
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">AB</div>
              <div className="font-semibold text-gray-700">Ahmet Bilgin</div>
              <div className="text-xs text-gray-500">Aydın Uzmanı</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-2xl font-bold text-orange-700">EZ</div>
              <div className="font-semibold text-gray-700">Elif Zorlu</div>
              <div className="text-xs text-gray-500">Didim Uzmanı</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-700">MK</div>
              <div className="font-semibold text-gray-700">Mehmet Kaya</div>
              <div className="text-xs text-gray-500">Kuşadası Uzmanı</div>
            </div>
          </div>
        </div>
        {/* İstatistikler & Hızlı İletişim kutusunda iletişim butonlarını kaldır, daire şeklinde yüzdelik gösterim ekle */}
        <div ref={istatistikRef} className={`bg-gradient-to-br from-orange-50 via-white to-blue-50 rounded-2xl shadow border border-gray-200 p-8 flex flex-col gap-6 items-center animate-fade-in-up${istatistikInView ? ' in-view' : ''}`}>
          <h3 className="font-bold text-blue-800 text-xl mb-2">İstatistikler</h3>
          <div className="flex flex-wrap gap-8 justify-center items-center w-full">
            {/* Toplam İlan */}
            <div className="flex flex-col items-center">
              <svg width="90" height="90" viewBox="0 0 36 36" className="mb-2">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#f59e42" strokeWidth="4" strokeDasharray="100,100" strokeDashoffset="0" />
              </svg>
              <div className="text-2xl font-extrabold text-orange-600">{ilanlar.length}</div>
              <div className="text-sm text-gray-700 font-semibold">Toplam İlan</div>
            </div>
            {/* Satılık */}
            <div className="flex flex-col items-center">
              <svg width="90" height="90" viewBox="0 0 36 36" className="mb-2">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray={`${Math.round((toplamSatilik/ilanlar.length)*100)},100`} strokeDashoffset="0" />
              </svg>
              <div className="text-2xl font-extrabold text-green-600">{toplamSatilik}</div>
              <div className="text-sm text-gray-700 font-semibold">Satılık</div>
            </div>
            {/* Kiralık */}
            <div className="flex flex-col items-center">
              <svg width="90" height="90" viewBox="0 0 36 36" className="mb-2">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#2563eb" strokeWidth="4" strokeDasharray={`${Math.round((toplamKiralik/ilanlar.length)*100)},100`} strokeDashoffset="0" />
              </svg>
              <div className="text-2xl font-extrabold text-blue-600">{toplamKiralik}</div>
              <div className="text-sm text-gray-700 font-semibold">Kiralık</div>
            </div>
            {/* Mutlu Müşteri */}
            <div className="flex flex-col items-center">
              <svg width="90" height="90" viewBox="0 0 36 36" className="mb-2">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#facc15" strokeWidth="4" strokeDasharray="100,100" strokeDashoffset="0" />
              </svg>
              <div className="text-2xl font-extrabold text-yellow-600">1000+</div>
              <div className="text-sm text-gray-700 font-semibold">Mutlu Müşteri</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-blue-400 mb-4">kiracemlak.com</h3>
              <p className="text-gray-300 mb-4">Aydın ve çevresinde güvenilir emlak danışmanınız. Satılık ve kiralık evler için doğru adres: kiracemlak.com</p>
              
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Hızlı Linkler</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-300 hover:text-blue-400 transition-colors">Ana Sayfa</a></li>
                <li><a href="/ilanlar" className="text-gray-300 hover:text-blue-400 transition-colors">Tüm İlanlar</a></li>
                <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Satılık</a></li>
                <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Kiralık</a></li>
                <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">İletişim</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Bölgeler</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Aydın</a></li>
                <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Kuşadası</a></li>
                <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Didim</a></li>
                <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Bodrum</a></li>
                <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Muğla</a></li>
                <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Söke</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">İletişim</h4>
              <div className="space-y-3">
                
                
              <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  <a href="https://www.instagram.com/kiracemlak/" target="_blank" rel="noopener" className="text-gray-300 hover:text-pink-400 transition-colors">Instagram</a>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  <span className="text-gray-300">Ofis: 0526 512 86 29</span>
                  <a href="https://wa.me/905265128629" target="_blank" rel="noopener" className="ml-2 px-3 py-1 rounded-full bg-green-600 text-white font-bold text-xs hover:bg-green-700 transition">WhatsApp</a>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  <span className="text-gray-300">Cep: 0532 624 83 90</span>
                  <a href="https://wa.me/905326248390" target="_blank" rel="noopener" className="ml-2 px-3 py-1 rounded-full bg-green-600 text-white font-bold text-xs hover:bg-green-700 transition">WhatsApp</a>
                </div>
              </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 kiracemlak.com. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
