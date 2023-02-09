import * as THREE from 'three'
import React, { useRef, useEffect } from 'react'
import { useStore } from '@/Store'
import { useThree } from '@react-three/fiber'
import { useTexture, Decal } from '@react-three/drei'
import { useControls } from 'leva'
export default function Model() {
  const [texture1, texture2] = useTexture(["/img/logoipfabricDecal.webp", "/img/SpinnerDecal.webp"])
  const { gl, scene } = useThree()

  const { ipfabric } = useStore(state => state.customScenes)
  const group = useRef()
  const { nodes, materials } = ipfabric
  const params = useControls({
    color: "#ffffff",
    transmission: 1,
    opacity: 1,
    metalness: 0,
    roughness: 0,
    ior: 1.5,
    thickness: 0.01,
    specularIntensity: 1,
    specularColor: 0xffffff,
    envMapIntensity: 1,
    lightIntensity: 1,
    exposure: 1

  })


  useEffect(() => {
    if (group.current) {



    }
  }, [group, gl, scene])



  return (


    <group ref={group} dispose={null} position={[0, 0, 3]}>
      <mesh geometry={nodes.Right.geometry} material={materials.BlackMetal} position={[0, 0, 0]} >
        {

          <Decal
            // Makes "bounding box" of the decal visible
            // Position of the decal
            //rotation={[0, 0, 0]} // Rotation of the decal (can be a vector or a degree in radians)
            position={[.275, .465, 0]}
            rotation={[0, 0, 0]}
            scale={[.2, .2, .5]}



          >
            <meshBasicMaterial map={texture2} transparent polygonOffset polygonOffsetFactor={-0.1} color={[2, 10, 0.4]} toneMapped={false} />
          </Decal>


        }
      </mesh>
      <mesh geometry={nodes.Left.geometry} material={materials.WhiteMetal} position={[0, 0, 0]} >
        {

          <Decal
            // Makes "bounding box" of the decal visible
            // Position of the decal
            //rotation={[0, 0, 0]} // Rotation of the decal (can be a vector or a degree in radians)
            position={[-.20, .936, 0]}
            rotation={[0, 0, 0]}
            scale={[.2, .2, .5]}
          >
            <meshBasicMaterial map={texture2} transparent polygonOffset polygonOffsetFactor={-0.1} color={[2, 0.5, 10]} toneMapped={false} />
          </Decal>


        }
      </mesh>
      <mesh geometry={nodes.Center.geometry}
      >


        {



          <Decal
            // Makes "bounding box" of the decal visible
            position={[.04, .70, 0]} // Position of the decal
            rotation={[0, 0, 0]} // Rotation of the decal (can be a vector or a degree in radians)
            scale={1.4}



          >
            <meshBasicMaterial map={texture1} transparent polygonOffset polygonOffsetFactor={-0.1} color={[2, 0.5, 10]} toneMapped={false} />
          </Decal>

        }
      </mesh>

    </group>
  )
}









function init(gl, scene, group) {
  const localPlane = new THREE.Plane(new THREE.Vector3(0, - 1, 0), 0.1)

  const baseMat = new THREE.MeshBasicMaterial()
  baseMat.depthWrite = false
  baseMat.depthTest = false
  baseMat.colorWrite = false
  baseMat.stencilWrite = true
  baseMat.stencilFunc = THREE.AlwaysStencilFunc

  const material = new THREE.MeshBasicMaterial({
    color: 0x80ee10,

    side: THREE.DoubleSide,

    // ***** Clipping setup (material): *****
    clippingPlanes: [localPlane],
    clipShadows: true

  })
  const helper = new THREE.PlaneHelper(localPlane, 2, 0xff0000)
  const geometry = new THREE.TorusKnotGeometry(0.4, 0.08, 95, 20)

  const object = new THREE.Mesh(geometry, material)
  object.castShadow = true
  scene.add(object)
  scene.add(helper)

  // ***** Clipping setup (renderer): *****

  const Empty = Object.freeze([])
  gl.clippingPlanes = [clippingPlanes]// GUI sets it to globalPlanes
  gl.localClippingEnabled = true


  const poGroup = new THREE.Group()
  const stencilGroup = createPlaneStencilGroup(geometry, localPlane,)

  const planeMat =
    new THREE.MeshStandardMaterial({

      color: 0xE91E63,
      metalness: 0.1,
      roughness: 0.,


      stencilWrite: true,
      stencilRef: 0,
      stencilFunc: THREE.NotEqualStencilFunc,
      stencilFail: THREE.ReplaceStencilOp,
      stencilZFail: THREE.ReplaceStencilOp,
      stencilZPass: THREE.ReplaceStencilOp,

    })
  const planeGeom = new THREE.PlaneGeometry(4, 4)

  const po = new THREE.Mesh(planeGeom, planeMat)
  po.onAfterRender = function (renderer) {

    renderer.clearStencil()

  }

  po.renderOrder = 1.1

  object.add(stencilGroup)
  poGroup.add(po)

  scene.add(poGroup)



}


function createPlaneStencilGroup(geometry, plane, renderOrder) {

  const group = new THREE.Group()
  const baseMat = new THREE.MeshBasicMaterial()
  baseMat.depthWrite = false
  baseMat.depthTest =
    baseMat.colorWrite = false
  baseMat.stencilWrite = true
  baseMat.stencilFunc = THREE.AlwaysStencilFunc

  // back faces
  const mat0 = baseMat.clone()
  mat0.side = THREE.BackSide
  mat0.clippingPlanes = [plane]
  mat0.stencilFail = THREE.IncrementWrapStencilOp
  mat0.stencilZFail = THREE.IncrementWrapStencilOp
  mat0.stencilZPass = THREE.IncrementWrapStencilOp

  const mesh0 = new THREE.Mesh(geometry, mat0)
  mesh0.renderOrder = renderOrder
  group.add(mesh0)

  // front faces
  const mat1 = baseMat.clone()
  mat1.side = THREE.FrontSide
  mat1.clippingPlanes = [plane]
  mat1.stencilFail = THREE.DecrementWrapStencilOp
  mat1.stencilZFail = THREE.DecrementWrapStencilOp
  mat1.stencilZPass = THREE.DecrementWrapStencilOp

  const mesh1 = new THREE.Mesh(geometry, mat1)
  mesh1.renderOrder = renderOrder

  group.add(mesh1)

  return group

}



