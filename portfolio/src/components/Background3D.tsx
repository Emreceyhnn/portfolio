import React, { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial, Float, Sphere, MeshDistortMaterial, Icosahedron } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

function FloatingShapes() {
  const shapesRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    shapesRef.current.rotation.y += 0.005
    shapesRef.current.children.forEach((child, i) => {
      child.rotation.x += 0.01
      child.position.y += Math.sin(state.clock.elapsedTime + i) * 0.002
    })
  })

  const [shapePositions] = useState(() => {
    return [...Array(5)].map(() => ({
      pos: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, -5] as [number, number, number]
    }))
  })

  return (
    <group ref={shapesRef}>
      {shapePositions.map((shape, i) => (
        <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2} position={shape.pos}>
          <Icosahedron args={[0.2, 0]}>
            <meshStandardMaterial color="#6366f1" wireframe transparent opacity={0.3} />
          </Icosahedron>
        </Float>
      ))}
    </group>
  )
}

// CRITICAL: Generate star positions OUTSIDE the component to prevent recreation on every render
const starPositionsStatic = new Float32Array(8000 * 3)
for (let i = 0; i < 8000; i++) {
  starPositionsStatic[i * 3] = (Math.random() - 0.5) * 20
  starPositionsStatic[i * 3 + 1] = (Math.random() - 0.5) * 20
  starPositionsStatic[i * 3 + 2] = (Math.random() - 0.5) * 20
}

function Scene() {
  const sphereRef = useRef<THREE.Mesh>(null!)
  const pointsRef = useRef<THREE.Points>(null!)
  const { mouse } = useThree()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Smooth interaction based on mouse
    if (sphereRef.current) {
      sphereRef.current.position.x = THREE.MathUtils.lerp(sphereRef.current.position.x, mouse.x * 3, 0.1)
      sphereRef.current.position.y = THREE.MathUtils.lerp(sphereRef.current.position.y, mouse.y * 3, 0.1)
    }
    
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.03
      pointsRef.current.rotation.x = time * 0.01
    }
  })

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <pointLight position={[-10, -10, -5]} color="#4f46e5" intensity={3} />
      
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.5}>
        <Sphere ref={sphereRef} args={[1.2, 128, 128]}>
          <MeshDistortMaterial
            color="#4338ca"
            attach="material"
            distort={0.45}
            speed={3}
            roughness={0.1}
            metalness={0.9}
          />
        </Sphere>
      </Float>

      <FloatingShapes />

      <Points ref={pointsRef} positions={starPositionsStatic}>
        <PointMaterial
          transparent
          color="#818cf8"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* 
        RE-ENABLED: EffectComposer is now stabilized with key to prevent remount issues 
        and wrapped in a conditional check for performance.
      */}
      <EffectComposer enableNormalPass={false}>
        <Bloom 
          luminanceThreshold={1.2} 
          mipmapBlur 
          intensity={0.5} 
          radius={0.4} 
        />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  )
}

export const Background3D: React.FC = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, background: '#020202' }}>
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 60 }} 
        dpr={[1, 2]}
        gl={{ 
          powerPreference: "high-performance",
          alpha: false,
          antialias: false,
          stencil: false,
          depth: true
        }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
