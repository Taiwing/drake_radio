import { BoxBufferGeometry, Mesh, MeshBasicMaterial } from '../vendor/three.js'

export const createCube = (opt = {}) => {
  const { width = 2, height = 2, depth = 2 } = opt
  const geometry = new BoxBufferGeometry(width, height, depth)
  const material = new MeshBasicMaterial()
  const cube = new Mesh(geometry, material)
  return cube
}
