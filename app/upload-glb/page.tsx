'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function UploadGlbPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const router = useRouter();

  // Refs for animation
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Animate on mount using useGSAP
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.8 } });
    tl.from(containerRef.current, { opacity: 0, y: 50 })
      .from(headingRef.current, { opacity: 0, y: -20 }, '-=0.6')
      .from([inputRef.current, buttonRef.current], {
        opacity: 0,
        y: 20,
        stagger: 0.2,
      }, '-=0.6');
  }, { scope: containerRef });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('projectId');
    setProjectId(id);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.name.endsWith('.glb')) {
      setFile(uploadedFile);
    } else {
      alert('Please upload a .glb file');
    }
  };

  const handleSubmit = async () => {
    if (!file || !projectId) {
      alert('Missing file or project ID');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);

    try {
      const res = await fetch('/api/upload-glb', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload');

      const { success } = await res.json();

      if (success) {
        router.push(`/viewer?projectId=${projectId}`);
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-4 py-12  bg-emerald-900"
    >
      <div className="w-full max-w-md bg-gradient-to-b from-teal-400 to-yellow-200 rounded-2xl shadow-xl p-8">
        <h1
          ref={headingRef}
          className="text-2xl sm:text-3xl font-extrabold  text-white mb-6 font-mono"
        >
          Upload GLB Model
        </h1>
        <input
          ref={inputRef}
          type="file"
          accept=".glb"
          onChange={handleFileChange}
          className="mb-4 block rounded-xl p-2 w-full bg-white"
        />
        <button
          ref={buttonRef}
          onClick={handleSubmit}
          disabled={uploading}
          className="w-full bg-green-600 hover:bg-green-300 active:scale-95 transition-transform text-white font-semibold px-4 py-2 mb-4 rounded-md"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
}
