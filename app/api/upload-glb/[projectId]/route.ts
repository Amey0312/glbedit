import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const projectId = url.pathname.split('/').pop();

  if (!projectId) {
    return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert buffer to base64 data URL for Cloudinary
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(dataUrl, {
      folder: 'glb-files',
      resource_type: 'raw', 
      public_id: file.name.split('.').slice(0, -1).join(''), // Remove extension
    });
    console.log('Cloudinary upload response:', uploadRes);
    // Save Cloudinary URL in database
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { glbFile: uploadRes.secure_url },
    });

    return NextResponse.json({ updatedProject });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file to Cloudinary' }, { status: 500 });
  }
}
