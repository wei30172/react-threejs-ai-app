import { FC } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Center } from '@react-three/drei'

import Shirt from './Shirt'
import Backdrop from './Backdrop'
import CameraRig from './CameraRig'
import './index.scss'

const CanvasModel: FC = () => {
  return (
    // Create a canvas for 3D rendering
    <Canvas
      shadows // Enable shadow mapping
      camera={{ position: [0, 0, 0], fov: 25 }} // Set the camera's position and field of view
      className="canvas"
      gl={{ preserveDrawingBuffer: true }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault()
        }, false)
      }}
    >
      <ambientLight intensity={0.5} />
      <Environment preset="city" />

      <CameraRig>
        <Backdrop />
        <Center>
          <Shirt />
        </Center>
      </CameraRig>
    </Canvas>
  )
}

export default CanvasModel