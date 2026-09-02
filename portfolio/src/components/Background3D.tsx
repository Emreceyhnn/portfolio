import React, { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial, Float, Sphere, MeshDistortMaterial, Icosahedron } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

type Quality = 'full' | 'reduced' | 'off'

function computeQuality(): Quality {
  if (typeof window === 'undefined') return 'full'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off'
  if (
    window.matchMedia('(pointer: coarse)').matches ||
    window.matchMedia('(max-width: 768px)').matches
  ) {
    return 'reduced'
  }
  return 'full'
}

// FE-10 perf fix: the previous version always rendered 8,000 particles,
// a 128x128-segment distort sphere, and a full post-processing chain
// (Bloom + Noise + Vignette) regardless of device. On mobile this alone
// produced ~38s of Total Blocking Time in Lighthouse (mobile), tanking
// the performance score to 50. Real users on mid-range phones don't need
// desktop-tier fidelity from a decorative background -- they need the
// page to be interactive quickly. This hook picks a cheaper quality tier
// for narrow/coarse-pointer viewports and for prefers-reduced-motion.
//
// The initial value is computed lazily in useState (not set from inside
// the effect body) so there's no synchronous setState-in-effect; the
// effect itself only ever calls setState from inside a subscribed
// "change" callback, matching React's recommended external-store pattern.
function use3DQuality(): Quality {
  const [quality, setQuality] = useState<Quality>(computeQuality)

  React.useEffect(() => {
    const coarsePointer = window.matchMedia('(pointer: coarse)')
    const narrowViewport = window.matchMedia('(max-width: 768px)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const update = () => setQuality(computeQuality())
    coarsePointer.addEventListener('change', update)
    narrowViewport.addEventListener('change', update)
    reducedMotion.addEventListener('change', update)
    return () => {
      coarsePointer.removeEventListener('change', update)
      narrowViewport.removeEventListener('change', update)
      reducedMotion.removeEventListener('change', update)
    }
  }, [])

  return quality
}

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

// CRITICAL: generate star positions OUTSIDE the component (module scope)
// so they're never recreated on render, for both quality tiers. Picking
// between them by tier avoids calling Math.random() during render/memo,
// which the project's stricter lint rules (react-hooks/purity) flag.
function makeStarPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
  }
  return positions
}

const starPositionsFull = makeStarPositions(8000)
const starPositionsReduced = makeStarPositions(1500)

function Scene({ quality }: { quality: 'full' | 'reduced' }) {
  const sphereRef = useRef<THREE.Mesh>(null!)
  const pointsRef = useRef<THREE.Points>(null!)
  const { mouse } = useThree()

  const starPositions = quality === 'full' ? starPositionsFull : starPositionsReduced
  const sphereSegments = quality === 'full' ? 128 : 32

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

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
        <Sphere ref={sphereRef} args={[1.2, sphereSegments, sphereSegments]}>
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

      {quality === 'full' && <FloatingShapes />}

      <Points ref={pointsRef} positions={starPositions}>
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
        Post-processing (Bloom/Noise/Vignette) is the single most
        expensive part of this scene on mobile GPUs -- it re-renders the
        full frame through multiple passes. Skipped entirely outside the
        "full" (desktop-class) tier.
      */}
      {quality === 'full' && (
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
      )}
    </>
  )
}

export const Background3D: React.FC = () => {
  const quality = use3DQuality()

  // Users who asked their OS for less motion get a plain static gradient
  // instead of an animated WebGL scene -- this is both an accessibility
  // courtesy (vestibular motion sensitivity) and a free performance win.
  if (quality === 'off') {
    return (
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background:
            'radial-gradient(circle at 50% 30%, #1e1b4b 0%, #020202 70%)',
        }}
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, background: '#020202' }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={quality === 'full' ? [1, 2] : [1, 1]}
        gl={{
          powerPreference: 'high-performance',
          alpha: false,
          antialias: false,
          stencil: false,
          depth: true
        }}
      >
        <Scene quality={quality} />
      </Canvas>
    </div>
  )
}
