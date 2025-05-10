// 'use client';
// import { useLoader } from '@react-three/fiber';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { useEffect } from 'react';
// import * as THREE from 'three';

// export default function Scene({ glbPath, onLoaded }: { glbPath: string; onLoaded?: (ref: THREE.Object3D) => void }) {
//   const gltf = useLoader(GLTFLoader, glbPath);

//   useEffect(() => {
//     if (onLoaded && gltf.scene) {
//       onLoaded(gltf.scene);
//     }
//   }, [onLoaded, gltf.scene]);

//   return <primitive object={gltf.scene} />;
// }
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
