import { useMemo } from 'react'
import { easing } from 'maath'
import { useFrame } from '@react-three/fiber'
import { Decal, useGLTF, useTexture } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useSelector } from 'react-redux'
import { Euler, Vector3 } from 'three'
import { RootState } from '../store'

type GLTFResult = GLTF & {
  nodes: {
    [name: string]: THREE.Mesh
  }
  materials: {
    [name: string]: THREE.MeshStandardMaterial
  }
}

const Shirt: React.FC = () => {
  const designInfo = useSelector((state: RootState) => state.design)

  const { nodes, materials } = useGLTF('/shirt_baked_free.glb') as GLTFResult

  const logoTexture = useTexture(designInfo.logoDecalPhoto)
  const fullTexture = useTexture(designInfo.fullDecalPhoto)

  //Smoothly transition the shirt's color to the color from state
  useFrame((_state, delta) => easing.dampC(materials.lambert1.color, designInfo.color, 0.25, delta))

  // To re-render the component when state changes
  const stateString = useMemo(() => JSON.stringify(designInfo), [designInfo])
  
  const rotation = new Euler(Math.PI / 2, 0, 0) // Default: new Euler(0, 0, 0), Use new Euler(Math.PI / 2, 0, 0) for horizontal flip
  const scale = new Vector3(1, -1, 1) // Default: new Euler(1, 1, 1), Use new Vector3(1, -1, 1) for horizontal flip

  const scaleVector = (vector: Vector3, scaleFactor: number): Vector3 => {
    const scale = new Vector3(vector.x * scaleFactor, vector.y * scaleFactor, 1)
    return scale
  }

  return (
    <group key={stateString}>
      <mesh
        castShadow
        rotation={rotation} // {[0, 0, 0]} or {[Math.PI / 2, 0, 0]}
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {/* If full texture decal is enabled, render it */}
        {designInfo.isFullTexture && (
          <Decal 
            position={[0, 0, 0]}
            rotation={rotation} // {[0, 0, 0]} or {[Math.PI / 2, 0, 0]}
            scale={scale} // {[1, 1, 1]} or {[1, -1, 1]}
            map={fullTexture}
          />
        )}

        {/* If logo texture decal is enabled, render it */}
        {designInfo.isLogoTexture && (
          <Decal 
            position={[0, 0.5, 0]}
            rotation={rotation} // {[0, 0, 0]} or {[Math.PI / 2, 0, 0]}
            scale={scaleVector(scale, 0.2)} // {[0.2, 0.2, 1]} or {[0.2, -0.2, 1]}
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