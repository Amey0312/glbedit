import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { projectName, description, canvasWidth, canvasHeight } = await req.json();

  try {
    const project = await prisma.project.create({
      data: {
        name: projectName,
        description,
        glbFile: '',
        width: canvasWidth,
        height: canvasHeight,
        annotations: {
          create: [
            {
              title: 'Initial Annotation',
              description: 'Auto-generated annotation on project creation.',
              x: 0.0,
              y: 0.0,
              z: 0.0,
            },
          ],
        },
      },
      include: {
        annotations: true,
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error creating project with annotation:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}


export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}