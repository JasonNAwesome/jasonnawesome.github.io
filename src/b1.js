import React, { Suspense, useState } from 'react'
import { Canvas} from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei'
import { EffectComposer, Pixelation } from '@react-three/postprocessing'
import { FontLoader } from 'three'
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
function HelloEmail(props) {
  // Thanks drei
  const font = new FontLoader().parse(AFont)
  const txtOptions = {font, size: 1, height: 0.05};
  return (
    <mesh {...props} 
          position={[0,2,16]}
          rotateY={Math.PI / 2}
          scale={.05}
          >
      <textGeometry attach='geometry' args={['jason@blootron.com', txtOptions]}/>
      <meshBasicMaterial color={'royalblue'} attach='material'/>
    </mesh>
  )
}
function Texto(props) {
  const font = new FontLoader().parse(AFont)
  const txtOptions = {font, size: 1, height: 0};
  // Set up states
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  return (
    <mesh {...props} 
          position={[-4,4,0]}
          onClick={(event) => setActive(window.open('https://twitter.com/jsn404'))}
          onPointerOver={(event) => setHover(true)}
          onPointerOut={(event) => setHover(false)}
          >
      <textGeometry attach='geometry' args={['blootron', txtOptions]}/>
      <meshBasicMaterial color={hovered || active ? 'red' : '#00BBFF'} attach='material'/>
    </mesh>
  )
}

/*function DreiBillboard(props) {
  const mesh = useRef()
  useFrame(({ camera }) => {
    if (mesh.current) {
      const prev = {
        x: mesh.current.rotation.x,
        y: mesh.current.rotation.y,
        z: mesh.current.rotation.z,
      }
      mesh.current.lookAt(camera.position)
    }
  })
  return <Plane args={[1,1,1]} ref={[mesh]} {...props}/>
}*/

export default function App() {
    return (
      <Canvas gl={
        {antialias: false}, 
        {setPixelRatio: (Math.min(window.devicePixelRatio, 2))},
        {powerPreference: 'low-power'}
      }
        >
          <PerspectiveCamera makeDefault 
            position={[0,5,20]}
            frustumCulled={true}
            />
          <OrbitControls />
          <Texto />
          <HelloEmail />
          <Suspense fallback={null}>
              <Model />
          </Suspense>
          <EffectComposer>
              <Pixelation granularity={4}/>
          </EffectComposer>
          <Stars radius={100} depth={5} count={500} factor={10} saturation={1} fade />
      </Canvas>
    )
}