import { PerspectiveCamera } from '../vendor/three.js'

export const createCamera = (opt = {}) => {
  const {
    fov = 35,
    aspect = 1,
    near = 0.1,
    far = 50,
    x,
    y,
    z,
  } = opt

  const camera = new PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(x, y, z)
  return camera
}
