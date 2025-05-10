import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop(); // Extract ID from URL

  if (!id) {
    return NextResponse.json({ error: 'Missing ID in URL' }, { status: 400 });
  }

  const { title, description, position } = await req.json();
  const { x, y, z } = position;

  try {
    const annotation = await prisma.annotation.update({
      where: { id },
      data: { title, description, x, y, z },
    });

    return NextResponse.json({ annotation });
  } catch (error) {
    console.error('Error updating annotation:', error);
    return NextResponse.json({ error: 'Failed to update annotation' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop(); // Extract ID from URL

  if (!id) {
    return NextResponse.json({ error: 'Missing ID in URL' }, { status: 400 });
  }

  try {
    await prisma.annotation.delete({ where: { id } });

    return NextResponse.json({ message: 'Annotation deleted successfully' });
  } catch (error) {
    console.error('Error deleting annotation:', error);
    return NextResponse.json({ error: 'Failed to delete annotation' }, { status: 500 });
  }
}
