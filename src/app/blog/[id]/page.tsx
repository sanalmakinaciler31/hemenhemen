import { notFound } from 'next/navigation';

const BLOGS = [
  {
    id: 1,
    baslik: "Ev Alırken Dikkat Edilmesi Gereken 10 Önemli Nokta",
    icerik: [
      "Ev alırken ilk olarak bütçenizi ve ihtiyaçlarınızı netleştirin. Bölge seçimi yaparken ulaşım, okul, hastane gibi olanaklara dikkat edin.",
      "Tapu ve iskan durumu, binanın yaşı, deprem yönetmeliğine uygunluk gibi teknik detayları mutlaka kontrol edin.",
      "Emlak danışmanınızdan ekspertiz raporu ve piyasa analizi isteyin. Sözleşme ve ödeme planını dikkatlice inceleyin."
    ],
    resim: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop",
    tarih: "15 Aralık 2024",
    kategori: "Satın Alma Rehberi"
  },
  {
    id: 2,
    baslik: "Kuşadası'nda Yatırımlık Daire Seçerken Nelere Dikkat Etmeli?",
    icerik: [
      "Kuşadası'nda yatırım yaparken bölgenin gelişim potansiyelini ve kira getirisi yüksek lokasyonları tercih edin.",
      "Denize yakınlık, site olanakları ve ulaşım kolaylığı gibi faktörler yatırımınızın değerini artırır.",
      "Tapu ve ruhsat işlemlerini eksiksiz tamamlayın, profesyonel danışmanlık alın."
    ],
    resim: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=400&fit=crop",
    tarih: "12 Aralık 2024",
    kategori: "Yatırım Rehberi"
  },
  {
    id: 3,
    baslik: "Kira Sözleşmesi Yaparken Bilmeniz Gereken Her Şey",
    icerik: [
      "Kira sözleşmesinde tarafların kimlik bilgileri, kira bedeli, ödeme şekli ve depozito detaylıca belirtilmelidir.",
      "Sözleşmede tahliye şartları, zam oranı ve demirbaş listesi gibi maddeler eksiksiz olmalı.",
      "Her iki tarafın da haklarını koruyacak şekilde noter onaylı veya yazılı sözleşme yapılması önerilir."
    ],
    resim: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop",
    tarih: "10 Aralık 2024",
    kategori: "Kiralama Rehberi"
  },
  {
    id: 4,
    baslik: "Bodrum'da Villa Kiralama: Sezonluk vs Uzun Dönem",
    icerik: [
      "Bodrum'da sezonluk villa kiralamak kısa vadede yüksek getiri sağlar, uzun dönem ise istikrarlı gelir sunar.",
      "Sezonluk kiralamada temizlik, bakım ve müşteri değişimi daha sık olur. Uzun dönem kiracıda ise istikrar ve düzen ön plandadır.",
      "Her iki seçenekte de sözleşme ve depozito şartlarını netleştirin."
    ],
    resim: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=400&fit=crop",
    tarih: "8 Aralık 2024",
    kategori: "Lüks Emlak"
  },
  {
    id: 5,
    baslik: "Tapu İşlemleri ve Masrafları: Detaylı Rehber",
    icerik: [
      "Tapu işlemlerinde gerekli belgeleri önceden hazırlayın: kimlik, tapu senedi, DASK poliçesi, vergi borcu yoktur yazısı.",
      "Alım-satım harcı, döner sermaye ve tapu masraflarını önceden öğrenin. İşlemler sırasında belediye ve tapu müdürlüğüyle iletişimde olun.",
      "İşlemler tamamlanınca tapu senedini ve yeni malik kaydını kontrol edin."
    ],
    resim: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
    tarih: "5 Aralık 2024",
    kategori: "Yasal Rehber"
  },
  {
    id: 6,
    baslik: "Aydın'da En Çok Tercih Edilen Mahalleler ve Özellikleri",
    icerik: [
      "Aydın'da en çok tercih edilen mahalleler arasında Efeler, Mimar Sinan, Yedi Eylül ve Adnan Menderes öne çıkar.",
      "Bu mahalleler ulaşım, sosyal olanaklar ve yatırım değeri açısından avantajlıdır.",
      "Her mahallenin kendine özgü yaşam tarzı ve fiyat aralığı bulunur."
    ],
    resim: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop",
    tarih: "3 Aralık 2024",
    kategori: "Bölge Analizi"
  }
];

export default function BlogDetail({ params }: { params: { id: string } }) {
  const blog = BLOGS.find(b => b.id === Number(params.id));
  if (!blog) return notFound();
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 font-sans">
      <div className="max-w-3xl mx-auto p-4">
        <img src={blog.resim} alt={blog.baslik} className="w-full h-64 object-cover rounded-xl mb-6" />
        <div className="mb-2 text-blue-700 font-bold text-lg">{blog.kategori} &bull; {blog.tarih}</div>
        <h1 className="text-3xl font-extrabold text-blue-900 mb-6">{blog.baslik}</h1>
        <div className="space-y-6 text-lg text-gray-800">
          {blog.icerik.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    </main>
  );
} 