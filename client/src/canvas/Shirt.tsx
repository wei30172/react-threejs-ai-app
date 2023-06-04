import { FC, useMemo } from 'react'
import { useSnapshot } from 'valtio'
import { easing } from 'maath'
import { useFrame } from '@react-three/fiber'
import { Decal, useGLTF, useTexture } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

import designState from '../store/designState'

type GLTFResult = GLTF & {
  nodes: {
    [name: string]: THREE.Mesh
  }
  materials: {
    [name: string]: THREE.MeshStandardMaterial
  }
}

const Shirt: FC = () => {
  const snap = useSnapshot(designState)

  const { nodes, materials } = useGLTF('/shirt_baked.glb') as GLTFResult

  const logoTexture = useTexture(snap.logoDecal)
  const fullTexture = useTexture(snap.fullDecal)

  //Smoothly transition the shirt's color to the color from state
  useFrame((_state, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta))


  // To re-render the component when state changes
  const stateString = useMemo(() => JSON.stringify(snap), [snap])
  
  return (
    <group key={stateString}>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {/* If full texture decal is enabled, render it */}
        {snap.isFullTexture && (
          <Decal 
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          />
        )}

        {/* If logo texture decal is enabled, render it */}
        {snap.isLogoTexture && (
          <Decal 
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTexture}
            map-anisotropy={16} // Sets anisotropic filtering for the texture map. Higher values enhance the texture quality, but may impact performance.
            depthTest={false} // Disables depth testing, allowing this object to be rendered on top of others.
            depthWrite={true} // Enables writing to the depth buffer for this object. The depth buffer determine which objects should be rendered on top of others.
          />
        )}
      </mesh>
    </group>
  )
}

export default Shirt