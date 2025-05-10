import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


// export async function POST(req: NextRequest) {
//   const formData = await req.formData();
//   const file = formData.get('file') as File;
//   const projectId = formData.get('projectId') as string;

//   if (!file || !projectId) {
//     return NextResponse.json({ success: false, error: 'Missing file or projectId' }, { status: 400 });
//   }

//   try {
//     // Convert file to base64
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     const base64 = buffer.toString('base64');
//     const dataUrl = `data:${file.type};base64,${base64}`;

//     // Upload to Cloudinary as raw file
//     const fileName = `${uuidv4()}`;
//     const uploadResult = await cloudinary.uploader.upload(dataUrl, {
//       folder: 'glb-files',
//       resource_type: 'raw',
//       public_id: fileName,
//       max_file_size: 100 * 1024 * 1024, // 100 MB
//     });

//     // Save Cloudinary URL in database
//     await prisma.project.update({
//       where: { id: projectId },
//       data: { glbFile: uploadResult.secure_url },
//     });

//     return NextResponse.json({ success: true, url: uploadResult.secure_url });
//   } catch (error) {
//     console.error('Cloudinary upload error:', error);
//     return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
//   }
// }

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const projectId = formData.get('projectId') as string;

  if (!file || !projectId) {
    return NextResponse.json({ success: false, error: 'Missing file or projectId' }, { status: 400 });
  }

  try {
    // Check file size
    const fileSize = file.size;
    if (fileSize > 50 * 1024 * 1024) { // 50 MB
      return NextResponse.json({ success: false, error: 'File size exceeds limit' }, { status: 413 });
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary as raw file
    const fileName = `${uuidv4()}`;
    const uploadResult = await cloudinary.uploader.upload(dataUrl, {
      folder: 'glb-files',
      resource_type: 'raw',
      public_id: fileName,
      max_file_size: 100 * 1024 * 1024, // 100 MB max size on Cloudinary
    });

    // Save Cloudinary URL in database
    await prisma.project.update({
      where: { id: projectId },
      data: { glbFile: uploadResult.secure_url },
    });

    return NextResponse.json({ success: true, url: uploadResult.secure_url });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
