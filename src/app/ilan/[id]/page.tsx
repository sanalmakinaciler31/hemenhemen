'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaBed, FaHome, FaMoneyBillWave, FaCouch, FaBuilding, FaCheckCircle, FaBath, FaDoorOpen, FaRegCalendarAlt, FaHeart, FaWhatsapp, FaShareAlt, FaPhone, FaArrowLeft, FaBuilding as FaBuildingIcon, FaUser, FaCreditCard, FaRulerCombined, FaThermometerHalf, FaShieldAlt, FaChevronLeft, FaChevronRight, FaStar, FaEye, FaRegStar, FaRegLightbulb } from 'react-icons/fa';
import Head from 'next/head';

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
  kat?: string; // Yeni eklenen
}

export default function IlanDetay() {
  const params = useParams();
  const router = useRouter();
  const [ilan, setIlan] = useState<Ilan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('Detaylar');
  const TABS: { label: string; key: string }[] = [
    { label: 'Detaylar', key: 'Detaylar' },
    { label: 'Konum', key: 'Konum' },
    { label: 'Satıcı', key: 'Satıcı' },
    { label: 'İletişim', key: 'İletişim' },
  ];

  // Benzer ilanlar (aynı konumdan)
  const [benzerIlanlar, setBenzerIlanlar] = useState<Ilan[]>([]);
  const [tumIlanlar, setTumIlanlar] = useState<Ilan[]>([]);

  useEffect(() => {
    fetch('/api/ilanlar')
      .then(res => res.json())
      .then((data: Ilan[]) => {
        setTumIlanlar(data);
        if (ilan) {
          setBenzerIlanlar(data.filter(i => i.konum === ilan.konum && i.id !== ilan.id));
        }
      });
  }, [ilan]);

  // SEO structured data
  const jsonLd = ilan ? {
    "@context": "https://schema.org",
    "@type": "Offer",
    "name": ilan.baslik,
    "description": ilan.aciklama,
    "price": ilan.fiyat,
    "priceCurrency": "TRY",
    "address": ilan.konum,
    "availability": "https://schema.org/InStock",
    "url": typeof window !== 'undefined' ? window.location.href : '',
    "image": ilan.fotograflar && ilan.fotograflar[0],
    "category": ilan.tip,
    "numberOfRooms": ilan.odaSayisi,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": ilan.metrekare,
      "unitCode": "MTK"
    }
  } : null;

  useEffect(() => {
    fetchIlan();
  }, [params.id]);

  const fetchIlan = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ilanlar');
      if (!response.ok) throw new Error('İlan yüklenemedi');
      const data = await response.json();
      const found = data.find((i: Ilan) => i.id === Number(params.id));
      if (!found) throw new Error('İlan bulunamadı');
      setIlan(found);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      console.error('İlan yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (ilan && ilan.fotograflar) {
      setSelectedImage((prev) => (prev + 1) % ilan.fotograflar.length);
    }
  };

  const prevImage = () => {
    if (ilan && ilan.fotograflar) {
      setSelectedImage((prev) => (prev - 1 + ilan.fotograflar.length) % ilan.fotograflar.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">İlan yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !ilan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Hata!</h2>
          <p className="text-gray-600 mb-6">{error || 'İlan bulunamadı'}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.back()} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              Geri Dön
            </button>
            <button onClick={fetchIlan} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors">
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {ilan && (
        <Head>
          <title>{ilan.baslik} | {ilan.konum} | {ilan.fiyat.toLocaleString()} TL</title>
          <meta name="description" content={ilan.aciklama} />
          {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
        </Head>
      )}
      <main className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-orange-50 font-sans">
        <div className="flex-1">
          <div className="max-w-5xl mx-auto p-4">
            {/* BAŞLIK */}
            {/* 1) Fotoğraf galerisi ve thumbnail'lar */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 mb-8">
              {/* Sol: Fotoğraf galerisi ve başlık */}
              <div className="flex flex-col gap-4 min-w-0">
                <div className="relative w-full">
                  <div className="overflow-hidden rounded-xl shadow border border-gray-200">
                    <img src={ilan.fotograflar[selectedImage] || '/uploads/placeholder.jpg'} alt={ilan.baslik} className="w-full max-h-[600px] min-h-[320px] object-cover" />
                    {ilan.fotograflar.length > 1 && (
                      <>
                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow text-gray-700 cursor-pointer"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" /></svg></button>
                        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow text-gray-700 cursor-pointer"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg></button>
                        <div className="absolute bottom-2 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs">{selectedImage+1} / {ilan.fotograflar.length}</div>
                      </>
                    )}
                  </div>
                </div>
                {/* Thumbnail'lar */}
                {ilan.fotograflar.length > 1 && (
                  <div className="flex gap-3 mt-2 overflow-x-auto pb-2">
                    {ilan.fotograflar.map((foto, idx) => (
                      <img
                        key={idx}
                        src={foto}
                        alt={ilan.baslik + ' küçük foto ' + (idx+1)}
                        className={`w-24 h-20 object-cover rounded-lg border-2 cursor-pointer transition-all ${selectedImage === idx ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-200'}`}
                        onClick={() => setSelectedImage(idx)}
                      />
                    ))}
                  </div>
                )}
                {/* Başlık ve konum fotoğrafın altında */}
                <div className="text-blue-700 font-bold text-lg flex items-center gap-2 mb-2">
                  <svg className="inline w-5 h-5 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><circle cx="12" cy="11" r="3" /></svg>
                  {ilan.konum}
                </div>
                {/* Harita başlığın hemen altında */}
                {/* <div className="bg-gray-100 h-40 rounded-xl flex items-center justify-center text-gray-500 mb-2">
                  <iframe
                    title="Harita"
                    width="100%"
                    height="100%"
                    className="rounded-xl border-0"
                    style={{ minHeight: '120px', minWidth: '100%' }}
                    src={`https://maps.google.com/maps?q=${ilan.harita}&z=15&output=embed`}
                    allowFullScreen
                  ></iframe>
                </div> */}
                {/* Haritanın hemen altında açıklama düz metin olarak */}
                <div className="text-gray-700 text-base mb-8 mt-4">{ilan.aciklama}</div>
              </div>
              {/* Sağ: Sticky Panel - Borusan Next tarzı */}
              <div className="flex flex-col gap-6 bg-white rounded-2xl shadow-xl border border-gray-200 p-8 h-fit sticky top-8 min-w-[320px] max-w-[400px]">
                {/* Üst: Başlık ve paylaş ikonu */}
                <div className="flex items-center justify-between mb-4">
                  <div className="font-extrabold text-xl text-gray-900 mb-1 flex items-center gap-2">{ilan.baslik} <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500"><FaShareAlt /></button></div>
                </div>
                {/* Özet bilgiler */}
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold text-gray-700">{ilan.tip}</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold text-gray-700">{ilan.kimden}</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold text-gray-700">{ilan.binaYasi} Yaş</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold text-gray-700">{ilan.odaSayisi}+1</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold text-gray-700">{ilan.metrekare} m²</span>
                </div>
                {/* Fiyat */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 font-semibold mb-1">Fiyat</div>
                  <div className="text-3xl font-extrabold text-black">{ilan.fiyat.toLocaleString()} TL</div>
                </div>
                {/* Butonlar */}
                {/* <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl font-bold text-lg shadow mb-2 flex items-center justify-between px-4">Rezervasyon <FaArrowLeft className="rotate-180" /></button> */}
                <button className="w-full bg-green-400 hover:bg-green-500 text-white py-3 rounded-xl font-bold text-lg shadow mb-2 flex items-center justify-center gap-2">Bizi Arayın <FaPhone /></button>
                <a href="https://wa.me/905265128629" target="_blank" rel="noopener" className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-bold text-lg shadow flex items-center justify-center gap-2 mb-2">WhatsApp <FaWhatsapp /></a>
                <a href={(() => {
                  // Krediyle ilgili blog id'sini bul
                  const krediBlog = tumIlanlar && Array.isArray(tumIlanlar) && tumIlanlar.length > 0 ? null : null;
                  // Eğer bloglar globalde varsa, burada import et ve id'sini bul
                  // Örnek: krediyle ilgili blog id'si 5 ise
                  return "/blog/5";
                })()} className="block text-blue-700 text-sm font-bold text-center underline mb-2">Kredi kullanım koşulları için tıklayınız</a>
                {/* Alt rozetler - emlakçıya uygun */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700"><FaCheckCircle className="text-green-500" />Tapu Hazır</div>
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700"><FaCreditCard className="text-green-500" />Krediye Uygun</div>
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700"><FaCheckCircle className="text-green-500" />Hemen Taşın</div>
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700"><FaCheckCircle className="text-green-500" />Komisyonsuz</div>
                </div>
              </div>
            </div>

            {/* Fotoğraf galerisi ve başlık bloğunun hemen altına sekmeli menüyü ve içerik bölümlerini güncel şekilde ekle: */}
            <div className="flex flex-wrap gap-4 border-b border-gray-200 mb-8 sticky top-0 bg-gradient-to-br from-blue-50 via-white to-orange-50 z-20 py-2">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-3 rounded-full font-bold text-base border transition-all shadow cursor-pointer ${activeTab === tab.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-100'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {activeTab === 'Detaylar' && (
              <div id="detaylar" className="max-w-5xl mx-auto mb-8 scroll-mt-24">
                <div className="bg-white rounded-2xl shadow border border-gray-200 p-10 mb-8">
                  <h2 className="text-3xl font-extrabold text-blue-800 mb-8 tracking-tight">Detaylar</h2>
                  <ul className="divide-y divide-gray-200">
                    {[
                      'Oda Sayısı: ' + ilan.odaSayisi + '+1',
                      'Metrekare: ' + ilan.metrekare + ' m²',
                      'Bina Yaşı: ' + ilan.binaYasi,
                      'Banyo: ' + ilan.banyoSayisi,
                      'Balkon: ' + (ilan.balkon ? 'Var' : 'Yok'),
                      'Eşya: ' + (ilan.esyali ? 'Eşyalı' : 'Eşyasız'),
                      'Site: ' + (ilan.siteIci ? 'İçi' : 'Dışı'),
                      'Cephe: ' + ilan.cephe,
                      'Krediye Uygun: ' + (ilan.krediyeUygun ? 'Evet' : 'Hayır'),
                      'Aidat: ' + ilan.aidat + ' TL',
                      'Depozito: ' + ilan.depozito + ' TL',
                      'Tapu Durumu: ' + ilan.tapuDurumu,
                      'Kullanım Durumu: ' + ilan.kullanimDurumu,
                      'İlan No: ' + ilan.ilanNo,
                      'İlan Tarihi: ' + ilan.ilanTarihi
                    ].map((ozellik, i) => (
                      <li key={i} className="flex items-center justify-between py-4 px-2 text-lg text-gray-800">
                        <span>{ozellik}</span>
                        <span className="text-green-500 text-2xl"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg></span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {activeTab === 'Konum' && (
              <div id="konum" className="max-w-5xl mx-auto mb-8 scroll-mt-24">
                <div className="bg-white rounded-2xl shadow border border-gray-200 p-10 mb-8">
                  <h2 className="text-3xl font-extrabold text-blue-800 mb-8 tracking-tight">Konum</h2>
                  <div className="mb-4 text-lg font-semibold text-blue-700">{ilan.konum}</div>
                  <div className="bg-gray-100 h-72 rounded-xl flex items-center justify-center text-gray-500">
                    <iframe
                      title="Harita"
                      width="100%"
                      height="100%"
                      className="rounded-xl border-0"
                      style={{ minHeight: '250px', minWidth: '100%' }}
                      src={`https://maps.google.com/maps?q=${ilan.harita}&z=15&output=embed`}
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'Satıcı' && (
              <div id="satici" className="max-w-5xl mx-auto mb-8 scroll-mt-24">
                <div className="bg-white rounded-2xl shadow border border-gray-200 p-10 mb-8">
                  <h2 className="text-3xl font-extrabold text-blue-800 mb-8 tracking-tight">Satıcı</h2>
                  <div className="mb-4 text-lg font-semibold text-blue-700">Emlak Ofisi: Aydın Emlak</div>
                  <div className="mb-2 text-gray-700">Adres: Atatürk Bulvarı No:123, Kuşadası/Aydın</div>
                  <div className="mb-2 text-gray-700">Telefon: 0 552 385 82 96</div>
                  <div className="mb-2 text-gray-700">E-posta: info@aydin-emlak.com</div>
                  <div className="bg-gray-100 h-56 rounded-xl flex items-center justify-center text-gray-500 mt-6">
                    <iframe
                      title="Satıcı Harita"
                      width="100%"
                      height="100%"
                      className="rounded-xl border-0"
                      style={{ minHeight: '180px', minWidth: '100%' }}
                      src={`https://maps.google.com/maps?q=Kuşadası, Aydın&z=15&output=embed`}
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'İletişim' && (
              <div id="iletisim" className="max-w-5xl mx-auto mb-8 scroll-mt-24">
                <div className="bg-white rounded-2xl shadow border border-gray-200 p-10 mb-8">
                  <h2 className="text-3xl font-extrabold text-blue-800 mb-8 tracking-tight">İletişim</h2>
                  <div className="text-lg text-gray-700 mb-4">Daha fazla bilgi ve randevu için hemen arayın veya WhatsApp'tan yazın.</div>
                  <a href="tel:+905322323070" className="block bg-green-600 hover:bg-green-700 text-white rounded font-bold py-4 mb-4 text-center text-xl">0 552 385 82 96</a>
                  <a href="https://wa.me/905322323070" target="_blank" rel="noopener" className="block bg-blue-600 hover:bg-blue-700 text-white rounded font-bold py-4 text-center text-xl">WhatsApp</a>
                </div>
              </div>
            )}

            {/* En altta 4 kart ve önerilen ilanlar */}
            <div className="max-w-5xl mx-auto w-full mt-16">
              {/* Önerilen İlanlar başlığı ve 2 rastgele ilan */}
              <div className="w-full mb-8">
                <h2 className="text-2xl font-bold text-blue-800 mb-6">Önerilen İlanlar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {(() => {
                    if (benzerIlanlar.length >= 2) return benzerIlanlar.slice(0, 2);
                    const digerler = tumIlanlar.filter((i: Ilan) => i.id !== ilan.id);
                    if (digerler.length >= 2) {
                      const shuffled = digerler.sort(() => 0.5 - Math.random());
                      return shuffled.slice(0, 2);
                    }
                    if (digerler.length === 1) return [digerler[0]];
                    return [];
                  })().map((bi: Ilan) => (
                    <div key={bi.id} className="bg-white rounded-xl shadow border border-gray-200 flex flex-col md:flex-row overflow-hidden group hover:shadow-lg transition-all relative">
                      <div className="md:w-48 w-full h-40 md:h-auto flex-shrink-0 bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center relative overflow-hidden">
                        {bi.fotograflar && bi.fotograflar[0] ? (
                          <img src={bi.fotograflar[0]} alt={bi.baslik} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" onError={e => { (e.target as HTMLImageElement).src = '/uploads/placeholder.jpg'; }} />
                        ) : (
                          <img src="/uploads/placeholder.jpg" alt="Fotoğraf Yok" className="object-cover w-full h-full" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between p-6 gap-2">
                        <div className="font-bold text-gray-800 text-base line-clamp-1 mb-1">{bi.baslik}</div>
                        <div className="text-xs text-gray-500 mb-1">{bi.odaSayisi}+1 | {bi.metrekare} m²</div>
                        <div className="text-xs text-blue-700 font-bold mb-2">{bi.fiyat.toLocaleString()} TL</div>
                        <button onClick={() => router.push(`/ilan/${bi.id}`)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-bold text-xs w-fit">Detay</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
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
          
        </div>
      </footer>
    </>
  );
} 