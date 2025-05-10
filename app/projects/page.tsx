'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    fetch('/api/project')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.projects || []);
      })
      .catch((err) => {
        console.error('Failed to fetch projects', err);
      });
  }, []);

  useGSAP(
    () => {
      if (!cardsRef.current) return;

      gsap.from(headingRef.current, {
        y: -30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from(cardsRef.current.children, {
        opacity: 0,
        y: 40,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power2.out',
      });
    },
    {
      scope: containerRef,
      dependencies: [projects],
    }
  );

  const handlePreview = (projectId: string) => {
    router.push(`/viewer?projectId=${projectId}`);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-emerald-900 px-4 py-12"
    >
      <div className="max-w-6xl mx-auto font-mono">
        <h1
          ref={headingRef}
          className="text-3xl sm:text-6xl font-extrabold text-center text-white mb-10"
        >
          All Projects
        </h1>

        {projects.length === 0 ? (
          <p className="text-center text-white">No projects found.</p>
        ) : (
          <ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project) => (
              <li
                key={project.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{project.name}</h2>
                  <p className="mt-2 text-gray-700 text-sm">{project.description}</p>
                  <p className="mt-1 text-gray-500 text-xs">Model: {project.glbFile}</p>
                </div>
                <button
                  onClick={() => handlePreview(project.id)}
                  className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-300 text-white rounded-lg transition"
                >
                  Preview
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
