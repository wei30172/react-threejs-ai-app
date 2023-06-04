import { FC, ReactNode, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'

interface CameraRigProps {
  children: ReactNode
}

const CameraRig: FC<CameraRigProps>  = ({ children } ) => {
  const group = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    // Adjust target position based on window width
    const targetPosition: [number, number, number] = [0, 0, 2]

    // Gradually move the camera to the target position
    easing.damp3(state.camera.position, targetPosition , 0.25, delta)

    // If the group is present, adjust its rotation based on the pointer position
    if (group.current) {
      easing.dampE(
        group.current.rotation,
        [state.pointer.y / 5, -state.pointer.x / 2, 0],
        0.1,
        delta
      )
    }
  })

  return <group ref={group}>{children}</group>
}

export default CameraRig