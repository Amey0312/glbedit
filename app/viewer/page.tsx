'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, TransformControls, Html } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import gsap from 'gsap';
import * as THREE from 'three';

// Dynamically import the Scene component with SSR disabled
const Scene = dynamic(() => import('./SceneWrapper'), { ssr: false });

function CameraFocus({ target, duration = 5, enabled }: { target: THREE.Vector3 | null; duration?: number; enabled: boolean }) {
  const { camera } = useThree();
  const initial = useRef(camera.position.clone());
  const timer = useRef(0);

  useFrame((_, delta) => {
    if (enabled && target) {
      timer.current += delta;
      camera.position.lerpVectors(initial.current, target, Math.min(timer.current / duration, 1));
      camera.lookAt(0, 0, 0);
    } else {
      timer.current = 0;
    }
  });

  return null;
}

export default function ViewerPage() {
  // const searchParams = useSearchParams();
  const [projectId, setProjectId] = useState<string | null>(null);
  interface Project {
    glbFile: string;
    name: string;
    description: string;
    width: number;
    height: number;
    positionX: number;
    positionY: number;
    positionZ: number;
    annotations?: any[];
  }

  const [project, setProject] = useState<Project | null>(null);
  const [annotations, setAnnotations] = useState([]);
  const [editing, setEditing] = useState(false);
  const [focusTarget, setFocusTarget] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [modelRef, setModelRef] = useState<THREE.Object3D | null>(null);
  const infoRef = useRef(null);

  const { position, rotation, scale } = useControls('Model', {
    position: { value: [0, 0, 0], step: 0.1 },
    rotation: { value: [0, 0, 0], step: 0.1 },
    scale: { value: [1, 1, 1], step: 0.1 },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get('projectId');
      if (id) setProjectId(id);
    }
  }, []);

  useEffect(() => {
    if (projectId) {
      fetch(`/api/project/${projectId}`)
        .then(res => res.json())
        .then(data => {
          if (data?.project) {
            setProject(data.project);
            setAnnotations(data.project.annotations || []);
          }
        });
    }
  }, [projectId]);

  useEffect(() => {
    if (modelRef) {
      modelRef.position.set(...position);
      modelRef.rotation.set(...rotation);
      modelRef.scale.set(...scale);
    }
  }, [modelRef, position, rotation, scale]);

  useEffect(() => {
    if (infoRef.current) {
      gsap.fromTo(
        infoRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
      );
    }
  }, [project]);

  const saveModelTransform = async () => {
    if (!projectId || !modelRef) return;
    const pos = modelRef.position;
    const rot = modelRef.rotation;
    const scl = modelRef.scale;

    await fetch(`/api/project/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transform: {
          position: { x: pos.x, y: pos.y, z: pos.z },
          rotation: { x: rot.x, y: rot.y, z: rot.z },
          scale: { x: scl.x, y: scl.y, z: scl.z },
        },
      }),
    });
  };

  function AnimateModel({ modelRef }: { modelRef: THREE.Object3D }) {
    useFrame(() => {
      modelRef.rotation.y += 0.01;
    });
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold text-center lg:text-left">3D Project Viewer</h1>
        <div className="flex items-center gap-4">
          <label className="flex items-center space-x-2">
            <span>Edit Mode</span>
            <input type="checkbox" checked={editing} onChange={() => setEditing(!editing)} />
          </label>
          <button
            onClick={saveModelTransform}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Transform
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3 h-[500px] rounded-lg overflow-hidden shadow">
          <Canvas className="w-full h-full" >
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} />

            {project && (
              <Scene
                glbPath={`/uploads/${project.glbFile}`}
                onLoaded={(ref) => setModelRef(ref)}
              />
            )}

            {modelRef && isRunning && (
              <AnimateModel modelRef={modelRef} />
            )}

            <CameraFocus target={focusTarget} enabled={!!focusTarget} />
            <OrbitControls />
          </Canvas>
        </div>

        {project && (
          <div
            ref={infoRef}
            className="w-full lg:w-1/3 bg-white rounded-lg shadow p-6 animate-fadeIn"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Model Details</h2>
            <p className="mb-2"><strong>Title:</strong> {project.name}</p>
            <p className="mb-2"><strong>Description:</strong> {project.description}</p>
            <div className="mt-4">
              <h3 className="font-semibold mb-1">Canvas Size</h3>
              <p>Width: {project.width}</p>
              <p>Height: {project.height}</p>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-1">Position</h3>
              <p>X: {project.positionX}</p>
              <p>Y: {project.positionY}</p>
              <p>Z: {project.positionZ}</p>
            </div>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`${isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                } text-white px-4 py-2 rounded`}
            >
              {isRunning ? 'Stop Model' : 'Run Model'}
            </button>
          </div>
        )}
        <Leva collapsed={false} />
      </div>
    </div>
  );
}
