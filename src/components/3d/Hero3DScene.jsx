import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, MeshDistortMaterial, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// 3D Procedural Wrench Element
function Wrench3D(props) {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t / 2) * 0.2;
      meshRef.current.rotation.y = Math.cos(t / 2) * 0.3;
      meshRef.current.rotation.z = Math.sin(t / 3) * 0.1;
    }
  });

  return (
    <group ref={meshRef} {...props}>
      {/* Wrench Handle */}
      <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.3, 2.2, 0.2]} />
        <meshStandardMaterial color="#2563eb" metalness={0.7} roughness={0.2} />
      </mesh>
      
      {/* Wrench Head 1 */}
      <mesh position={[-0.8, 0.6, 0]}>
        <torusGeometry args={[0.45, 0.18, 16, 32]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Wrench Head Cutout Accent */}
      <mesh position={[0.8, -1.0, 0]}>
        <torusGeometry args={[0.35, 0.15, 16, 32]} />
        <meshStandardMaterial color="#1d4ed8" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// 3D Procedural Gear Element
function Gear3D(props) {
  const gearRef = useRef();

  useFrame((state, delta) => {
    if (gearRef.current) {
      gearRef.current.rotation.z += delta * 0.4;
    }
  });

  const teeth = 8;
  return (
    <group ref={gearRef} {...props}>
      {/* Central Ring */}
      <mesh>
        <cylinderGeometry args={[0.7, 0.7, 0.3, 32]} />
        <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Gear Hole */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.32, 24]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Teeth around perimeter */}
      {Array.from({ length: teeth }).map((_, i) => {
        const angle = (i / teeth) * Math.PI * 2;
        const x = Math.cos(angle) * 0.75;
        const y = Math.sin(angle) * 0.75;
        return (
          <mesh key={i} position={[x, y, 0]} rotation={[0, 0, angle]}>
            <boxGeometry args={[0.25, 0.25, 0.3]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

// 3D Shield Badge Element
function Shield3D(props) {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = Math.sin(t * 1.5) * 0.1;
      ref.current.rotation.y = Math.sin(t) * 0.2;
    }
  });

  return (
    <group ref={ref} {...props}>
      <RoundedBox args={[1.2, 1.4, 0.25]} radius={0.2} smoothness={4}>
        <meshStandardMaterial color="#10b981" metalness={0.6} roughness={0.2} />
      </RoundedBox>

      {/* Shield Core Emblem */}
      <mesh position={[0, 0, 0.15]}>
        <octahedronGeometry args={[0.4]} />
        <meshStandardMaterial color="#ecfdf5" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

// 3D Floating Electric Spark / Energy Blob
function ElectricOrb3D(props) {
  return (
    <mesh {...props}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <MeshDistortMaterial
        color="#f59e0b"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

export default function Hero3DScene() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="w-full h-[380px] sm:h-[450px] relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
        <pointLight position={[5, 5, 5]} intensity={1} color="#10b981" />

        {/* Floating Wrench */}
        <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
          <Wrench3D position={[-0.8, 0.3, 0.5]} scale={1.1} />
        </Float>

        {/* Floating Gear */}
        <Float speed={1.5} rotationIntensity={1} floatIntensity={0.8}>
          <Gear3D position={[1.4, 0.8, -0.5]} scale={0.9} />
        </Float>

        {/* Floating Shield */}
        <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1.5}>
          <Shield3D position={[1.2, -0.9, 0.2]} scale={0.85} />
        </Float>

        {/* Floating Electric Orb */}
        <Float speed={3} rotationIntensity={1.2} floatIntensity={1.5}>
          <ElectricOrb3D position={[-1.5, -0.8, -0.4]} scale={0.7} />
        </Float>

        {/* Soft Contact Shadow on base floor */}
        <ContactShadows
          position={[0, -2.2, 0]}
          opacity={0.4}
          scale={10}
          blur={2.5}
          far={4}
        />
      </Canvas>

      {/* Subtle overlay caption badge */}
      <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-slate-300 border border-slate-700 pointer-events-none">
        Interactive 3D Workspace
      </div>
    </div>
  );
}
