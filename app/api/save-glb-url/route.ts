// route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { projectId, glbFile } = await req.json();

  if (!projectId || !glbFile) {
    return NextResponse.json({ success: false, error: 'Missing data' }, { status: 400 });
  }

  try {
    await prisma.project.update({
      where: { id: projectId },
      data: { glbFile },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DB update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update DB' }, { status: 500 });
  }
}
