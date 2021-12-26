import { PerspectiveCamera } from '../vendor/three.js'

export const createCamera = (opt = {}) => {
  const {
    fov = 35,
    aspect = 1,
    near = 0.1,
    far = 100,
    x = 0,
    y = 0,
    z = 10,
  } = opt

  const camera = new PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(x, y, z)
  return camera
}
