import { NextResponse } from 'next/server';
import ilanlar from '../../../../emlakci/ilanlar.json';
// Bloglar için örnek veri, gerçek projede bloglar.json veya benzeri dosyadan alınmalı
const bloglar = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
];

export async function GET() {
  const baseUrl = 'https://kiracemlak.com';
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Ana sayfalar
  xml += `<url><loc>${baseUrl}/</loc><priority>1.0</priority></url>\n`;
  xml += `<url><loc>${baseUrl}/ilanlar</loc><priority>0.9</priority></url>\n`;
  xml += `<url><loc>${baseUrl}/blog</loc><priority>0.7</priority></url>\n`;

  // İlanlar
  (ilanlar as {id:number}[]).forEach((i: {id:number}) => {
    xml += `<url><loc>${baseUrl}/ilan/${i.id}</loc><priority>0.8</priority></url>\n`;
  });

  // Bloglar
  bloglar.forEach((b: {id:number}) => {
    xml += `<url><loc>${baseUrl}/blog/${b.id}</loc><priority>0.6</priority></url>\n`;
  });

  xml += `</urlset>`;
  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' }
  });
} 