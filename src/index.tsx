import * as THREE from 'three';
import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, MeshReflectorMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'
import { createRoot } from 'react-dom/client'
import './styles.css'

const cameraProps = {
  fov: 45,
  near: 0.1,
  far: 10000,
  position: [0, 0, 300],
};

const X = new THREE.Vector3(1, 0, 0);
const Y = new THREE.Vector3(0, 1, 0);
const Z = new THREE.Vector3(0, 0, 1);

const pointLights = [
  { id: 0, color: 0xFF0000, x: 150,  y: -210, z: 0   },
  { id: 1, color: 0x00FF00, x: -150, y: -210, z: 0   },
  { id: 2, color: 0x0000FF, x: 0,    y: 300,  z: 0   },
  { id: 3, color: 0xFFFFFF, x: 0,    y: 0,    z: 300 },
];

const Lights = () => (
  <>
    {
      pointLights.map(({ id, color, x, y, z }) =>
        <pointLight color={color} position={[x, y, z]} key={id} intensity={0.2} />
      )
    }
  </>
);

const shapes = [
  { id: 0, axis: X, color: 0xFFFF00 },
  { id: 1, axis: Y, color: 0x00FFFF },
  { id: 2, axis: Z, color: 0xFF00FF },
];

const shapeSize = 50;

const Shape = ({ axis, color }) => {
  const ref = useRef<any>();

  useEffect(() => {
    ref.current.rotateOnAxis(axis, 90);
    return;
  }, []);

  useFrame((state, delta) => {
    ref.current.rotateOnAxis(X, 0.7 * delta);
    ref.current.rotateOnAxis(Y, 0.7 * delta);
    ref.current.rotateOnAxis(Z, 0.7 * delta);
  });

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[shapeSize]} />
      <meshToonMaterial color={color} transparent={true} opacity={0.8} />
    </mesh>
  );
};

const Shapes = () => (
  <>
    {
      shapes.map(({ id, axis, color }) =>
        <Shape key={id} axis={axis} color={color} />
      )
    }
  </>
);

function App() {
  return (
    <Canvas camera={cameraProps}>
      <ambientLight intensity={2} />
      <Lights />
      <Shapes />
      <mesh rotation={[-Math.PI / 8, 0, 0]} position={[0, -100, 0]}>
        <planeGeometry args={[5000, 5000]} />
        <MeshReflectorMaterial
          blur={[3, 3]}
          resolution={2048}
          mixBlur={1}
          mixStrength={25}
          roughness={0.2}
          depthScale={1.2}
          minDepthThreshold={0}
          maxDepthThreshold={.5}
          color="#ffffff"
          metalness={.99}
        />
      </mesh>
      <OrbitControls />

      <EffectComposer disableNormalPass>
        <DepthOfField target={[0, 0, -10]} focalLength={0.009} bokehScale={5} height={700} />
      </EffectComposer>
    </Canvas>
  );
}

createRoot(document.getElementById('root')).render(<App />)
