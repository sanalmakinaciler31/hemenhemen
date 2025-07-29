'use client';

import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaList, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

interface Ilan {
  id: number;
  baslik: string;
  aciklama: string;
  fiyat: number;
  konum: string;
  adres?: string; // Yeni
  haritaLat?: string; // Yeni
  haritaLng?: string; // Yeni
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
  oneCikar?: boolean;
  oneCikarmaTarihi?: string;
}

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('ilanlar');
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [editingIlan, setEditingIlan] = useState<Ilan | null>(null);
  const [formData, setFormData] = useState({
    baslik: '',
    aciklama: '',
    fiyat: '',
    konum: '',
    adres: '', // Yeni
    haritaLat: '', // Yeni
    haritaLng: '', // Yeni
    odaSayisi: '',
    metrekare: '',
    tip: 'Kiralık',
    binaYasi: '',
    esyali: false,
    siteIci: false,
    aidat: '',
    depozito: '',
    cephe: '',
    kullanimDurumu: '',
    tapuDurumu: '',
    krediyeUygun: false,
    kimden: '',
    banyoSayisi: '',
    balkon: false,
    ilanDurumu: 'Aktif',
    oneCikar: false
  });
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchIlanlar();
    }
  }, [isLoggedIn]);

  const fetchIlanlar = async () => {
    try {
      const response = await fetch('/api/ilanlar');
      const data = await response.json();
      setIlanlar(data);
    } catch (error) {
      console.error('İlanlar yüklenirken hata:', error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // adminsifre.username ve adminsifre.password kaldırıldığı için burası çalışmayacak.
    // Bu kısım daha sonra güncellenmelidir.
    if (username === 'admin' && password === 'admin') { // Basit bir kontrol
      setIsLoggedIn(true);
      setUsername('');
      setPassword('');
    } else {
      alert('Hatalı kullanıcı adı veya şifre!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('ilanlar');
    setEditingIlan(null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
      console.log(`${fileArray.length} dosya seçildi`);
    }
  };

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Temel alanları ekle
      formDataToSend.append('baslik', formData.baslik);
      formDataToSend.append('aciklama', formData.aciklama);
      formDataToSend.append('fiyat', formData.fiyat);
      formDataToSend.append('konum', formData.konum);
      formDataToSend.append('adres', formData.adres || '');
      formDataToSend.append('haritaLat', formData.haritaLat || '');
      formDataToSend.append('haritaLng', formData.haritaLng || '');
      formDataToSend.append('odaSayisi', formData.odaSayisi);
      formDataToSend.append('metrekare', formData.metrekare);
      formDataToSend.append('tip', formData.tip);
      formDataToSend.append('binaYasi', formData.binaYasi);
      formDataToSend.append('esyali', formData.esyali.toString());
      formDataToSend.append('siteIci', formData.siteIci.toString());
      formDataToSend.append('aidat', formData.aidat);
      formDataToSend.append('depozito', formData.depozito);
      formDataToSend.append('cephe', formData.cephe);
      formDataToSend.append('kullanimDurumu', formData.kullanimDurumu);
      formDataToSend.append('tapuDurumu', formData.tapuDurumu);
      formDataToSend.append('krediyeUygun', formData.krediyeUygun.toString());
      formDataToSend.append('kimden', formData.kimden);
      formDataToSend.append('banyoSayisi', formData.banyoSayisi);
      formDataToSend.append('balkon', formData.balkon.toString());
      formDataToSend.append('ilanDurumu', formData.ilanDurumu);
      formDataToSend.append('oneCikar', formData.oneCikar.toString());
      
      // Eğer düzenleme modundaysa ID ekle
      if (editingIlan) {
        formDataToSend.append('id', editingIlan.id.toString());
      }
      
      // Fotoğrafları ekle
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          formDataToSend.append('fotograflar', file);
        }
      }
      
      // Mevcut fotoğrafları ekle (düzenleme modunda)
      if (editingIlan && existingPhotos.length > 0) {
        for (const photoUrl of existingPhotos) {
          formDataToSend.append('existingPhotos', photoUrl);
        }
      }

      const response = await fetch('/api/ilanlar', {
        method: editingIlan ? 'PUT' : 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        await fetchIlanlar();
        setFormData({
          baslik: '', aciklama: '', fiyat: '', konum: '', adres: '', haritaLat: '', haritaLng: '', odaSayisi: '', metrekare: '',
          tip: 'Kiralık', binaYasi: '', esyali: false, siteIci: false, aidat: '', depozito: '',
          cephe: '', kullanimDurumu: '', tapuDurumu: '', krediyeUygun: false, kimden: '',
          banyoSayisi: '', balkon: false, ilanDurumu: 'Aktif', oneCikar: false
        });
        setSelectedFiles([]);
        setExistingPhotos([]);
        setEditingIlan(null);
        setActiveTab('ilanlar');
        alert(editingIlan ? 'İlan güncellendi!' : 'İlan eklendi!');
      }
    } catch (error) {
      console.error('İlan kaydedilirken hata:', error);
      alert('Bir hata oluştu!');
    }
  };

  const handleEdit = (ilan: Ilan) => {
    setEditingIlan(ilan);
    setFormData({
      baslik: ilan.baslik,
      aciklama: ilan.aciklama,
      fiyat: ilan.fiyat.toString(),
      konum: ilan.konum,
      adres: ilan.adres || '',
      haritaLat: ilan.haritaLat || '',
      haritaLng: ilan.haritaLng || '',
      odaSayisi: ilan.odaSayisi.toString(),
      metrekare: ilan.metrekare.toString(),
      tip: ilan.tip,
      binaYasi: ilan.binaYasi.toString(),
      esyali: ilan.esyali,
      siteIci: ilan.siteIci,
      aidat: ilan.aidat.toString(),
      depozito: ilan.depozito.toString(),
      cephe: ilan.cephe,
      kullanimDurumu: ilan.kullanimDurumu,
      tapuDurumu: ilan.tapuDurumu,
      krediyeUygun: ilan.krediyeUygun,
      kimden: ilan.kimden,
      banyoSayisi: ilan.banyoSayisi.toString(),
      balkon: ilan.balkon,
      ilanDurumu: ilan.ilanDurumu,
      oneCikar: ilan.oneCikar || false
    });
    setExistingPhotos(ilan.fotograflar || []);
    setSelectedFiles([]);
    setActiveTab('ekle');
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/ilanlar/${id}`, { method: 'DELETE' });
        if (response.ok) {
          await fetchIlanlar();
          alert('İlan silindi!');
        }
      } catch (error) {
        console.error('İlan silinirken hata:', error);
        alert('Bir hata oluştu!');
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-2">Admin Girişi</h1>
            <p className="text-gray-600">Emlak ilanlarını yönetmek için giriş yapın</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kullanıcı Adı</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none placeholder-gray-500 text-gray-900"
                placeholder="Kullanıcı adınızı girin"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none placeholder-gray-500 text-gray-900"
                placeholder="Şifrenizi girin"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              Giriş Yap
            </button>
          </form>
          
         
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold text-blue-700">Admin Paneli</h1>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-red-600 text-white px-3 md:px-4 py-2 rounded-full hover:bg-red-700 transition-colors text-sm md:text-base"
            >
              <FaSignOutAlt /> <span className="hidden sm:inline">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
          <button
            onClick={() => setActiveTab('ilanlar')}
            className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-full font-semibold transition-colors text-sm md:text-base ${activeTab === 'ilanlar' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            <FaList /> <span className="hidden sm:inline">İlanlarım</span>
          </button>
          <button
            onClick={() => setActiveTab('ekle')}
            className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-full font-semibold transition-colors text-sm md:text-base ${activeTab === 'ekle' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            <FaPlus /> <span className="hidden sm:inline">{editingIlan ? 'İlanı Düzenle' : 'Yeni İlan Ekle'}</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'ilanlar' && (
          <div className="bg-white rounded-3xl shadow-xl p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Mevcut İlanlar</h2>
            <div className="space-y-4">
              {ilanlar.map(ilan => (
                <div key={ilan.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-base md:text-lg text-gray-900">{ilan.baslik}</h3>
                      <p className="text-gray-600 text-sm md:text-base">{ilan.konum} - {ilan.fiyat.toLocaleString()} TL</p>
                      <p className="text-sm text-gray-500">İlan No: {ilan.ilanNo}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(ilan)}
                        className="bg-blue-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(ilan.id)}
                        className="bg-red-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ekle' && (
          <div className="bg-white rounded-3xl shadow-xl p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
              {editingIlan ? 'İlanı Düzenle' : 'Yeni İlan Ekle'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Başlık</label>
                  <input
                    type="text"
                    value={formData.baslik}
                    onChange={e => setFormData({...formData, baslik: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fiyat (TL)</label>
                  <input
                    type="number"
                    value={formData.fiyat}
                    onChange={e => setFormData({...formData, fiyat: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Konum</label>
                  <input
                    type="text"
                    value={formData.konum}
                    onChange={e => setFormData({...formData, konum: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Adres (Detaylı)</label>
                  <input
                    type="text"
                    value={formData.adres}
                    onChange={e => setFormData({...formData, adres: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                    placeholder="Mahalle, cadde, sokak, apartman, daire..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Harita Konumu (Lat)</label>
                    <input
                      type="text"
                      value={formData.haritaLat}
                      onChange={e => setFormData({...formData, haritaLat: e.target.value})}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                      placeholder="37.8556"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Harita Konumu (Lng)</label>
                    <input
                      type="text"
                      value={formData.haritaLng}
                      onChange={e => setFormData({...formData, haritaLng: e.target.value})}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                      placeholder="27.8416"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tip</label>
                  <select
                    value={formData.tip}
                    onChange={e => setFormData({...formData, tip: e.target.value})}
                    className="w-full p-3 border-2 border-blue-500 rounded-xl focus:border-blue-700 focus:outline-none font-bold text-blue-700 bg-blue-50 cursor-pointer"
                    required
                  >
                    <option value="Kiralık" className="text-gray-900">Kiralık</option>
                    <option value="Satılık" className="text-gray-900">Satılık</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Oda Sayısı</label>
                  <input
                    type="number"
                    value={formData.odaSayisi}
                    onChange={e => setFormData({...formData, odaSayisi: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Metrekare</label>
                  <input
                    type="number"
                    value={formData.metrekare}
                    onChange={e => setFormData({...formData, metrekare: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bina Yaşı</label>
                  <input
                    type="number"
                    value={formData.binaYasi}
                    onChange={e => setFormData({...formData, binaYasi: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Banyo Sayısı</label>
                  <input
                    type="number"
                    value={formData.banyoSayisi}
                    onChange={e => setFormData({...formData, banyoSayisi: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={formData.aciklama}
                  onChange={e => setFormData({...formData, aciklama: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                  rows={4}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Aidat (TL)</label>
                  <input
                    type="number"
                    value={formData.aidat}
                    onChange={e => setFormData({...formData, aidat: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Depozito (TL)</label>
                  <input
                    type="number"
                    value={formData.depozito}
                    onChange={e => setFormData({...formData, depozito: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cephe</label>
                  <input
                    type="text"
                    value={formData.cephe}
                    onChange={e => setFormData({...formData, cephe: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kullanım Durumu</label>
                  <input
                    type="text"
                    value={formData.kullanimDurumu}
                    onChange={e => setFormData({...formData, kullanimDurumu: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tapu Durumu</label>
                  <input
                    type="text"
                    value={formData.tapuDurumu}
                    onChange={e => setFormData({...formData, tapuDurumu: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kimden</label>
                  <input
                    type="text"
                    value={formData.kimden}
                    onChange={e => setFormData({...formData, kimden: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.esyali}
                    onChange={e => setFormData({...formData, esyali: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold">Eşyalı</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.siteIci}
                    onChange={e => setFormData({...formData, siteIci: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold">Site İçi</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.balkon}
                    onChange={e => setFormData({...formData, balkon: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold">Balkon</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.krediyeUygun}
                    onChange={e => setFormData({...formData, krediyeUygun: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold">Krediye Uygun</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.oneCikar}
                    onChange={e => setFormData({...formData, oneCikar: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold text-orange-600">Öne Çıkan</span>
                </label>
              </div>
              
              {/* Fotoğraf Yükleme Alanı */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fotoğraflar</label>
                <div className="space-y-4">
                  {/* Mevcut Fotoğraflar (Düzenleme modunda) */}
                  {editingIlan && existingPhotos.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Mevcut Fotoğraflar</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {existingPhotos.map((photoUrl, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={photoUrl} 
                              alt={`Mevcut Fotoğraf ${index + 1}`} 
                              className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                              onError={e => { (e.target as HTMLImageElement).src = '/uploads/placeholder.jpg'; }}
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingPhoto(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Seçilen Dosyalar */}
                  {selectedFiles.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Yeni Seçilen Fotoğraflar</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                              <div className="text-center">
                                <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="text-xs text-gray-600 truncate px-2">{file.name}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Fotoğraf Yükleme Butonu */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="text-gray-500 hover:text-blue-600">
                        <svg className="mx-auto h-12 w-12 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-lg font-semibold">Fotoğraf Ekle</p>
                        <p className="text-sm">Birden fazla fotoğraf seçebilirsiniz</p>
                        <p className="text-xs text-gray-500 mt-1">Desteklenen formatlar: JPG, PNG, WebP</p>
                        {(selectedFiles.length > 0 || (editingIlan && existingPhotos.length > 0)) && (
                          <p className="text-xs text-green-600 mt-2 font-semibold">
                            {selectedFiles.length + (editingIlan ? existingPhotos.length : 0)} fotoğraf hazır
                          </p>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors shadow border border-blue-800 cursor-pointer"
                >
                  <FaSave /> {editingIlan ? 'Güncelle' : 'Kaydet'}
                </button>
                
                {editingIlan && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingIlan(null);
                      setFormData({
                        baslik: '', aciklama: '', fiyat: '', konum: '', adres: '', haritaLat: '', haritaLng: '', odaSayisi: '', metrekare: '',
                        tip: 'Kiralık', binaYasi: '', esyali: false, siteIci: false, aidat: '', depozito: '',
                        cephe: '', kullanimDurumu: '', tapuDurumu: '', krediyeUygun: false, kimden: '',
                        banyoSayisi: '', balkon: false, ilanDurumu: 'Aktif', oneCikar: false
                      });
                      setSelectedFiles([]);
                      setExistingPhotos([]);
                      setActiveTab('ilanlar');
                    }}
                    className="flex items-center gap-2 bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow border border-gray-800 cursor-pointer"
                  >
                    <FaTimes /> İptal
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
} 
