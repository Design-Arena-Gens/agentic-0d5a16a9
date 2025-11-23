'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import { useRef, useState, useMemo } from 'react'
import * as THREE from 'three'

function FloatingCoin({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + offset) * 0.1
      meshRef.current.rotation.y += 0.02
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
      <meshStandardMaterial
        color="#ffd700"
        metalness={0.9}
        roughness={0.1}
        emissive="#ffa500"
        emissiveIntensity={hovered ? 0.5 : 0.2}
      />
    </mesh>
  )
}

function FloatingNumber({ position, number }: { position: [number, number, number], number: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + offset) * 0.15
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.3, 0.4, 0.05]} />
      <meshStandardMaterial
        color="#00ff88"
        emissive="#00ff88"
        emissiveIntensity={1.5}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

function Container() {
  const groupRef = useRef<THREE.Group>(null)
  const [autoRotate, setAutoRotate] = useState(true)

  useFrame(() => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += 0.003
    }
  })

  // Create corrugated texture pattern
  const corrugatedTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!

    // Create vertical corrugated pattern
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.fillStyle = i % 40 === 0 ? '#1a1a2e' : '#0f0f1e'
      ctx.fillRect(i, 0, 20, canvas.height)
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
  }, [])

  const coins = useMemo(() => [
    [-0.8, 0.2, 1.2],
    [-0.4, -0.3, 1.2],
    [0.3, 0.5, 1.2],
    [0.7, -0.1, 1.2],
    [-0.2, 0.8, 1.2],
  ], [])

  const numbers = useMemo(() => [
    [-0.6, 0.6, 1.15],
    [0.5, 0.2, 1.15],
    [-0.3, -0.5, 1.15],
    [0.8, 0.7, 1.15],
    [0.1, -0.2, 1.15],
  ], [])

  return (
    <>
      <group ref={groupRef}>
        {/* Main container body - dark glass */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4, 2.5, 2]} />
          <meshPhysicalMaterial
            color="#0a0a1a"
            transparent
            opacity={0.3}
            metalness={0.9}
            roughness={0.1}
            transmission={0.9}
            thickness={0.5}
            envMapIntensity={1.5}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Corrugated panels overlay */}
        <mesh position={[0, 0, 1.01]} castShadow>
          <planeGeometry args={[3.8, 2.3]} />
          <meshStandardMaterial
            map={corrugatedTexture}
            transparent
            opacity={0.6}
            metalness={0.8}
            roughness={0.4}
            normalScale={new THREE.Vector2(0.5, 0.5)}
          />
        </mesh>

        <mesh position={[0, 0, -1.01]} rotation={[0, Math.PI, 0]} castShadow>
          <planeGeometry args={[3.8, 2.3]} />
          <meshStandardMaterial
            map={corrugatedTexture}
            transparent
            opacity={0.6}
            metalness={0.8}
            roughness={0.4}
          />
        </mesh>

        {/* Container edges/frame - darker */}
        <mesh position={[0, 1.3, 0]}>
          <boxGeometry args={[4.1, 0.1, 2.1]} />
          <meshStandardMaterial color="#050510" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, -1.3, 0]}>
          <boxGeometry args={[4.1, 0.1, 2.1]} />
          <meshStandardMaterial color="#050510" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Vertical edges */}
        <mesh position={[2.05, 0, 0]}>
          <boxGeometry args={[0.1, 2.5, 2.1]} />
          <meshStandardMaterial color="#050510" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[-2.05, 0, 0]}>
          <boxGeometry args={[0.1, 2.5, 2.1]} />
          <meshStandardMaterial color="#050510" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Floating gold coins inside */}
        {coins.map((pos, i) => (
          <FloatingCoin key={`coin-${i}`} position={pos as [number, number, number]} />
        ))}

        {/* Floating neon green numbers */}
        {numbers.map((pos, i) => (
          <FloatingNumber
            key={`num-${i}`}
            position={pos as [number, number, number]}
            number={`${i}`}
          />
        ))}

        {/* Neon green glow from inside */}
        <pointLight position={[0, 0, 0.8]} color="#00ff88" intensity={3} distance={3} />
        <pointLight position={[0, 0, -0.8]} color="#00ff88" intensity={2} distance={3} />

        {/* Gold accent lights */}
        <pointLight position={[-0.5, 0, 1]} color="#ffd700" intensity={1.5} distance={2} />
        <pointLight position={[0.5, 0, 1]} color="#ffd700" intensity={1.5} distance={2} />
      </group>

      <div className="controls">
        <button onClick={() => setAutoRotate(!autoRotate)}>
          {autoRotate ? 'Stop Rotation' : 'Auto Rotate'}
        </button>
        <button onClick={() => {
          const canvas = document.querySelector('canvas')
          if (canvas) {
            const link = document.createElement('a')
            link.download = 'app-icon.png'
            link.href = canvas.toDataURL('image/png')
            link.click()
          }
        }}>
          Download Icon
        </button>
      </div>
    </>
  )
}

export default function Scene() {
  return (
    <Canvas
      shadows
      gl={{
        preserveDrawingBuffer: true,
        antialias: true,
        alpha: true
      }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <color attach="background" args={['#000814']} />
      <fog attach="fog" args={['#000814', 5, 15]} />

      <PerspectiveCamera makeDefault position={[5, 3, 7]} fov={50} />
      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2}
      />

      {/* Dramatic lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        color="#4a5fff"
      />
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.8}
        color="#00ff88"
      />
      <spotLight
        position={[0, 5, 0]}
        angle={0.6}
        penumbra={1}
        intensity={2}
        castShadow
        color="#ffffff"
      />

      <Container />

      <Environment preset="night" />
    </Canvas>
  )
}
