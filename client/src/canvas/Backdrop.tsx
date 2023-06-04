import { FC } from 'react'
import { AccumulativeShadows, RandomizedLight } from '@react-three/drei'

const Backdrop: FC = () => {

  return (
    <AccumulativeShadows
      temporal // Enable temporal accumulation (blending shadows over several frames)
      frames={30} // Number of frames to accumulate over
      alphaTest={0.65} // Pixels with an alpha lower than this value will not cast a shadow
      scale={10} // Scale the shadow map (increasing this improves quality but decreases performance)
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.2]}
    >
      <RandomizedLight 
        amount={3}
        radius={8}
        intensity={0.4}
        ambient={0.2}
        position={[4, 6, -8]}
      />
      <RandomizedLight 
        amount={5}
        radius={6}
        intensity={0.2}
        ambient={0.6}
        position={[-4, 4, -7]}
      />
      <RandomizedLight 
        amount={2}
        radius={7}
        intensity={0.3}
        ambient={0.5}
        position={[0, 5, -8]}
      />
    </AccumulativeShadows>
  )
}

export default Backdrop