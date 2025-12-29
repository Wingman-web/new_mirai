import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const p = url.searchParams.get('path');
    if (!p) return NextResponse.json({ error: 'missing path' }, { status: 400 });

    // Prevent proxying arbitrary external URLs - only allow relative paths
    if (!p.startsWith('/')) return NextResponse.json({ error: 'only relative paths allowed' }, { status: 400 });

    const filePath = path.join(process.cwd(), 'public', p.replace(/^\//, ''));
    if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'not found' }, { status: 404 });

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';

    const body = await fs.promises.readFile(filePath);

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
