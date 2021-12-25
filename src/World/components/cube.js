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
  cube.rotation.set(-0.5, -0.1, 0.8)
  const radiansPerSecond = MathUtils.degToRad(30)
  cube.tick = ({ delta }) => {
    cube.rotation.x += radiansPerSecond * delta
    cube.rotation.y += radiansPerSecond * delta
    cube.rotation.z += radiansPerSecond * delta
  }
  return cube
}
