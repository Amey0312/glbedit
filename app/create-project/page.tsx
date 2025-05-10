'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
// import Link from 'next/link';

export default function CreateProjectPage() {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const router = useRouter();

  // Refs for animation
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.8 } });

    tl.from(containerRef.current, { opacity: 0, y: 50 })
      .from(headingRef.current, { opacity: 0, y: -20 }, '-=0.6')
      .from(Array.from(formRef.current?.children || []), {
        opacity: 0,
        y: 20,
        stagger: 0.15,
      }, '-=0.6')
      .from(buttonRef.current, { opacity: 0, scale: 0.9 }, '-=0.4');
  }, []);

  const handleCreateProject = async () => {
    const res = await fetch('/api/project', {
      method: 'POST',
      body: JSON.stringify({ projectName, description, canvasWidth, canvasHeight }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (res.ok) {
      router.push(`/upload-glb?projectId=${data.project.id}`);
    } else {
      alert('Error creating project');
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-sky-100 to-white flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1
          ref={headingRef}
          className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 text-center"
        >
          Create a New Project
        </h1>

        <div ref={formRef} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="border rounded-md p-2 w-full"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded-md p-2 w-full"
              placeholder="Describe your project"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Canvas Width</label>
            <input
              type="number"
              value={canvasWidth}
              onChange={(e) => setCanvasWidth(parseInt(e.target.value))}
              className="border rounded-md p-2 w-full"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Canvas Height</label>
            <input
              type="number"
              value={canvasHeight}
              onChange={(e) => setCanvasHeight(parseInt(e.target.value))}
              className="border rounded-md p-2 w-full"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            ref={buttonRef}
            onClick={handleCreateProject}
            className="bg-green-400 hover:bg-green-200 text-white font-semibold px-6 py-2 rounded-md transition"
          >
            Next: Upload GLB Model
          </button>
        </div>
      </div>
    </div>
  );
}
