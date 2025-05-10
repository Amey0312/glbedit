'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonGroupRef = useRef<HTMLDivElement>(null);

  const fullText = 'Welcome to the 3D Annotation App';


  useEffect(() => {
    let charIndex = 0;

    const typeWriter = () => {
      if (headingRef.current && charIndex <= fullText.length) {
        headingRef.current.textContent = fullText.slice(0, charIndex);
        charIndex++;
        gsap.delayedCall(0.1, typeWriter); // Speed of typing
      }
    };

    typeWriter();
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

    tl.from(containerRef.current, { opacity: 0, y: 50 })
      .from(headingRef.current, { opacity: 0, y: -40 }, '-=0.8')
      .from(paragraphRef.current, { opacity: 0, y: -20 }, '-=0.7')
      .from(buttonGroupRef.current, { opacity: 0, y: 20 }, '-=0.6');
  }, []);

  return (
    <div
      
      className=" bg-gradient-to-r from-emerald-500 to-emerald-900 min-h-screen flex flex-col items-center justify-center p-4"
    >
      <div ref={containerRef} className="w-full max-w-3xl rounded-xl shadow-lg p-6 text-center">
        <h1
          ref={headingRef}
          className="text-5xl sm:text-4xl md:text-6xl  font-extrabold  bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent "
        >
            {/* Text will be typed in */}
            
        </h1>
        <p
          ref={paragraphRef}
          className="mt-4 text-base sm:text-lg font-mono text-white"
        >
          Create a new project or view existing ones:
        </p>
        <div ref={buttonGroupRef} className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/create-project">
            <button className=" font-mono  bg-cyan-400 text-white px-4 py-2 rounded hover:bg-emerald-400 transition inset-shadow-green-400 shadow-amber-50">
              New Project
            </button>
          </Link>
          <Link href="/projects" className="text-white underline hover:text-emarland-400 transition">
            View All Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
