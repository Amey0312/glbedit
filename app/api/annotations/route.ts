// app/api/annotations/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { projectId, title, description, position } = await req.json();

  try {
    const annotation = await prisma.annotation.create({
      data: {
        title,
        description,
        x: position[0],
        y: position[1],
        z: position[2],
        projectId,
      },
    });

    return NextResponse.json({ annotation });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add annotation' }, { status: 500 });
  }
}
