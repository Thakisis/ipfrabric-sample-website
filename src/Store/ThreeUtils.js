import * as THREE from 'three'
import InstancedGroupMesh from "three-instanced-group-mesh"
// three modules for load models
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { SVGLoader } from 'three-stdlib'
import { SvgModels } from './SvgFiles'


//create Loaders for gltf,
export function createLoaders() {

  const loader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  const svgLoader = new SVGLoader()
  dracoLoader.setDecoderPath('/libs/draco/')
  loader.setDRACOLoader(dracoLoader)

  return { gltfloader: loader, svgLoader }
}

//load models of a certain stage. Need a callback for onUpdate for preloaders and other for onComplete for store scenes and materials
export function preloadModels({ stage, stagePreloadData: models, onUpdateLoadModel, onCompleteLoadModel, threeLoaders }) {

  const { gltfloader } = threeLoaders


  models.map((model, index) => {

    const { modelName, modelFile } = model
    let materials = undefined
    gltfloader.loadAsync(`/models/${modelFile}`,
      //progress function
      (xhr) => {
        onUpdateLoadModel({ modelName, stage, index, sizeLoaded: xhr.loaded })
      },
    )
      .then((gltf) => {
        // activate shadows on models
        gltf.scene.traverse(function (node) {
          if (node.isMesh) {
            node.castShadow = true
            node.receiveShadow = true
            // Materials gltf are used for load materials from blender for use in extrusion and other objects
            if (modelName === "Materials") {
              materials = { ...materials, [node.material.name]: node.material }
            }

          }

        })
        onCompleteLoadModel({ modelName, scene: gltf.scene, stage, materials })
      })
  })
  return
}



// create Geomtry from extrusion
export function createSVGExtrude() {


  const Meshes = {}
  const loader = new SVGLoader()
  const SVG = {}
  const SvgGeom = Object.keys(SvgModels).map((key) => {
    const SvgFiles = SvgModels[key]
    SvgFiles.svgList.map(svgfile => {
      const svgData = loader.parse(`${SvgFiles.openTag}${svgfile.code}${SvgFiles.closeTag}`)

      const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
      svgData.paths.forEach((path, i) => {
        const shapes = SVGLoader.createShapes(path)
        const geometry = new THREE.ExtrudeGeometry(shapes[0], {
          depth: svgfile.depth,
          bevelEnabled: false

        })
        let position = [0, 0, 0]
        if (svgfile.position) {
          const { position: pos } = svgfile
          position = [pos[0], pos[1], pos[2] - svgfile.depth / 2]
        } else {
          position = [0, 0, -1 * svgfile.depth / 2]
        }
        Meshes[`${svgfile.name}${i}`] = { geometry: geometry, materialName: svgfile.materialName, meshName: svgfile.name, position: position }
      })
    })
    SVG[key] = Meshes
    return
  })
  return SVG
}

//create mesh from extruded geometry after load materials
export function createExtrudeMeshes(Geom, materials) {


  const SVGMeshes = {}
  const SVGkeys = Object.keys(Geom)

  SVGkeys.map((key) => {

    const svg = Geom[key]
    const pathKeys = Object.keys(svg)
    const meshes = {}
    pathKeys.map((pathKey) => {
      const meshdata = svg[pathKey]
      const { geometry, materialName, meshName } = meshdata
      const material = materials[materialName]
      const mesh = new THREE.Mesh(geometry, material)
      meshes[pathKey] = { mesh, material }
    })
    SVGMeshes[key] = meshes
  })
  return (SVGMeshes)

}
export function addSVGtoScene({ meshes, scene }) {
  const group = new THREE.Group()
  console.log("*********")
  console.log(scene)
  console.log("*********")
  Object.values(meshes).map(meshData => {
    const { mesh, material } = meshData

    group.add(mesh)
    group.rotation.set(0, 0, 0)
    group.scale.set(-.0065, .0065, 0.08)
  })
  scene.add(group)
}
