import { ReactNode, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'

interface CameraRigProps {
  children: ReactNode
  autoRotateSpeed?: number
}

const CameraRig: React.FC<CameraRigProps>  = ({ children, autoRotateSpeed = 0.5 } ) => {
  const group = useRef<THREE.Group>(null)
  const [isMouseMoving, setMouseMoving] = useState(false)

  useFrame((state, delta) => {
    // Adjust target position based on window width
    const targetPosition: [number, number, number] = [0, 0, 2]

    // Gradually move the camera to the target position
    easing.damp3(state.camera.position, targetPosition , 0.25, delta)

    // If the group is present, adjust its rotation based on the pointer position
    if (group.current) {
      if (isMouseMoving) {
        // Rotate based on mouse movement
        easing.dampE(
          group.current.rotation,
          [state.pointer.y / 5, -state.pointer.x * 2, 0],
          0.1,
          delta
        )
      } else {
        // Auto-rotate
        group.current.rotation.y += autoRotateSpeed * delta
      }
    }
  })

  // Track mouse movement
  const handlePointerOver = () => {
    setMouseMoving(true)
  }

  // Track mouse stoppage
  const handlePointerOut = () => {
    setMouseMoving(false)
  }

  return (
    <group
      ref={group}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {children}
    </group>
  )
}

export default CameraRig