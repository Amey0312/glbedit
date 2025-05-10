'use client';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useEffect } from 'react';
import * as THREE from 'three';

export default function Scene({ glbPath, onLoaded }: { glbPath: string; onLoaded?: (ref: THREE.Object3D) => void }) {
  const gltf = useLoader(GLTFLoader, glbPath);

  useEffect(() => {
    if (onLoaded && gltf.scene) {
      onLoaded(gltf.scene);
    }
  }, [onLoaded, gltf.scene]);

  return <primitive object={gltf.scene} />;
}
