import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), '..', 'data', 'gita_full.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(DATA_PATH, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading Gita data:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const updatedVerse = await request.json();
    const fileContents = fs.readFileSync(DATA_PATH, 'utf8');
    let data = JSON.parse(fileContents);

    // Find and update the verse
    const index = data.findIndex((v: any) => v.id === updatedVerse.id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updatedVerse };
      fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
      return NextResponse.json({ message: 'Verse updated successfully' });
    } else {
      return NextResponse.json({ error: 'Verse not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating Gita data:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}
