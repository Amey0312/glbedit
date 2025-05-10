import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop(); // or extract more cleanly if needed

  if (!id) {
    return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { annotations: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('GET /api/project/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
  }

  const { transform } = await req.json();

  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        positionX: transform.position.x,
        positionY: transform.position.y,
        positionZ: transform.position.z,
        rotationX: transform.rotation.x,
        rotationY: transform.rotation.y,
        rotationZ: transform.rotation.z,
        scaleX: transform.scale.x,
        scaleY: transform.scale.y,
        scaleZ: transform.scale.z,
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error updating project transform:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}
