"use client";

import React, { useEffect, useState } from "react";
import { FaHeart, FaMapMarkerAlt, FaBed, FaRulerCombined, FaBuilding, FaBath, FaHome, FaPhone, FaWhatsapp, FaShareAlt, FaSearch, FaFilter } from "react-icons/fa";
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
  oneCikar?: boolean; // Yeni eklenen öne çıkan özelliği
}

const KATEGORILER = [
  { ana: "Satılık", alt: ["Konut", "Daire", "Residence", "Müstakil Ev"] },
  { ana: "Kiralık", alt: ["Konut", "Daire", "Residence", "Müstakil Ev"] },
];

const KONUM_LISTESI = ["Aydın", "Kuşadası", "Didim", "Söke", "Bodrum", "Muğla"];

export default function IlanlarPage() {
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [kategori, setKategori] = useState("");
  const [adres, setAdres] = useState("");
  const [arama, setArama] = useState("");
  const [favoriler, setFavoriler] = useState<number[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('Tümü'); // Tematik sekme state'i
  
  // Yeni filtre state'leri
  const [minFiyat, setMinFiyat] = useState("");
  const [maxFiyat, setMaxFiyat] = useState("");
  const [odaSayisi, setOdaSayisi] = useState("");
  const [banyoSayisi, setBanyoSayisi] = useState("");
  const [minMetrekare, setMinMetrekare] = useState("");
  const [maxMetrekare, setMaxMetrekare] = useState("");
  const [minBinaYasi, setMinBinaYasi] = useState("");
  const [maxBinaYasi, setMaxBinaYasi] = useState("");
  const [esyali, setEsyali] = useState("");
  const [siteIci, setSiteIci] = useState("");
  const [krediyeUygun, setKrediyeUygun] = useState("");
  const [kimden, setKimden] = useState("");
  const [cephe, setCephe] = useState("");
  const [kullanimDurumu, setKullanimDurumu] = useState("");
  const [tapuDurumu, setTapuDurumu] = useState("");
  
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

  const filtreliIlanlar = ilanlar.filter((ilan) => {
    // Temel filtreler
    const kategoriMatch = kategori ? ilan.tip === kategori : true;
    const adresMatch = adres ? ilan.konum.includes(adres) : true;
    const aramaMatch = arama ? (
      ilan.baslik.toLowerCase().includes(arama.toLowerCase()) ||
      ilan.konum.toLowerCase().includes(arama.toLowerCase()) ||
      ilan.aciklama.toLowerCase().includes(arama.toLowerCase())
    ) : true;
    
    // Tematik sekme filtreleri
    let tabMatch = true;
    switch (activeTab) {
      case 'Yatırıma Uygun':
        tabMatch = ilan.krediyeUygun;
        break;
      case 'Lüks':
        tabMatch = ilan.fiyat > 2000000;
        break;
      case 'Öğrenciye Uygun':
        tabMatch = ilan.esyali && ilan.tip === 'Kiralık';
        break;
      case 'Fırsat':
        tabMatch = ilan.fiyat < 1000000;
        break;
      case 'Yeni':
        tabMatch = ilan.ilanDurumu === 'Aktif' && ilan.ilanTarihi && 
                  new Date(ilan.ilanTarihi) > new Date(Date.now() - 1000*60*60*24*30);
        break;
      default: // 'Tümü'
        tabMatch = true;
    }
    
    // Fiyat filtreleri
    const minFiyatMatch = minFiyat ? ilan.fiyat >= parseInt(minFiyat) : true;
    const maxFiyatMatch = maxFiyat ? ilan.fiyat <= parseInt(maxFiyat) : true;
    
    // Oda ve banyo filtreleri
    const odaMatch = odaSayisi ? ilan.odaSayisi === parseInt(odaSayisi) : true;
    const banyoMatch = banyoSayisi ? ilan.banyoSayisi === parseInt(banyoSayisi) : true;
    
    // Metrekare filtreleri
    const minMetrekareMatch = minMetrekare ? ilan.metrekare >= parseInt(minMetrekare) : true;
    const maxMetrekareMatch = maxMetrekare ? ilan.metrekare <= parseInt(maxMetrekare) : true;
    
    // Bina yaşı filtreleri
    const minBinaYasiMatch = minBinaYasi ? ilan.binaYasi >= parseInt(minBinaYasi) : true;
    const maxBinaYasiMatch = maxBinaYasi ? ilan.binaYasi <= parseInt(maxBinaYasi) : true;
    
    // Boolean filtreler
    const esyaliMatch = esyali ? ilan.esyali === (esyali === 'true') : true;
    const siteIciMatch = siteIci ? ilan.siteIci === (siteIci === 'true') : true;
    const krediyeUygunMatch = krediyeUygun ? ilan.krediyeUygun === (krediyeUygun === 'true') : true;
    
    // String filtreler
    const kimdenMatch = kimden ? ilan.kimden === kimden : true;
    const cepheMatch = cephe ? ilan.cephe.toLowerCase().includes(cephe.toLowerCase()) : true;
    const kullanimDurumuMatch = kullanimDurumu ? ilan.kullanimDurumu.toLowerCase().includes(kullanimDurumu.toLowerCase()) : true;
    const tapuDurumuMatch = tapuDurumu ? ilan.tapuDurumu.toLowerCase().includes(tapuDurumu.toLowerCase()) : true;
    
    return kategoriMatch && adresMatch && aramaMatch && tabMatch &&
           minFiyatMatch && maxFiyatMatch && 
           odaMatch && banyoMatch && 
           minMetrekareMatch && maxMetrekareMatch && 
           minBinaYasiMatch && maxBinaYasiMatch && 
           esyaliMatch && siteIciMatch && krediyeUygunMatch && 
           kimdenMatch && cepheMatch && kullanimDurumuMatch && tapuDurumuMatch;
  });

  const toggleFavori = (id: number) => {
    setFavoriler((prev) => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const temizleFiltreler = () => {
    setKategori("");
    setAdres("");
    setArama("");
    setActiveTab('Tümü');
    setMinFiyat("");
    setMaxFiyat("");
    setOdaSayisi("");
    setBanyoSayisi("");
    setMinMetrekare("");
    setMaxMetrekare("");
    setMinBinaYasi("");
    setMaxBinaYasi("");
    setEsyali("");
    setSiteIci("");
    setKrediyeUygun("");
    setKimden("");
    setCephe("");
    setKullanimDurumu("");
    setTapuDurumu("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 font-sans">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 tracking-tight text-center">Aydın ve Ege'de Satılık/Kiralık Daireler</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-center mb-8">Aydın, Kuşadası, Didim, Bodrum, Muğla ve Söke'de en güncel, güvenilir ve fırsat dolu emlak ilanları.</p>
          
          {/* Arama Bar */}
          <div className="max-w-2xl mx-auto flex gap-4 mb-8">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={arama}
                onChange={e => setArama(e.target.value)}
                placeholder="İlan No, başlık, konum veya anahtar kelime..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg shadow-sm bg-white text-gray-900"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaFilter />
              Filtrele
            </button>
          </div>
        </div>
      </div>

      {/* Tematik Sekmeler */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {['Tümü', 'Yatırıma Uygun', 'Lüks', 'Öğrenciye Uygun', 'Fırsat', 'Yeni'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-bold text-base border-2 transition-all shadow-sm ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50 hover:border-blue-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sol: Filtre Paneli */}
        <aside className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 h-fit sticky top-8">
            <h2 className="text-xl font-bold text-blue-800 mb-6 flex items-center gap-2">
              <FaFilter />
              Detaylı Filtrele
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                <select value={kategori} onChange={e => setKategori(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white text-gray-900">
                  <option value="" className="text-gray-900">Tümü</option>
                  <option value="Satılık" className="text-gray-900">Satılık</option>
                  <option value="Kiralık" className="text-gray-900">Kiralık</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Konum</label>
                <select value={adres} onChange={e => setAdres(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white text-gray-900">
                  <option value="" className="text-gray-900">Tümü</option>
                  {KONUM_LISTESI.map(a => <option key={a} value={a} className="text-gray-900">{a}</option>)}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Min Fiyat</label>
                  <input type="number" min={0} placeholder="Min" value={minFiyat} onChange={e => setMinFiyat(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max Fiyat</label>
                  <input type="number" min={0} placeholder="Max" value={maxFiyat} onChange={e => setMaxFiyat(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white text-gray-900" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Oda</label>
                  <input type="number" min={1} max={10} placeholder="Oda" value={odaSayisi} onChange={e => setOdaSayisi(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Banyo</label>
                  <input type="number" min={1} max={5} placeholder="Banyo" value={banyoSayisi} onChange={e => setBanyoSayisi(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white text-gray-900" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Min m²</label>
                  <input type="number" min={0} placeholder="Min" value={minMetrekare} onChange={e => setMinMetrekare(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max m²</label>
                  <input type="number" min={0} placeholder="Max" value={maxMetrekare} onChange={e => setMaxMetrekare(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white text-gray-900" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Min Bina Yaşı</label>
                  <input type="number" min={0} placeholder="Min" value={minBinaYasi} onChange={e => setMinBinaYasi(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max Bina Yaşı</label>
                  <input type="number" min={0} placeholder="Max" value={maxBinaYasi} onChange={e => setMaxBinaYasi(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white text-gray-900" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Eşyalı</label>
                  <select value={esyali} onChange={e => setEsyali(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white text-gray-900">
                    <option value="" className="text-gray-900">Tümü</option>
                    <option value="true" className="text-gray-900">Eşyalı</option>
                    <option value="false" className="text-gray-900">Eşyasız</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Site İçi</label>
                  <select value={siteIci} onChange={e => setSiteIci(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white text-gray-900">
                    <option value="" className="text-gray-900">Tümü</option>
                    <option value="true" className="text-gray-900">Evet</option>
                    <option value="false" className="text-gray-900">Hayır</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Krediye Uygun</label>
                  <select value={krediyeUygun} onChange={e => setKrediyeUygun(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white text-gray-900">
                    <option value="" className="text-gray-900">Tümü</option>
                    <option value="true" className="text-gray-900">Evet</option>
                    <option value="false" className="text-gray-900">Hayır</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kimden</label>
                  <select value={kimden} onChange={e => setKimden(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white text-gray-900">
                    <option value="" className="text-gray-900">Tümü</option>
                    <option value="Emlakçıdan" className="text-gray-900">Emlakçıdan</option>
                    <option value="Sahibinden" className="text-gray-900">Sahibinden</option>
                    <option value="Müteahhitten" className="text-gray-900">Müteahhitten</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cephe</label>
                <input type="text" placeholder="Örn: Güney" value={cephe} onChange={e => setCephe(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white text-gray-900" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kullanım Durumu</label>
                <input type="text" placeholder="Boş, Kiracılı..." value={kullanimDurumu} onChange={e => setKullanimDurumu(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white text-gray-900" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tapu Durumu</label>
                <input type="text" placeholder="Kat Mülkiyeti..." value={tapuDurumu} onChange={e => setTapuDurumu(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white text-gray-900" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Arama Kelimesi</label>
                <input type="text" value={arama} onChange={e => setArama(e.target.value)} placeholder="Arama Kelimesi" className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white text-gray-900" />
              </div>
              
              <button onClick={temizleFiltreler} className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg">
                Filtreleri Temizle
              </button>
              <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg">
                Filtrele
              </button>
            </div>
          </div>
        </aside>

        {/* Sağ: İlan Listesi */}
        <section className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">İlanlar yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filtreliIlanlar.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="text-gray-400 text-6xl mb-4">🏠</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">İlan Bulunamadı</h3>
                  <p className="text-gray-500">Kriterlere uygun ilan bulunamadı. Filtreleri değiştirmeyi deneyin.</p>
                </div>
              ) : (
                // Öne çıkan ilanları önce göster, sonra diğerlerini
                filtreliIlanlar
                  .sort((a, b) => {
                    // Önce öne çıkanları göster
                    if (a.oneCikar && !b.oneCikar) return -1;
                    if (!a.oneCikar && b.oneCikar) return 1;
                    // Sonra tarihe göre sırala
                    return new Date(b.ilanTarihi).getTime() - new Date(a.ilanTarihi).getTime();
                  })
                  .map(ilan => {
                  // Rozetler
                  const rozetler = [];
                  if (ilan.krediyeUygun) rozetler.push('Yatırıma Uygun');
                  if (ilan.fiyat > 2000000) rozetler.push('Lüks');
                  if (ilan.esyali && ilan.tip === 'Kiralık') rozetler.push('Öğrenciye Uygun');
                  if (ilan.siteIci) rozetler.push('Site İçi');
                  if (ilan.esyali) rozetler.push('Eşyalı');
                  if (ilan.ilanDurumu === 'Aktif' && ilan.ilanTarihi && new Date(ilan.ilanTarihi) > new Date(Date.now() - 1000*60*60*24*30)) rozetler.push('Yeni');
                  if (ilan.fiyat < 1000000) rozetler.push('Fırsat');
                  const vurguluRozet = rozetler[0];
                  
                  return (
                    <div key={ilan.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      <div className="flex flex-col md:flex-row">
                        {/* Fotoğraf */}
                        <div className="md:w-80 w-full h-64 md:h-auto relative overflow-hidden">
                          {ilan.fotograflar && ilan.fotograflar[0] ? (
                            <img src={ilan.fotograflar[0]} alt={ilan.baslik} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" onError={e => { (e.target as HTMLImageElement).src = '/uploads/placeholder.jpg'; }} />
                          ) : (
                            <img src="/uploads/placeholder.jpg" alt="Fotoğraf Yok" className="object-cover w-full h-full" />
                          )}
                          
                          {/* Öne Çıkan Rozeti */}
                          {ilan.oneCikar && (
                            <span className="absolute top-4 left-4 px-4 py-2 rounded-xl text-white text-sm font-bold shadow-lg bg-gradient-to-r from-red-500 to-pink-600 border-2 border-white z-10">
                              Öne Çıkan
                            </span>
                          )}
                          
                          {/* Vurgulu Rozet (öne çıkan yoksa) */}
                          {!ilan.oneCikar && vurguluRozet && (
                            <span className="absolute top-4 left-4 px-4 py-2 rounded-xl text-white text-sm font-bold shadow-lg bg-gradient-to-r from-orange-500 to-blue-600 border-2 border-white">
                              {vurguluRozet}
                            </span>
                          )}
                          
                          {/* Favori Butonu */}
                          <button 
                            onClick={() => toggleFavori(ilan.id)}
                            className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all ${
                              favoriler.includes(ilan.id) 
                                ? 'bg-red-500 text-white' 
                                : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
                            }`}
                          >
                            <FaHeart />
                          </button>
                        </div>
                        
                        {/* Bilgiler */}
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-3xl font-extrabold text-blue-700">{ilan.fiyat.toLocaleString()} TL</span>
                              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {ilan.ilanTarihi}
                              </span>
                            </div>
                            
                            <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {ilan.baslik}
                            </h2>
                            
                            <div className="text-blue-600 font-semibold mb-3 flex items-center gap-2">
                              <FaMapMarkerAlt className="text-orange-500" />
                              {ilan.konum}
                            </div>
                            
                            <p className="text-gray-600 text-base mb-4 line-clamp-2">
                              {ilan.aciklama}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                <FaBed />
                                {ilan.odaSayisi}+1
                              </span>
                              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                <FaRulerCombined />
                                {ilan.metrekare} m²
                              </span>
                              <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                <FaBuilding />
                                {ilan.binaYasi} yaş
                              </span>
                              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                <FaBath />
                                {ilan.banyoSayisi} banyo
                              </span>
                            </div>
                          </div>
                          
                          {/* Butonlar */}
                          <div className="flex flex-wrap gap-3">
                            <button 
                              onClick={() => router.push(`/ilan/${ilan.id}`)} 
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                            >
                              Detayları Gör
                            </button>
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-bold transition-colors">
                              <FaWhatsapp />
                            </button>
                            <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-3 rounded-xl font-bold transition-colors">
                              <FaPhone />
                            </button>
                            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-xl font-bold transition-colors">
                              <FaShareAlt />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
          
          {/* Sayfalama */}
          {filtreliIlanlar.length > 0 && (
            <div className="flex justify-center mt-12">
              <button className="px-8 py-4 rounded-xl border-2 border-blue-200 bg-white text-blue-700 font-bold hover:bg-blue-50 transition-colors">
                Daha Fazla Yükle
              </button>
            </div>
          )}
        </section>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
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