import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { EffectComposer, Pixelation } from '@react-three/postprocessing'
import * as THREE from 'three'
import Model from './Cg.js'
import AFont from '../static/fonts/f.json'

/*
function Box(props) {
  // Get direct access to mesh
  const mesh = useRef();
  // Set up states
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Attach this component to render-loop; then rotate mesh every frame
  useFrame((stuate, delta) => (mesh.current.rotation.x += 0.01))
  // Return view w/ 3js elements in JSX
  return (
    <mesh 
      {...props} 
      ref={mesh} 
      scale={active ? 1.5 : 1} 
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
      >
      <octahedronGeometry args={[.5,1]}/>
      <meshStandardMaterial color={hovered ? 'blue': 'red'} />
    </mesh>
  )
}
*/
function Texto(props) {
  const font = new THREE.FontLoader().parse(AFont)
  const txtOptions = {font, size: 1, height: 0.75};
  // Set up states
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  return (
    <mesh {...props} 
          position={[-4,4,0]}
          onClick={(event) => setActive(window.open("https://twitter.com/jsn404"))}
          onPointerOver={(event) => setHover(true)}
          onPointerOut={(event) => setHover(false)}
          >
      <textGeometry attach='geometry' args={['blootron', txtOptions]}/>
      <meshBasicMaterial color={hovered ? 'red': 'blue'} attach='material'/>
    </mesh>
  )
}

export default function App() {
    return (
        <Canvas>
            <PerspectiveCamera makeDefault position={[0,5,18]}/>
            <OrbitControls />
            <Texto />
            <Suspense fallback={null}>
                <Model />
            </Suspense>
            <EffectComposer>
                <Pixelation granularity={4}/>
            </EffectComposer>
        </Canvas>
    )
}