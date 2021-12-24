import {
  BoxBufferGeometry,
  Mesh,
  MeshBasicMaterial,
  MathUtils,
} from '../vendor/three.js'

export const createCube = (opt = {}) => {
  const { width = 2, height = 2, depth = 2, color = '#4000ff' } = opt
  const geometry = new BoxBufferGeometry(width, height, depth)
  const material = new MeshBasicMaterial({ color })
  const cube = new Mesh(geometry, material)
  cube.rotation.x = MathUtils.degToRad(-60)
  cube.rotation.y = MathUtils.degToRad(-45)
  cube.rotation.z = MathUtils.degToRad(60)
  return cube
}
