import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const filePath = path.join(process.cwd(), 'ilanlar.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    const ilanlar = JSON.parse(fileData);
    
    const filteredIlanlar = ilanlar.filter((ilan: any) => ilan.id !== id);
    
    if (filteredIlanlar.length === ilanlar.length) {
      return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
    }
    
    await fs.writeFile(filePath, JSON.stringify(filteredIlanlar, null, 2));
    return NextResponse.json({ message: 'İlan başarıyla silindi' });
  } catch (error) {
    return NextResponse.json({ error: 'İlan silinirken hata oluştu' }, { status: 500 });
  }
} 