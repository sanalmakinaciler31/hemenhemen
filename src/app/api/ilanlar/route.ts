import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'ilanlar.json');

// İlanları oku
function readIlanlar() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('İlanlar okunurken hata:', error);
  }
  return [];
}

// İlanları kaydet
function writeIlanlar(ilanlar: any[]) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(ilanlar, null, 2));
  } catch (error) {
    console.error('İlanlar kaydedilirken hata:', error);
  }
}

// Fotoğraf yükleme fonksiyonu
async function uploadPhoto(file: File): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Benzersiz dosya adı oluştur
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = `photo_${timestamp}_${randomString}.${extension}`;
    
    // Photo klasörüne kaydet
    const photoDir = path.join(process.cwd(), 'public', 'photo');
    const filePath = path.join(photoDir, fileName);
    
    fs.writeFileSync(filePath, buffer);
    
    // URL döndür
    return `/photo/${fileName}`;
  } catch (error) {
    console.error('Fotoğraf yüklenirken hata:', error);
    return '/uploads/placeholder.jpg';
  }
}

export async function GET() {
  try {
    const ilanlar = readIlanlar();
    return NextResponse.json(ilanlar);
  } catch (error) {
    return NextResponse.json({ error: 'İlanlar yüklenemedi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const ilanlar = readIlanlar();
    
    // Fotoğrafları işle
    const photoFiles = formData.getAll('fotograflar') as File[];
    const existingPhotos = formData.getAll('existingPhotos') as string[];
    const photoUrls: string[] = [];
    
    // Mevcut fotoğrafları ekle
    photoUrls.push(...existingPhotos);
    
    // Yeni fotoğrafları ekle
    for (const file of photoFiles) {
      if (file.size > 0) {
        const photoUrl = await uploadPhoto(file);
        photoUrls.push(photoUrl);
      }
    }
    
    // Eğer hiç fotoğraf yoksa placeholder kullan
    if (photoUrls.length === 0) {
      photoUrls.push('/uploads/placeholder.jpg');
    }
    
    const newIlan = {
      id: Date.now(),
      baslik: formData.get('baslik') as string,
      aciklama: formData.get('aciklama') as string,
      fiyat: Number(formData.get('fiyat')),
      konum: formData.get('konum') as string,
      odaSayisi: Number(formData.get('odaSayisi')),
      metrekare: Number(formData.get('metrekare')),
      tip: formData.get('tip') as string,
      fotograflar: photoUrls,
      binaYasi: Number(formData.get('binaYasi')),
      esyali: formData.get('esyali') === 'true',
      siteIci: formData.get('siteIci') === 'true',
      aidat: Number(formData.get('aidat') || 0),
      depozito: Number(formData.get('depozito') || 0),
      ilanTarihi: new Date().toISOString().split('T')[0],
      ilanDurumu: formData.get('ilanDurumu') as string || 'Aktif',
      harita: formData.get('harita') as string || '37.8576,27.2566',
      cephe: formData.get('cephe') as string || '',
      kullanimDurumu: formData.get('kullanimDurumu') as string || '',
      tapuDurumu: formData.get('tapuDurumu') as string || '',
      krediyeUygun: formData.get('krediyeUygun') === 'true',
      kimden: formData.get('kimden') as string || '',
      banyoSayisi: Number(formData.get('banyoSayisi')),
      balkon: formData.get('balkon') === 'true',
      ilanNo: Math.floor(Math.random() * 9000) + 1000,
      oneCikar: formData.get('oneCikar') === 'true',
      oneCikarmaTarihi: formData.get('oneCikar') === 'true' ? new Date().toISOString().split('T')[0] : undefined
    };
    
    ilanlar.push(newIlan);
    writeIlanlar(ilanlar);
    
    return NextResponse.json(newIlan);
  } catch (error) {
    console.error('İlan eklenirken hata:', error);
    return NextResponse.json({ error: 'İlan eklenemedi' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const ilanlar = readIlanlar();
    const id = Number(formData.get('id'));
    
    const ilanIndex = ilanlar.findIndex(ilan => ilan.id === id);
    if (ilanIndex === -1) {
      return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
    }
    
    // Fotoğrafları işle
    const photoFiles = formData.getAll('fotograflar') as File[];
    const existingPhotos = formData.getAll('existingPhotos') as string[];
    const photoUrls: string[] = [];
    
    // Mevcut fotoğrafları ekle
    photoUrls.push(...existingPhotos);
    
    // Yeni fotoğrafları ekle
    for (const file of photoFiles) {
      if (file.size > 0) {
        const photoUrl = await uploadPhoto(file);
        photoUrls.push(photoUrl);
      }
    }
    
    // Eğer hiç fotoğraf yoksa placeholder kullan
    if (photoUrls.length === 0) {
      photoUrls.push('/uploads/placeholder.jpg');
    }
    
    const updatedIlan = {
      ...ilanlar[ilanIndex],
      baslik: formData.get('baslik') as string,
      aciklama: formData.get('aciklama') as string,
      fiyat: Number(formData.get('fiyat')),
      konum: formData.get('konum') as string,
      odaSayisi: Number(formData.get('odaSayisi')),
      metrekare: Number(formData.get('metrekare')),
      tip: formData.get('tip') as string,
      fotograflar: photoUrls,
      binaYasi: Number(formData.get('binaYasi')),
      esyali: formData.get('esyali') === 'true',
      siteIci: formData.get('siteIci') === 'true',
      aidat: Number(formData.get('aidat') || 0),
      depozito: Number(formData.get('depozito') || 0),
      cephe: formData.get('cephe') as string || '',
      kullanimDurumu: formData.get('kullanimDurumu') as string || '',
      tapuDurumu: formData.get('tapuDurumu') as string || '',
      krediyeUygun: formData.get('krediyeUygun') === 'true',
      kimden: formData.get('kimden') as string || '',
      banyoSayisi: Number(formData.get('banyoSayisi')),
      balkon: formData.get('balkon') === 'true',
      oneCikar: formData.get('oneCikar') === 'true',
      oneCikarmaTarihi: formData.get('oneCikar') === 'true' ? new Date().toISOString().split('T')[0] : undefined
    };
    
    ilanlar[ilanIndex] = updatedIlan;
    writeIlanlar(ilanlar);
    
    return NextResponse.json(updatedIlan);
  } catch (error) {
    console.error('İlan güncellenirken hata:', error);
    return NextResponse.json({ error: 'İlan güncellenemedi' }, { status: 500 });
  }
} 