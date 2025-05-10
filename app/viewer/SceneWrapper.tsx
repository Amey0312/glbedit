
'use client';

import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

type SceneProps = {
  glbPath: string;
  onLoaded?: (ref: THREE.Object3D) => void;
};

export default function Scene({ glbPath, onLoaded }: SceneProps) {
  const { scene } = useGLTF(glbPath);

  useEffect(() => {
    if (onLoaded && scene) {
      onLoaded(scene);
    }
  }, [onLoaded, scene]);

  return <primitive object={scene} />;
}
